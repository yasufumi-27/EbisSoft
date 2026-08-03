#!/usr/bin/env bash
#
# さくらのレンタルサーバ（本番）へのデプロイ。ビルド → アップロード → 疎通確認まで行う。
#
#   npm run deploy:sakura
#
# GitHub Actions からは実行できない。さくらの「国外IPアドレスフィルタ」が
# 国外からのFTP接続を遮断しており、runner（米国IP）は接続すらできないため
# （lftp が `max-retries exceeded` で落ちる）。日本国内から実行すること。
#
# 認証情報は ~/.netrc に置く（このスクリプトには書かない）：
#
#   printf 'machine ebisusoft.sakura.ne.jp login ebisusoft password サーバーパスワード\n' > ~/.netrc
#   chmod 600 ~/.netrc
#
# パスワードは「サーバーパスワード」。さくらの会員パスワードとは別物で、
# コントロールパネル > サーバー情報 > パスワード変更 で設定できる。

set -euo pipefail

HOST="ebisusoft.sakura.ne.jp"
# FTPはchrootされていて、ログイン直後の / が既に /home/ebisusoft。
# /home/ebisusoft/www と書くと /home/ebisusoft/home/ebisusoft/www が新規作成され、
# 転送は成功するのに公開されない、という分かりにくい失敗になる。
REMOTE_DIR="/www"
SITE="https://${HOST}"

cd "$(dirname "$0")/.."

if ! command -v lftp >/dev/null 2>&1; then
  echo "エラー: lftp が見つかりません。 brew install lftp" >&2
  exit 1
fi

if ! grep -q "machine ${HOST}" ~/.netrc 2>/dev/null; then
  echo "エラー: ~/.netrc に ${HOST} の認証情報がありません。" >&2
  echo "  printf 'machine ${HOST} login ebisusoft password サーバーパスワード\\n' > ~/.netrc" >&2
  echo "  chmod 600 ~/.netrc" >&2
  exit 1
fi

echo "▶ ビルド（静的書き出し＋事前圧縮）"
npm run build:sakura

echo "▶ アップロード → ${HOST}:${REMOTE_DIR}"
# --delete: out/ から消えたファイルはリモートからも消す
# タイムアウト類は必ず指定する。無指定だと接続が詰まったとき延々リトライする。
lftp -c "
  set ftp:ssl-force true;
  set ftp:ssl-protect-data true;
  set ssl:verify-certificate no;
  set ftp:passive-mode true;
  set net:timeout 15;
  set net:max-retries 3;
  set net:reconnect-interval-base 5;
  set cmd:fail-exit true;
  open ${HOST};
  mirror --reverse --delete --parallel=2 --exclude-glob .git/ out/ ${REMOTE_DIR};
"

echo "▶ 疎通確認"
fail=0
for p in "" ai web embedded company contact faq request privacy demo demo/3dcg \
         sitemap.xml robots.txt llms.txt; do
  code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 25 "${SITE}/${p}")
  printf '  %s  /%s\n' "$code" "$p"
  [ "$code" = "200" ] || fail=1
done

# 存在しないURLはカスタム404（サイズが大きい）が返るのが正しい
code=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 25 "${SITE}/_deploy-check-404")
printf '  %s  /_deploy-check-404（404が正常）\n' "$code"
[ "$code" = "404" ] || fail=1

if [ "$fail" != "0" ]; then
  echo "✗ 応答が期待どおりでないURLがあります" >&2
  exit 1
fi

echo "✓ デプロイ完了: ${SITE}"
