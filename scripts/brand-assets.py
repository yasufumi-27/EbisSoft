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
MEMBER = _pick("src/lib/site.ts", r'name: "(京都商工会)"')
PERSON = _pick("src/lib/author.ts", r'const PERSON_NAME = "(.+?)"')
PERSON_EN = _pick("src/lib/author.ts", r'personNameRomaji: "(.+?)"')
ROLE = _pick("src/lib/author.ts", r'personRole: "(.+?)"')
URL_DISPLAY = "ebisusoft.sakura.ne.jp"

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
# 仕上がり 91×55mm、裁ち落とし各3mm。座標はすべてmm。
CARD_W, CARD_H = 91.0, 55.0
BLEED = 3.0
FULL_W, FULL_H = CARD_W + BLEED * 2, CARD_H + BLEED * 2
DPI = 350
PX_W = round(FULL_W / 25.4 * DPI)
PX_H = round(FULL_H / 25.4 * DPI)


def guides() -> str:
    """仕上がり線と安全枠（確認用。入稿データからは外す）。"""
    return f"""  <g fill="none" stroke="#ff2d55" stroke-width="0.2" opacity="0.9">
    <rect x="{BLEED}" y="{BLEED}" width="{CARD_W}" height="{CARD_H}"/>
  </g>
  <g fill="none" stroke="#00a3ff" stroke-width="0.15" stroke-dasharray="1 1" opacity="0.8">
    <rect x="{BLEED + 4}" y="{BLEED + 4}" width="{CARD_W - 8}" height="{CARD_H - 8}"/>
  </g>"""


def card_front(with_guides: bool = False) -> str:
    x0, y0 = BLEED, BLEED
    body = f"""  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="{NAVY_DEEP}"/>
      <stop offset="0.55" stop-color="{NAVY}"/>
      <stop offset="1" stop-color="#123a72"/>
    </linearGradient>
    <clipPath id="card"><rect width="{FULL_W:g}" height="{FULL_H:g}"/></clipPath>
  </defs>
  <g clip-path="url(#card)">
    <rect width="{FULL_W:g}" height="{FULL_H:g}" fill="url(#bg)"/>
    <!-- 背景の軌道リング（ロゴのモチーフ。読みを邪魔しない濃さに落とす） -->
    <g transform="rotate(-24 {FULL_W - 14:.2f} {FULL_H / 2:.2f})" fill="none" stroke="{CYAN}" opacity="0.28">
      <ellipse cx="{FULL_W - 14:.2f}" cy="{FULL_H / 2:.2f}" rx="30" ry="13" stroke-width="0.5"/>
      <ellipse cx="{FULL_W - 14:.2f}" cy="{FULL_H / 2:.2f}" rx="24" ry="10" stroke-width="0.3" opacity="0.6"/>
    </g>

    <!-- ロゴ（マーク＋ワードマーク）。ワードマークは幅で指定して右の余白を確保する -->
{logo_mark(x0 + 4, y0 + 4.5, 15)}
{wordmark(x0 + 21.5, y0 + 13.6, 44, "#ffffff")[0]}
    <text x="{x0 + 21.7:.2f}" y="{y0 + 18.2:.2f}" font-family="{JP}" font-size="2.5"
          letter-spacing="0.5" fill="#c7d7ee">{COMPANY}</text>

    <!-- 氏名 -->
    <text x="{x0 + 4.4:.2f}" y="{y0 + 28.6:.2f}" font-family="{JP}" font-size="2.6"
          letter-spacing="0.8" fill="{CYAN}">{ROLE}</text>
    <text x="{x0 + 4:.2f}" y="{y0 + 36.6:.2f}" font-family="{JP}" font-size="6.4"
          font-weight="600" letter-spacing="1.2" fill="#ffffff">{PERSON}</text>
    <text x="{x0 + 4.4:.2f}" y="{y0 + 40.4:.2f}" font-family="{EN}" font-size="2.2"
          letter-spacing="0.6" fill="#8fa8c8">{PERSON_EN}</text>

    <!-- 連絡先（安全枠 y0+51 の内側に収める） -->
    <g fill="none" stroke="{CYAN}" stroke-width="0.25" opacity="0.55">
      <path d="M{x0 + 4:.2f} {y0 + 43.2:.2f} H{x0 + CARD_W - 4:.2f}"/>
    </g>
    <text x="{x0 + 4:.2f}" y="{y0 + 46.6:.2f}" font-family="{JP}" font-size="2.25"
          fill="#dbe6f5">{ADDRESS}</text>
    <text x="{x0 + CARD_W - 4:.2f}" y="{y0 + 46.6:.2f}" text-anchor="end" font-family="{EN}"
          font-size="2.4" font-weight="700" letter-spacing="0.1" fill="{CYAN}">{URL_DISPLAY}</text>
    <text x="{x0 + 4:.2f}" y="{y0 + 50.2:.2f}" font-family="{EN}" font-size="2.25"
          fill="#dbe6f5">TEL {TEL}　{EMAIL}</text>
  </g>
{guides() if with_guides else ""}"""
    return body


def card_back(with_guides: bool = False) -> str:
    x0, y0 = BLEED, BLEED
    cols = [
        ("AI活用", ["生成AIを開発工程に組み込み", "期間を従来の約1/3に短縮", "AIチャットボット（RAG）"]),
        ("Web制作", ["コーポレート・LP・EC", "SEO / AEO / LLMO を標準実装", "3DCG・WebGL演出"]),
        ("組み込み・IoT", ["ルネサス RH850 / RX / RL78", "ARM Cortex-M・STM32", "BLE・Wi-Fi・MQTT・クラウド"]),
    ]
    col_w = (CARD_W - 8) / 3
    col_svg = []
    for i, (title, lines) in enumerate(cols):
        cx = x0 + 4 + col_w * i
        col_svg.append(
            f'    <text x="{cx:.2f}" y="{y0 + 29.5:.2f}" font-family="{JP}" font-size="2.5" '
            f'font-weight="700" fill="{NAVY}">{title}</text>'
        )
        col_svg.append(
            f'    <path d="M{cx:.2f} {y0 + 31.2:.2f} h5.5" stroke="{CYAN}" stroke-width="0.5" fill="none"/>'
        )
        for j, line in enumerate(lines):
            # 列幅（col_w）を超えたら字間を詰めて収める（隣の列に食い込ませない）
            col_svg.append(
                f'    <text x="{cx:.2f}" y="{y0 + 34.8 + j * 2.9:.2f}" font-family="{JP}" '
                f'font-size="1.9" fill="{GRAY}" textLength="{col_w - 1.5:.2f}" '
                f'lengthAdjust="spacingAndGlyphs">{line}</text>'
            )
    body = f"""  <defs><clipPath id="card"><rect width="{FULL_W:g}" height="{FULL_H:g}"/></clipPath></defs>
  <g clip-path="url(#card)">
    <rect width="{FULL_W:g}" height="{FULL_H:g}" fill="{PAPER}"/>
    <rect width="{FULL_W:g}" height="{BLEED + 1.6:g}" fill="{NAVY_DEEP}"/>
    <path d="M0 {BLEED + 1.6:g} H{FULL_W:g}" stroke="{CYAN}" stroke-width="0.4"/>

{logo_mark(x0 + 4, y0 + 4.6, 11)}
{wordmark(x0 + 16.8, y0 + 11.2, 26, NAVY)[0]}
    <text x="{x0 + 17:.2f}" y="{y0 + 14.6:.2f}" font-family="{JP}" font-size="2.0"
          letter-spacing="0.3" fill="{GRAY}">{COMPANY}／{MEMBER}所属</text>

    <text x="{x0 + CARD_W - 4:.2f}" y="{y0 + 9.6:.2f}" text-anchor="end" font-family="{JP}"
          font-size="2.3" font-weight="700" fill="{INK}">AI活用のWeb制作と組み込み開発</text>
    <text x="{x0 + CARD_W - 4:.2f}" y="{y0 + 13.6:.2f}" text-anchor="end" font-family="{JP}"
          font-size="1.9" fill="{GRAY}">実際に動くデモをサイトで公開中</text>

    <path d="M{x0 + 4:.2f} {y0 + 22.5:.2f} H{x0 + CARD_W - 4:.2f}" stroke="#dbe3ef" stroke-width="0.25"/>
{chr(10).join(col_svg)}

    <path d="M{x0 + 4:.2f} {y0 + 45.2:.2f} H{x0 + CARD_W - 4:.2f}" stroke="#dbe3ef" stroke-width="0.25"/>
    <text x="{x0 + 4:.2f}" y="{y0 + 49.4:.2f}" font-family="{JP}" font-size="2.1" fill="{GRAY}">{HOURS}　TEL {TEL}</text>
    <text x="{x0 + CARD_W - 4:.2f}" y="{y0 + 49.4:.2f}" text-anchor="end" font-family="{EN}"
          font-size="2.5" font-weight="700" fill="{NAVY}">{URL_DISPLAY}</text>
  </g>
{guides() if with_guides else ""}"""
    return body


def build_cards() -> None:
    print("名刺:")
    d = OUT / "meishi"
    for name, body in (
        ("yebisu-soft-meishi-front", card_front()),
        ("yebisu-soft-meishi-back", card_back()),
        ("yebisu-soft-meishi-front-guides", card_front(True)),
        ("yebisu-soft-meishi-back-guides", card_back(True)),
    ):
        p = d / f"{name}.svg"
        write(p, svg_doc(PX_W, PX_H, FULL_W, FULL_H, body, f"エビスソフトの名刺（{name}）"))
        rasterize(p, PX_W, PX_H)


if __name__ == "__main__":
    print(f"出力先: {OUT.relative_to(ROOT)}  （名刺 {FULL_W:g}×{FULL_H:g}mm / {DPI}dpi = {PX_W}×{PX_H}px）")
    build_logos()
    build_cards()
