# Buffer FreeでのInstagram自動投稿

## 方針

- 投稿は **毎日2本**（AIニュース／AI知識）。
- Buffer Freeの上限は、Instagramチャンネルにつき同時予約10本。
- このプロジェクトでは **8本（4日分）** を目標にし、余裕2本を残す。
- 毎日02:30（JST）に最大2本を補充する。投稿時刻は過去の投稿実績から朝・午後それぞれ自動選択する。

これにより、無料枠を超えず、投稿が遅れても少なくとも3日分の予約を保てます。

## 初回設定

1. Buffer Freeに登録し、`@yebisusoft` をプロアカウントとして接続する。
2. BufferのInstagramチャンネルで、タイムゾーンが **Asia/Tokyo**、投稿枠が1日2回になっていることを確認する。
3. Buffer Settings > APIで個人用APIキーを1本作る。
4. `.env.local` に次を追加する。組織IDとチャンネルIDは自動判別される。

```env
BUFFER_API_KEY=...
```

## 実行

```powershell
npm run social:buffer:test # APIやGitへ書き込まず、サンプルのReel MP4を生成
npm run social:buffer:check # 投稿を作らず、Buffer接続と予約件数を確認
npm run social:buffer:performance # 指標取得と改善方針だけを更新
npm run social:buffer:fill # 実際にBufferの予約キューを補充
# 送信失敗後、既にGitHubへ公開済みの動画だけを予約する場合
npm run social:buffer:fill -- --publish-existing 2026-09-10
```

Windowsタスクの登録は次を一度だけ実行します。

```powershell
powershell -ExecutionPolicy Bypass -File scripts/social-buffer/register-buffer-task.ps1
```

## メディアの公開先

Buffer APIはローカルファイルを受け取れず、公開HTTPS URLからMP4を取得します。そのため、この処理は生成した動画を `public/social/instagram/` へ配置し、`main` ブランチへ**その動画ファイルだけ**をコミット・pushします。BufferにはGitHub rawの恒久URLを渡します。

ローカルのGitHub認証と、Codex CLIのChatGPTサブスクリプション認証が同じWindowsユーザーで使える状態にしてください。GitHubやBufferへ秘密情報をコミットしません。

## 日々の改善ループ

毎日02:30のキュー補充時に、Bufferから送信済み投稿50件までの指標を取得します。対象は `views` / `reach` / `impressions` / `saves` / `shares` / `comments` / `reactions` / 視聴時間です。

- **投稿時間**：AIニュースは 07:30 / 08:30 / 09:30 / 10:30、AI知識は 15:30 / 17:00 / 18:30 / 20:00 を候補にする。最初は各時刻を探索し、実績が揃った後は成績と未検証時間の探索を両立して選ぶ。
- **投稿内容**：カテゴリごとの好調投稿・低調投稿を抽出し、次回のCodex CLIプロンプトへ渡す。好調な切り口を参考にしながら、同じ題材や表現の繰り返しは避ける。
- **評価**：100点満点（閲覧規模40点、反応率40点、視聴時間20点）。保存・共有・コメントを強めに評価する。
- **履歴**：`social-data/instagram-performance.json` に保存する。このファイルはローカル専用でGitには含めない。

同時に、ジャービス用データを既定で `~/dev/jarvis/ebissoft/instagram/` へ出力します。別の場所にする場合は `.env.local` の `JARVIS_EBISSOFT_SOCIAL_DIR` で変更できます。

- `latest.json`：最新集計、採用時刻、改善方針、関連ファイル一覧
- `posts.jsonl` / `posts.csv`：投稿日時、本文、閲覧、リーチ、保存、反応、スコア
- `history.jsonl`：公開投稿の日次スナップショット。同日再実行時は重複せず最新値に更新
- `posts/*.json`：投稿単位の最新値と全履歴
- `charts/posts/*.svg`：各投稿の閲覧・反応・スコア推移
- `charts/overview.svg`：全投稿のスコア推移
- `schema.json`：ジャービスが参照するためのデータ契約

実績がない期間は、AIニュース 07:30、AI知識 15:30から開始します。投稿が送信され、Bufferに指標が反映されると自動的に改善が始まります。
