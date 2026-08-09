#!/usr/bin/env python3
"""
ブランド素材（ロゴ単体・名刺）を生成する。

    python3 scripts/brand-assets.py

出力先は `assets/brand/`（サイトには配信されない。印刷・資料用）。

【なぜスクリプトで作るか】
ロゴの文字は Geist Black（SIL OFL 1.1）の輪郭を `src/components/fx/logoFont.json`
（three.js の typeface 形式）から起こしています。画面のロゴ（`CompanyLogo.tsx` /
`logo3d.ts`）とまったく同じ輪郭なので、名刺と画面でロゴがずれません。
社名や住所は `src/lib/site.ts` から読むため、連絡先を変えたらこれを再実行するだけで
名刺のデータも最新になります。

【PNGの書き出し】
rsvg-convert / Inkscape / ImageMagick がこの環境に無いため、**ヘッドレスChrome**で
ラスタライズしています（`qlmanage` は正方形にしか書き出せず名刺が崩れる）。
Chromeが無い環境ではSVGだけが出ます。SVGが正で、PNGはその書き出しです。
"""

from __future__ import annotations

import json
import re
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "brand"
FONT = json.loads((ROOT / "src" / "components" / "fx" / "logoFont.json").read_text())
GLYPHS = FONT["glyphs"]
RES = FONT["resolution"]

# ------------------------------------------------------------------ ブランド色
NAVY = "#0f2e5f"          # 地色（ファビコン・Appleアイコンと同じ）
NAVY_DEEP = "#081a36"     # 名刺の暗い側
LETTER_BLUE = "#2f6cb0"   # ロゴの文字（3Dモデルの LOGO_BLUE）
SOFT_RED = "#a51f38"      # 「Soft」の赤
CYAN = "#22d3ee"          # ブランドカラー
CYAN_PALE = "#d8f7ff"
INK = "#0b1220"
PAPER = "#ffffff"
GRAY = "#5b6b82"

# ------------------------------------------------------------------ 掲載情報
# `src/lib/site.ts` / `src/lib/author.ts` から機械的に読む（手書きしない）
def _pick(path: str, pattern: str) -> str:
    text = (ROOT / path).read_text(encoding="utf-8")
    m = re.search(pattern, text)
    if not m:
        raise SystemExit(f"{path} から {pattern} を読めませんでした")
    return m.group(1)


COMPANY = _pick("src/lib/site.ts", r'legalName: "(.+?)"')
TEL = _pick("src/lib/site.ts", r'telephoneDisplay: "(.+?)"')
EMAIL = _pick("src/lib/site.ts", r'email: "(.+?)"')
POSTAL = _pick("src/lib/site.ts", r'postalCode: "(.+?)"')
REGION = _pick("src/lib/site.ts", r'region: "(.+?)"')
LOCALITY = _pick("src/lib/site.ts", r'locality: "(.+?)"')
STREET = _pick("src/lib/site.ts", r'street: "(.+?)"')
HOURS = _pick("src/lib/site.ts", r'openingHoursDisplay: "(.+?)"')
MEMBER = _pick("src/lib/site.ts", r'name: "(京都商工会議所)"')
PERSON = _pick("src/lib/author.ts", r'const PERSON_NAME = "(.+?)"')
PERSON_EN = _pick("src/lib/author.ts", r'personNameRomaji: "(.+?)"')
ROLE = _pick("src/lib/author.ts", r'personRole: "(.+?)"')
URL_DISPLAY = "www.yebisusoft.jp"

ADDRESS = f"〒{POSTAL} {REGION}{LOCALITY}{STREET}"

# 名刺の和文フォント。SVGを開く環境に無い場合に備えて順に指定する
JP = "'Hiragino Sans','Hiragino Kaku Gothic ProN','Noto Sans JP','Yu Gothic',sans-serif"
EN = "'Helvetica Neue',Arial,sans-serif"


# ------------------------------------------------------------------ 文字の輪郭
def glyph_path(text: str, size: float = 100.0, spacing: float = 2.0):
    """typeface 形式のアウトラインをSVGパスへ変換する（ベースライン基準・y上向きが負）。

    `CompanyLogo.tsx` のパスと同じ手順で作っているので、出力も一致します。
    """
    scale = size / RES
    out: list[str] = []
    off = 0.0
    x_min, x_max = 1e9, -1e9
    for ch in text:
        g = GLYPHS[ch]
        t = g["o"].split()
        i = 0
        started = False
        while i < len(t):
            cmd = t[i]
            i += 1
            if cmd == "m":
                if started:
                    out.append("Z")
                x = float(t[i]) * scale + off
                y = -float(t[i + 1]) * scale
                i += 2
                out.append(f"M{x:.2f} {y:.2f}")
                started = True
            elif cmd == "l":
                x = float(t[i]) * scale + off
                y = -float(t[i + 1]) * scale
                i += 2
                out.append(f"L{x:.2f} {y:.2f}")
            elif cmd == "q":
                # typeface 形式は「終点 → 制御点」の順
                x = float(t[i]) * scale + off
                y = -float(t[i + 1]) * scale
                cx = float(t[i + 2]) * scale + off
                cy = -float(t[i + 3]) * scale
                i += 4
                out.append(f"Q{cx:.2f} {cy:.2f} {x:.2f} {y:.2f}")
            elif cmd == "b":
                x = float(t[i]) * scale + off
                y = -float(t[i + 1]) * scale
                ax = float(t[i + 2]) * scale + off
                ay = -float(t[i + 3]) * scale
                bx = float(t[i + 4]) * scale + off
                by = -float(t[i + 5]) * scale
                i += 6
                out.append(f"C{ax:.2f} {ay:.2f} {bx:.2f} {by:.2f} {x:.2f} {y:.2f}")
            elif cmd == "z":
                out.append("Z")
                started = False
        x_min = min(x_min, g["x_min"] * scale + off)
        x_max = max(x_max, g["x_max"] * scale + off)
        off += g["ha"] * scale + spacing
    if out and out[-1] != "Z":
        out.append("Z")
    return " ".join(out), x_min, x_max


# Geist Black に F が無い（ロゴ用のサブセットのため）。
# E は直線だけでできているので、下の横棒を落として F を起こす。
GLYPHS["F"] = {
    "ha": GLYPHS["E"]["ha"],
    "x_min": GLYPHS["E"]["x_min"],
    "x_max": 588,
    "o": "m 62 0 l 62 710 l 588 710 l 588 553 l 258 553 l 258 434 l 576 434 l 576 278 l 258 278 l 258 0",
}


# ------------------------------------------------------------------ ロゴの部品
def logo_mark(x: float, y: float, size: float, ring: bool = True) -> str:
    """正方形のロゴマーク（リング＋YEBISU＋Soft）。`size` は一辺の長さ。"""
    k = size / 128.0  # 画面のロゴ（viewBox 128）と同じ比率で描く
    yebisu, _, _ = glyph_path("YEBISU")
    soft, _, _ = glyph_path("Soft", 100, 1)
    ring_svg = ""
    if ring:
        ring_svg = f"""
    <g transform="rotate(-30 64 62)" fill="none" stroke="{CYAN}">
      <ellipse cx="64" cy="62" rx="58" ry="26" stroke-width="3" opacity="0.75"/>
      <ellipse cx="64" cy="62" rx="47" ry="20" stroke-width="1.6" opacity="0.45"/>
      <circle cx="122" cy="62" r="2.6" fill="{CYAN_PALE}" stroke="none" opacity="0.9"/>
      <circle cx="6" cy="62" r="2" fill="{CYAN_PALE}" stroke="none" opacity="0.7"/>
    </g>"""
    return f"""<g transform="translate({x:.3f} {y:.3f}) scale({k:.6f})">{ring_svg}
    <path d="{yebisu}" transform="translate(12.6 70) scale(0.27)" fill="{LETTER_BLUE}"/>
    <path d="{soft}" transform="translate(76 93) scale(0.17)" fill="{SOFT_RED}"/>
  </g>"""


# ワードマーク1文字ぶんの素データ（倍率を変えても字間比が崩れないよう一度だけ作る）
_YE = glyph_path("YEBISU", 100, 6)
_SO = glyph_path("SOFT", 100, 6)
_WM_GAP = 46.0          # YEBISU と SOFT の間（字間よりはっきり広く。詰まると1語に読める）
_WM_UNITS = (_YE[2] - _YE[1]) + _WM_GAP + (_SO[2] - _SO[1])   # 全幅（サイズ100のとき）


def wordmark(x: float, y: float, width: float, yebisu_fill: str) -> tuple[str, float]:
    """ワードマーク `YEBISU SOFT` を輪郭で描く。**幅**を指定して収める。

    cap height ではなく幅で指定するのは、名刺のように横幅が決まっている面で
    右の要素（URL・見出し）と重ならないようにするため。戻り値は (svg, cap height)。
    `YEBISU` は地色に応じて白／ネイビー、`SOFT` は常にシアン。
    """
    scale = width / _WM_UNITS
    ye, ye_min, _ = _YE
    so, so_min, _ = _SO
    so_x = (_YE[2] - _YE[1]) + _WM_GAP
    svg = f"""<g transform="translate({x:.3f} {y:.3f}) scale({scale:.6f})">
    <path d="{ye}" transform="translate({-ye_min:.2f} 0)" fill="{yebisu_fill}"/>
    <path d="{so}" transform="translate({so_x - so_min:.2f} 0)" fill="{CYAN}"/>
  </g>"""
    return svg, 71.0 * scale


# ------------------------------------------------------------------ 出力の器
def svg_doc(width_px: int, height_px: int, view_w: float, view_h: float, body: str,
            title: str) -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{width_px}" height="{height_px}"
     viewBox="0 0 {view_w:g} {view_h:g}" role="img" aria-label="{title}">
{body}
</svg>
"""


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")
    print(f"  {path.relative_to(ROOT)}")


CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


def rasterize(svg: Path, width: int, height: int, transparent: bool = False) -> None:
    """ヘッドレスChromeでPNGを書き出す（Chromeが無い環境ではSVGだけ出る）。

    `qlmanage` は正方形にしか書き出せず名刺（横長）が崩れるため使いません。
    Chromeなら和文フォントもそのまま焼き込まれるので、入稿用のPNGになります。
    """
    if not Path(CHROME).exists():
        return
    html = svg.parent / f"_{svg.stem}.html"
    html.write_text(
        "<!doctype html><meta charset='utf-8'>"
        "<style>html,body{margin:0;padding:0;overflow:hidden}"
        f"svg{{display:block;width:{width}px;height:{height}px}}</style>"
        + svg.read_text(encoding="utf-8"),
        encoding="utf-8",
    )
    target = svg.with_suffix(".png")
    cmd = [
        CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
        f"--screenshot={target}", f"--window-size={width},{height}",
        "--force-device-scale-factor=1",
    ]
    if transparent:
        cmd.append("--default-background-color=00000000")
    cmd.append(html.as_uri())
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
    html.unlink(missing_ok=True)
    if target.exists():
        print(f"  {target.relative_to(ROOT)}")


# ------------------------------------------------------------------ ロゴ単体
def build_logos() -> None:
    print("ロゴ:")
    d = OUT / "logo"

    # 1) マークのみ（透過・正方形）
    body = f'  <rect width="128" height="128" fill="none"/>\n{logo_mark(0, 0, 128)}'
    p = d / "yebisu-soft-mark.svg"
    write(p, svg_doc(2048, 2048, 128, 128, body, "エビスソフトのロゴマーク"))
    rasterize(p, 2048, 2048, transparent=True)

    # 2) マークのみ（ネイビーの角丸地。SNSアイコン・名刺の裏など）
    body = (f'  <rect width="128" height="128" rx="28" fill="{NAVY}"/>\n'
            f'{logo_mark(0, 0, 128)}')
    p = d / "yebisu-soft-mark-navy.svg"
    write(p, svg_doc(2048, 2048, 128, 128, body, "エビスソフトのロゴマーク（ネイビー地）"))
    rasterize(p, 2048, 2048)

    # 3) 横組みロゴ（マーク＋ワードマーク）。明色背景用（透過）と濃色背景用
    mark_w, gap, wm_w = 128.0, 16.0, 330.0
    W = mark_w + gap + wm_w + 8
    H = 128.0
    px_w = 2600
    px_h = round(px_w * H / W)
    for name, fill, bg in (
        ("yebisu-soft-logo-horizontal-onlight.svg", NAVY, None),
        ("yebisu-soft-logo-horizontal-ondark.svg", "#ffffff", NAVY_DEEP),
    ):
        bg_svg = f'  <rect width="{W:.2f}" height="{H:g}" fill="{bg}"/>\n' if bg else ""
        body = f"{bg_svg}{logo_mark(0, 0, mark_w)}\n{wordmark(mark_w + gap, 84, wm_w, fill)[0]}"
        p = d / name
        write(p, svg_doc(px_w, px_h, round(W, 2), H, body, "エビスソフトのロゴ"))
        rasterize(p, px_w, px_h, transparent=bg is None)


# ------------------------------------------------------------------ 名刺
# 仕上がり 91×55mm、裁ち落とし各3mm ＝ 97×61mm。
CARD_W, CARD_H = 91.0, 55.0
BLEED = 3.0
FULL_W, FULL_H = CARD_W + BLEED * 2, CARD_H + BLEED * 2

MEISHI_HTML = OUT / "meishi" / "meishi.html"


def mark_svg(cls: str) -> str:
    """名刺HTMLに埋め込むロゴマーク（インラインSVG）。"""
    return (f'<svg class="{cls}" viewBox="0 0 128 128" aria-hidden="true">'
            f'{logo_mark(0, 0, 128)}</svg>')


def wordmark_svg(cls: str, fill: str) -> str:
    """名刺HTMLに埋め込むワードマーク `YEBISU SOFT`（インラインSVG）。"""
    svg, _ = wordmark(0, 0, _WM_UNITS, fill)   # 等倍で描き、大きさはCSSの width で決める
    return (f'<svg class="{cls}" viewBox="0 -75 {_WM_UNITS:.1f} 78" aria-label="YEBISU SOFT">'
            f"{svg}</svg>")


def build_meishi_html() -> None:
    """名刺の編集用HTMLを**作り直す**（`--reset-meishi` のときだけ）。

    名刺は手で直しながら使う前提（社員が増える／メールを載せない、など）なので、
    HTMLを正データにしています。ここで上書きすると手作業が消えるため、
    既定では書き出しません。
    """
    css = f"""
    /* ===== 用紙・印刷設定（触らなくてよい） ===== */
    @page {{ size: {FULL_W:g}mm {FULL_H:g}mm; margin: 0; }}
    * {{ box-sizing: border-box; }}
    html, body {{ margin: 0; padding: 0; }}
    body {{
      font-family: {JP};
      background: #e9edf3;
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }}

    /* ===== 名刺1枚 ===== */
    .card {{
      position: relative; overflow: hidden;
      width: {FULL_W:g}mm; height: {FULL_H:g}mm;   /* 裁ち落とし込みのサイズ */
      padding: {BLEED + 4:g}mm;                     /* 塗り足し3mm＋安全余白4mm */
      margin: 0 auto 6mm; page-break-after: always;
    }}
    .card:last-of-type {{ page-break-after: auto; }}
    .front {{ background: linear-gradient(135deg, {NAVY_DEEP} 0%, {NAVY} 55%, #123a72 100%); color: #fff; }}
    .back  {{ background: {PAPER}; color: {INK}; }}

    /* 表：背景の軌道リング（ロゴのモチーフ） */
    .orbit {{
      position: absolute; right: -14mm; top: 50%; width: 60mm; height: 26mm;
      transform: translateY(-50%) rotate(-24deg);
      border: 0.18mm solid {CYAN}; border-radius: 50%; opacity: .28; pointer-events: none;
    }}
    .orbit::after {{
      content: ""; position: absolute; inset: 3mm 6mm;
      border: 0.12mm solid {CYAN}; border-radius: 50%; opacity: .6;
    }}

    /* ロゴ */
    .logo {{ display: flex; align-items: flex-start; gap: 2.6mm; position: relative; }}
    .mark {{ width: 15mm; height: 15mm; flex: none; }}
    .back .mark {{ width: 11mm; height: 11mm; }}
    .wordmark {{ display: block; width: 44mm; }}
    .back .wordmark {{ width: 26mm; }}
    .company {{ margin: .8mm 0 0; font-size: 2.5mm; letter-spacing: .5mm; color: #c7d7ee; }}
    .back .company {{ font-size: 2mm; letter-spacing: .3mm; color: {GRAY}; }}

    /* 表：氏名 */
    .name {{ position: absolute; left: {BLEED + 4:g}mm; top: 25.5mm; }}
    .role {{ margin: 0; font-size: 2.6mm; letter-spacing: .8mm; color: {CYAN}; }}
    .person {{ margin: 1.6mm 0 0; font-size: 6.4mm; font-weight: 600; letter-spacing: 1.2mm; }}
    .roman {{ margin: 1mm 0 0; font-family: {EN}; font-size: 2.2mm; letter-spacing: .6mm; color: #8fa8c8; }}

    /* 表：連絡先 */
    .contact {{
      position: absolute; left: {BLEED + 4:g}mm; right: {BLEED + 4:g}mm; bottom: {BLEED + 4:g}mm;
      border-top: .09mm solid rgba(34,211,238,.55); padding-top: 2.2mm;
      display: flex; justify-content: space-between; align-items: flex-end; gap: 3mm;
    }}
    .contact > div {{ flex: 1 1 auto; }}
    /* 折り返すと氏名に重なるので、連絡先は必ず1行ずつに収める */
    .contact p {{ margin: 0; font-size: 2.25mm; line-height: 1.55; color: #dbe6f5; white-space: nowrap; }}
    .contact .url {{ font-family: {EN}; font-size: 2.4mm; font-weight: 700; color: {CYAN}; white-space: nowrap; }}

    /* 裏：見出しと3本柱 */
    .band {{ position: absolute; left: 0; right: 0; top: 0; height: {BLEED + 1.6:g}mm;
             background: {NAVY_DEEP}; border-bottom: .12mm solid {CYAN}; }}
    .headline {{ position: absolute; right: {BLEED + 4:g}mm; top: {BLEED + 4:g}mm; text-align: right; }}
    .headline h1 {{ margin: 0; font-size: 2.3mm; font-weight: 700; }}
    .headline p {{ margin: 1.4mm 0 0; font-size: 1.9mm; color: {GRAY}; }}
    .pillars {{
      position: absolute; left: {BLEED + 4:g}mm; right: {BLEED + 4:g}mm; top: 22.5mm;
      border-top: .08mm solid #dbe3ef; padding-top: 4mm;
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 2mm;
    }}
    .pillars h2 {{ margin: 0; font-size: 2.5mm; color: {NAVY}; }}
    .pillars h2::after {{ content: ""; display: block; width: 5.5mm; height: .5mm;
                          background: {CYAN}; margin: 1mm 0 2.4mm; }}
    /* 折り返すと下の帯に重なるので、1項目1行に収まる長さで書くこと */
    .pillars li {{ font-size: 1.75mm; line-height: 1.6; color: {GRAY}; white-space: nowrap; }}
    .pillars ul {{ margin: 0; padding: 0; list-style: none; }}
    .foot {{
      position: absolute; left: {BLEED + 4:g}mm; right: {BLEED + 4:g}mm; bottom: {BLEED + 4:g}mm;
      border-top: .08mm solid #dbe3ef; padding-top: 2.4mm;
      display: flex; justify-content: space-between; align-items: baseline;
    }}
    .foot p {{ margin: 0; font-size: 2.1mm; color: {GRAY}; }}
    .foot .url {{ font-family: {EN}; font-size: 2.5mm; font-weight: 700; color: {NAVY}; }}

    /* 載せたくない項目に付けると消える（例：メールアドレス） */
    .hidden {{ display: none !important; }}

    /* ===== 画面でだけ出るもの（印刷には出ない） ===== */
    .help {{ max-width: 150mm; margin: 8mm auto; padding: 6mm; background: #fff;
             border-radius: 3mm; font-size: 3.4mm; line-height: 1.9; color: #24324a; }}
    .help code {{ background: #eef2f8; padding: 0 .6mm; border-radius: 1mm; }}
    .label {{ max-width: {FULL_W:g}mm; margin: 0 auto; font-size: 3mm; color: #63748f; }}
    .card::before, .card::after {{ content: ""; position: absolute; pointer-events: none; }}
    .card::before {{ inset: {BLEED:g}mm; outline: .1mm solid #ff2d55; }}          /* 仕上がり線 */
    .card::after  {{ inset: {BLEED + 4:g}mm; outline: .1mm dashed #00a3ff; }}     /* 安全枠 */
    @media print {{
      body {{ background: #fff; }}
      .help, .label {{ display: none; }}
      .card {{ margin: 0; }}
      .card::before, .card::after {{ display: none; }}   /* 印刷にはガイドを出さない */
    }}
"""

    pillars = [
        ("AI活用", ["生成AIを開発工程に組み込み", "期間を従来の約1/3に短縮", "AIチャットボット（RAG）"]),
        ("Web制作", ["コーポレート・LP・EC", "SEO / AEO / LLMO 実装", "3DCG・WebGL演出"]),
        ("組み込み・IoT", ["ルネサス RH850・RX・RL78", "ARM Cortex-M・STM32", "BLE・Wi-Fi・MQTT・クラウド"]),
    ]
    pillars_html = "\n".join(
        f"""      <div>
        <h2>{t}</h2>
        <ul>{"".join(f"<li>{x}</li>" for x in items)}</ul>
      </div>"""
        for t, items in pillars
    )

    front = f"""  <p class="label">1枚目：表（{ROLE}）</p>
  <section class="card front">
    <div class="orbit"></div>
    <div class="logo">
      {mark_svg("mark")}
      <div>
        {wordmark_svg("wordmark", "#ffffff")}
        <p class="company">{COMPANY}</p>
      </div>
    </div>

    <!-- ▼ここから下が人ごとに変わるところ -->
    <div class="name">
      <p class="role">{ROLE}</p>
      <p class="person">{PERSON}</p>
      <p class="roman">{PERSON_EN}</p>
    </div>
    <div class="contact">
      <div>
        <p>{ADDRESS}</p>
        <p>TEL {TEL}　<span class="mail">{EMAIL}</span></p>
      </div>
      <p class="url">{URL_DISPLAY}</p>
    </div>
    <!-- ▲ここまで -->
  </section>"""

    back = f"""  <p class="label">1枚目：裏（全員共通）</p>
  <section class="card back">
    <div class="band"></div>
    <div class="logo">
      {mark_svg("mark")}
      <div>
        {wordmark_svg("wordmark", NAVY)}
        <p class="company">{COMPANY}／{MEMBER} 会員</p>
      </div>
    </div>
    <div class="headline">
      <h1>AI活用のWeb制作と組み込み開発</h1>
      <p>実際に動くデモをサイトで公開中</p>
    </div>
    <div class="pillars">
{pillars_html}
    </div>
    <div class="foot">
      <p>{HOURS}　TEL {TEL}</p>
      <p class="url">{URL_DISPLAY}</p>
    </div>
  </section>"""

    help_html = f"""  <div class="help">
    <b>この1枚が名刺の元データです。</b>ブラウザで開いたまま、テキストエディタでこのファイルを直して更新してください。<br>
    ・<b>文字を変える</b>…&lt;p&gt; などの中身を書き換えるだけです。大きさや位置は上の &lt;style&gt; で決まります。<br>
    ・<b>メールを載せない</b>…&lt;span class="mail"&gt; を &lt;span class="mail hidden"&gt; にします（行ごと消してもかまいません）。<br>
    ・<b>社員を増やす</b>…&lt;section class="card front"&gt;〜&lt;/section&gt; を丸ごとコピーして、
      「ここから下が人ごとに変わるところ」の氏名・肩書・連絡先だけ書き換えます。裏面は共通なので1枚あれば足ります。<br>
    ・<b>印刷／PDF</b>…このページで ⌘P（印刷）→ 用紙サイズ「カスタム {FULL_W:g}×{FULL_H:g}mm」、
      余白なし、「背景を印刷する」をON、拡大縮小100%。PDFで保存すればそのまま入稿できます。<br>
    ・赤い線が<b>仕上がり</b>（{CARD_W:g}×{CARD_H:g}mm）、青い破線が<b>安全枠</b>です。画面だけに出て印刷されません。
      文字は必ず青い破線の内側に置いてください。<br>
    ・ロゴはインラインSVG（実データ）なので、拡大しても滲みません。作り直すときは
      <code>python3 scripts/brand-assets.py</code>（ロゴのみ）です。
  </div>"""

    html = f"""<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<title>{COMPANY} 名刺（編集・印刷用）</title>
<!--
  名刺の元データ。**このファイルを手で直して使います。**
  仕上がり {CARD_W:g}×{CARD_H:g}mm ＋ 裁ち落とし各{BLEED:g}mm ＝ {FULL_W:g}×{FULL_H:g}mm。
  掲載内容を変えたら、サイト側（src/lib/site.ts・src/lib/author.ts）と食い違わないか確認してください。
-->
<style>{css}</style>
</head>
<body>
{help_html}

{front}

{back}
</body>
</html>
"""
    write(MEISHI_HTML, html)


if __name__ == "__main__":
    import sys

    print(f"出力先: {OUT.relative_to(ROOT)}")
    build_logos()
    # 名刺（assets/brand/meishi/meishi.html）は手で編集する前提の正データなので、
    # 明示的に --reset-meishi を付けたときだけ作り直す（手作業を消さないため）。
    if "--reset-meishi" in sys.argv:
        print("名刺HTMLを作り直します（手を入れた内容は失われます）:")
        build_meishi_html()
    else:
        print(f"名刺: {MEISHI_HTML.relative_to(ROOT)} は手編集の正データなので触りません"
              f"（作り直すなら --reset-meishi）")
