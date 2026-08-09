# ブランド素材（ロゴ・名刺）

印刷・資料用の素材です。**サイトには配信されません**（`public/` の外に置いてあります）。

すべて `scripts/brand-assets.py` が生成します。連絡先や代表者名を変えたら、
`src/lib/site.ts` / `src/lib/author.ts` を直したうえで再実行してください。

```bash
python3 scripts/brand-assets.py
```

ロゴの文字は、画面のロゴ（`src/components/site/CompanyLogo.tsx`）とまったく同じ
Geist Black の輪郭（`src/components/fx/logoFont.json`）から起こしています。
**SVGが正データ**で、PNGはその書き出しです。入稿はSVG（またはSVGから作ったPDF/AI）を推奨します。

## ロゴ単体 — `logo/`

| ファイル | 中身 | 使いどころ |
| --- | --- | --- |
| `yebisu-soft-mark.svg` / `.png` | マークのみ（**背景透過**・正方形 2048px） | 資料の隅、印章的な使い方 |
| `yebisu-soft-mark-navy.svg` / `.png` | マークのみ（ネイビーの角丸地・2048px） | SNSのアイコン、アプリアイコン |
| `yebisu-soft-logo-horizontal-onlight.svg` / `.png` | マーク＋ワードマーク（**背景透過**／`YEBISU` はネイビー・2600px） | 白・薄い色の紙面、白背景のスライド |
| `yebisu-soft-logo-horizontal-ondark.svg` / `.png` | マーク＋ワードマーク（ネイビー地／`YEBISU` は白・2600px） | 濃色背景のスライド、封筒 |

ワードマークは `YEBISU`（白またはネイविー）＋ `SOFT`（シアン `#22d3ee`）。
**社名の英字表記を使ってよいのはロゴだけ**で、本文・見出しはカタカナの「エビスソフト」です。

## 名刺 — `meishi/`

- 仕上がり **91 × 55mm**（日本の標準サイズ）
- **裁ち落とし（塗り足し）各3mm** 込みで 97 × 61mm、350dpi ＝ 1337 × 841px
- 文字は仕上がりから4mm内側（安全枠）に収めてあります

| ファイル | 中身 |
| --- | --- |
| `yebisu-soft-meishi-front.svg` / `.png` | 表：ロゴ／代表者名／住所・TEL・メール・URL（ネイビー地） |
| `yebisu-soft-meishi-back.svg` / `.png` | 裏：事業内容3本柱（AI活用／Web制作／組み込み・IoT）（白地） |
| `*-guides.svg` / `.png` | 仕上がり線（赤）と安全枠（青破線）入り。**確認用。入稿しないこと** |

### 入稿時の注意

- 印刷所に渡すのは `-guides` が**付いていない**ほうです。
- SVGの和文は `Hiragino Sans` などのシステムフォント参照です。入稿先でフォントが違うと
  字形が変わるため、**入稿前に文字をアウトライン化**するか、PNG（350dpi）で渡してください。
- 色はRGBです。オフセット印刷でCMYK指定を求められた場合は、
  ネイビー `#0f2e5f`／シアン `#22d3ee`／赤 `#a51f38` を近似値に変換してもらってください。
- QRコードは入れていません。必要なら印刷所の面付けデータ側で追加するか、ご相談ください。

## `archive/`

旧ロゴ（`EBISU` 表記時代の3Dモデル書き出し画像）です。**現在の表記は `YEBISU` なので使えません**。
経緯を残すためだけに置いてあります。
