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
    """名刺HTMLに埋め込むロゴマーク（インラインSVG）。

    色は属性に焼き込まず class だけ付けて、CSS変数（`--logo-*`）で塗ります。
    こうしておくと、FAX用のモノクロ表示でもロゴが一緒に白黒へ切り替わります。
    """
    yebisu, _, _ = glyph_path("YEBISU")
    soft, _, _ = glyph_path("Soft", 100, 1)
    return f"""<svg class="{cls}" viewBox="0 0 128 128" aria-hidden="true">
        <g class="ring" transform="rotate(-30 64 62)" fill="none">
          <ellipse cx="64" cy="62" rx="58" ry="26" stroke-width="3" opacity=".75"/>
          <ellipse cx="64" cy="62" rx="47" ry="20" stroke-width="1.6" opacity=".45"/>
          <circle class="bead" cx="122" cy="62" r="2.6" opacity=".9"/>
          <circle class="bead" cx="6" cy="62" r="2" opacity=".7"/>
        </g>
        <path class="lt" d="{yebisu}" transform="translate(12.6 70) scale(0.27)"/>
        <path class="sf" d="{soft}" transform="translate(76 93) scale(0.17)"/>
      </svg>"""


def wordmark_svg(cls: str) -> str:
    """名刺HTMLに埋め込むワードマーク `YEBISU SOFT`（インラインSVG）。色はCSS側で決めます。"""
    ye, ye_min, _ = _YE
    so, so_min, _ = _SO
    so_x = (_YE[2] - _YE[1]) + _WM_GAP
    return f"""<svg class="{cls}" viewBox="0 -75 {_WM_UNITS:.1f} 78" aria-label="YEBISU SOFT">
          <path class="ye" d="{ye}" transform="translate({-ye_min:.2f} 0)"/>
          <path class="so" d="{so}" transform="translate({so_x - so_min:.2f} 0)"/>
        </svg>"""


# 画面の「色の調整」パネルに並べる項目。（CSS変数名, 画面のラベル）
COLOR_VARS = [
    ("--front-bg1", "表の背景（左上・濃い）"),
    ("--front-bg2", "表の背景（中間）"),
    ("--front-bg3", "表の背景（右下・明るい）"),
    ("--front-fg", "表の文字（氏名・社名）"),
    ("--front-sub", "表の小さい文字（住所・電話）"),
    ("--front-faint", "表のいちばん薄い文字（ローマ字）"),
    ("--accent", "アクセント（肩書・URL・罫線）"),
    ("--back-bg", "裏の背景"),
    ("--back-fg", "裏の見出し"),
    ("--back-sub", "裏の本文"),
    ("--navy", "裏の濃紺（ロゴ・小見出し）"),
    ("--rule", "裏の罫線"),
    ("--logo-letter", "ロゴの文字（YEBISU）"),
    ("--logo-soft", "ロゴの Soft"),
    ("--logo-ring", "ロゴのリング"),
]


def build_meishi_html() -> None:
    """名刺の編集用HTMLを**作り直す**（`--reset-meishi` のときだけ）。

    名刺は手で直しながら使う前提（社員が増える／メールを載せない／色を変える）なので、
    HTMLを正データにしています。ここで上書きすると手作業が消えるため、既定では書き出しません。
    """
    from string import Template

    # CSSは波かっこだらけなので f-string ではなく Template（$名前）で埋める
    css = Template("""
    /* ==========================================================
       1. 色とフォントの設定 — ここだけ直せば表・裏・ロゴまで変わります
       ========================================================== */
    :root{
      --front-bg1:$NAVY_DEEP;   /* 表の背景（左上・濃い） */
      --front-bg2:$NAVY;        /* 表の背景（中間） */
      --front-bg3:#123a72;      /* 表の背景（右下・明るい） */
      --front-fg:#ffffff;       /* 表の文字（氏名・社名） */
      --front-sub:#dbe6f5;      /* 表の小さい文字（住所・電話） */
      --front-faint:#8fa8c8;    /* 表のいちばん薄い文字（ローマ字） */
      --accent:$CYAN;           /* アクセント（肩書・URL・罫線） */
      --back-bg:$PAPER;         /* 裏の背景 */
      --back-fg:$INK;           /* 裏の見出し */
      --back-sub:$GRAY;         /* 裏の本文 */
      --navy:$NAVY;             /* 裏の濃紺（ロゴ・小見出し） */
      --rule:#dbe3ef;           /* 裏の罫線 */
      --logo-letter:$LETTER_BLUE; /* ロゴの文字（YEBISU） */
      --logo-soft:$SOFT_RED;      /* ロゴの Soft */
      --logo-ring:$CYAN;          /* ロゴのリング */
      --logo-bead:$CYAN_PALE;     /* ロゴのリング上の光 */

      --font-jp:$JP;            /* 和文フォント */
      --font-en:$EN;            /* 欧文フォント */

      --cut:#c9d3e0;            /* A4面付けのカット線 */
      --scale:1;                /* 拡大率（FAXモードだけ大きくする） */
    }

    /* FAX・モノクロ印刷用の色。白地に黒で、背景の塗りをやめます。
       FAXは中間調がつぶれるので、薄い色を残さないのがコツです。 */
    body.mode-fax{
      --front-bg1:#ffffff; --front-bg2:#ffffff; --front-bg3:#ffffff;
      --front-fg:#000000; --front-sub:#000000; --front-faint:#000000;
      --accent:#000000;
      --back-bg:#ffffff; --back-fg:#000000; --back-sub:#000000;
      --navy:#000000; --rule:#000000;
      --logo-letter:#000000; --logo-soft:#000000; --logo-ring:#000000; --logo-bead:#000000;
      --scale:1.6;              /* FAXで読めるよう1.6倍にしてA4へ印刷 */
    }

    /* ==========================================================
       2. 名刺の見た目（位置・大きさ）
       ========================================================== */
    *{ box-sizing:border-box }
    html,body{ margin:0; padding:0 }
    body{
      font-family:var(--font-jp); background:#e9edf3;
      -webkit-print-color-adjust:exact; print-color-adjust:exact;
    }

    .card{
      position:relative; overflow:hidden;
      width:$FULL_Wmm; height:$FULL_Hmm;   /* 裁ち落とし込みのサイズ */
      padding:$PADmm;                       /* 塗り足し$BLEEDmm＋安全余白4mm */
      margin:0 auto;
    }
    .front{ background:linear-gradient(135deg,var(--front-bg1) 0%,var(--front-bg2) 55%,var(--front-bg3) 100%);
            color:var(--front-fg) }
    .back{ background:var(--back-bg); color:var(--back-fg) }

    /* 表：背景の軌道リング（ロゴのモチーフ） */
    .orbit{
      position:absolute; right:-14mm; top:50%; width:60mm; height:26mm;
      transform:translateY(-50%) rotate(-24deg);
      border:.18mm solid var(--accent); border-radius:50%; opacity:.28; pointer-events:none;
    }
    .orbit::after{ content:""; position:absolute; inset:3mm 6mm;
                   border:.12mm solid var(--accent); border-radius:50%; opacity:.6 }
    body.mode-fax .orbit{ display:none }   /* FAXでは背景の線を出さない */

    /* ロゴ（色はすべてCSS変数から） */
    .logo{ display:flex; align-items:flex-start; gap:2.6mm; position:relative }
    .mark{ width:15mm; height:15mm; flex:none }
    .back .mark{ width:11mm; height:11mm }
    .wordmark{ display:block; width:44mm }
    .back .wordmark{ width:26mm }
    .ring{ stroke:var(--logo-ring) }
    .bead{ fill:var(--logo-bead); stroke:none }
    .lt{ fill:var(--logo-letter) }
    .sf{ fill:var(--logo-soft) }
    .front .ye{ fill:var(--front-fg) }
    .back .ye{ fill:var(--navy) }
    .so{ fill:var(--accent) }
    .company{ margin:.8mm 0 0; font-size:2.5mm; letter-spacing:.5mm; color:var(--front-sub) }
    .back .company{ font-size:2mm; letter-spacing:.3mm; color:var(--back-sub) }

    /* 表：氏名 */
    .name{ position:absolute; left:$PADmm; top:25.5mm }
    .role{ margin:0; font-size:2.6mm; letter-spacing:.8mm; color:var(--accent) }
    .person{ margin:1.6mm 0 0; font-size:6.4mm; font-weight:600; letter-spacing:1.2mm }
    .roman{ margin:1mm 0 0; font-family:var(--font-en); font-size:2.2mm;
            letter-spacing:.6mm; color:var(--front-faint) }

    /* 表：連絡先 */
    .contact{
      position:absolute; left:$PADmm; right:$PADmm; bottom:$PADmm;
      border-top:.09mm solid var(--accent); padding-top:2.2mm;
      display:flex; justify-content:space-between; align-items:flex-end; gap:3mm;
    }
    .contact > div{ flex:1 1 auto }
    /* 折り返すと氏名に重なるので、連絡先は必ず1行ずつに収める */
    .contact p{ margin:0; font-size:2.25mm; line-height:1.55; color:var(--front-sub); white-space:nowrap }
    .contact .url{ font-family:var(--font-en); font-size:2.4mm; font-weight:700;
                   color:var(--accent); white-space:nowrap }

    /* 裏 */
    .band{ position:absolute; left:0; right:0; top:0; height:$BANDmm;
           background:var(--navy); border-bottom:.12mm solid var(--accent) }
    .headline{ position:absolute; right:$PADmm; top:$PADmm; text-align:right }
    .headline h1{ margin:0; font-size:2.3mm; font-weight:700 }
    .headline p{ margin:1.4mm 0 0; font-size:1.9mm; color:var(--back-sub) }
    .pillars{
      position:absolute; left:$PADmm; right:$PADmm; top:22.5mm;
      border-top:.08mm solid var(--rule); padding-top:4mm;
      display:grid; grid-template-columns:repeat(3,1fr); gap:2mm;
    }
    .pillars h2{ margin:0; font-size:2.5mm; color:var(--navy) }
    .pillars h2::after{ content:""; display:block; width:5.5mm; height:.5mm;
                        background:var(--accent); margin:1mm 0 2.4mm }
    .pillars ul{ margin:0; padding:0; list-style:none }
    /* 折り返すと下の帯に重なるので、1項目1行に収まる長さで書くこと */
    .pillars li{ font-size:1.75mm; line-height:1.6; color:var(--back-sub); white-space:nowrap }
    .foot{
      position:absolute; left:$PADmm; right:$PADmm; bottom:$PADmm;
      border-top:.08mm solid var(--rule); padding-top:2.4mm;
      display:flex; justify-content:space-between; align-items:baseline;
    }
    .foot p{ margin:0; font-size:2.1mm; color:var(--back-sub) }
    .foot .url{ font-family:var(--font-en); font-size:2.5mm; font-weight:700; color:var(--navy) }

    /* 載せたくない項目に付けると消える（例：メールアドレス） */
    .hidden{ display:none !important }

    /* ==========================================================
       3. 印刷モード（body の class で切り替え）
          mode-cut … 名刺サイズ・裁ち落としあり（印刷所への入稿用）
          mode-a4  … A4に10面付け（自分のプリンタで刷って切る用）
          mode-fax … A4にモノクロ1.6倍（FAX送信・コピー用）
       ========================================================== */
    /* 既定の用紙＝入稿用（名刺サイズ）。A4のモードに切り替えると、
       JSが <style id="page-size"> を書き換えて用紙をA4にします。
       JSを切っている場合は、下の1行を @page{ size:A4; margin:8mm } に直してください。 */
    @page{ size:$FULL_Wmm $FULL_Hmm; margin:0 }
    body.mode-cut .card{ page-break-after:always }
    body.mode-cut .card:last-of-type{ page-break-after:auto }
    .sheet{ page-break-after:always }
    .sheet:last-of-type{ page-break-after:auto }

    .sheet{ display:none }
    body.mode-a4 .sheet, body.mode-fax .sheet{ display:grid }
    body.mode-a4 .single, body.mode-fax .single{ display:none }

    /* 面付けの枠。仕上がり（$CARD_Wmm×$CARD_Hmm）だけ見せて裁ち落としは隠す */
    .slot{ width:calc($CARD_Wmm * var(--scale)); height:calc($CARD_Hmm * var(--scale));
           overflow:hidden; position:relative }
    .slot > .card{ margin:calc(-1 * $BLEEDmm * var(--scale));
                   transform:scale(var(--scale)); transform-origin:0 0 }
    body.mode-a4 .sheet{ grid-template-columns:repeat(2,$CARD_Wmm); gap:1mm; justify-content:center }
    body.mode-a4 .slot{ outline:.1mm solid var(--cut) }   /* 切るときの目印 */
    body.mode-fax .sheet{ grid-template-columns:1fr; justify-items:center; gap:6mm }
    body.mode-fax .slot{ border:.3mm solid #000 }

    /* ==========================================================
       4. 画面でだけ出るもの（印刷には出ません）
       ========================================================== */
    .panel{ max-width:190mm; margin:8mm auto; padding:6mm; background:#fff;
            border-radius:3mm; font-size:3.4mm; line-height:1.9; color:#24324a }
    .panel h2{ font-size:4mm; margin:0 0 2mm }
    .panel section{ margin-bottom:6mm }
    .panel code{ background:#eef2f8; padding:0 .6mm; border-radius:1mm }
    .modes label{ display:inline-block; margin-right:5mm }
    .colors{ display:grid; grid-template-columns:repeat(auto-fill,minmax(62mm,1fr)); gap:2mm 4mm }
    .colors label{ display:flex; align-items:center; gap:2mm; font-size:3.1mm }
    .colors input{ width:9mm; height:6mm; padding:0; border:1px solid #c9d3e0; background:none }
    .colors span{ flex:1 }
    .panel button{ font:inherit; padding:1.5mm 4mm; margin-right:3mm; border:1px solid #c9d3e0;
                   border-radius:1.5mm; background:#f6f8fc; cursor:pointer }
    .panel textarea{ width:100%; height:34mm; margin-top:3mm; font-family:var(--font-en);
                     font-size:3mm; border:1px solid #c9d3e0; border-radius:1.5mm; padding:2mm }
    .label{ max-width:$FULL_Wmm; margin:6mm auto 1.5mm; font-size:3mm; color:#63748f }
    body.mode-cut .card::before, body.mode-cut .card::after{ content:""; position:absolute;
                                                             pointer-events:none }
    body.mode-cut .card::before{ inset:$BLEEDmm; outline:.1mm solid #ff2d55 }  /* 仕上がり線 */
    body.mode-cut .card::after{ inset:$PADmm; outline:.1mm dashed #00a3ff }    /* 安全枠 */
    @media print{
      body{ background:#fff }
      .panel, .label{ display:none }
      .card{ margin:0 }
      body.mode-cut .card::before, body.mode-cut .card::after{ display:none } /* ガイドは印刷しない */
    }
""").substitute(
        NAVY=NAVY, NAVY_DEEP=NAVY_DEEP, CYAN=CYAN, CYAN_PALE=CYAN_PALE, PAPER=PAPER,
        INK=INK, GRAY=GRAY, LETTER_BLUE=LETTER_BLUE, SOFT_RED=SOFT_RED, JP=JP, EN=EN,
        FULL_Wmm=f"{FULL_W:g}mm", FULL_Hmm=f"{FULL_H:g}mm",
        CARD_Wmm=f"{CARD_W:g}mm", CARD_Hmm=f"{CARD_H:g}mm",
        BLEEDmm=f"{BLEED:g}mm", PADmm=f"{BLEED + 4:g}mm", BANDmm=f"{BLEED + 1.6:g}mm",
    )

    pillars = [
        ("AI活用", ["生成AIを開発工程に組み込み", "期間を従来の約1/3に短縮", "AIチャットボット（RAG）"]),
        ("Web制作", ["コーポレート・LP・EC", "SEO / AEO / LLMO 実装", "3DCG・WebGL演出"]),
        ("組み込み・IoT", ["ルネサス RH850・RX・RL78", "ARM Cortex-M・STM32", "BLE・Wi-Fi・MQTT・クラウド"]),
    ]
    pillars_html = "\n".join(
        f"""        <div>
          <h2>{t}</h2>
          <ul>{"".join(f"<li>{x}</li>" for x in items)}</ul>
        </div>"""
        for t, items in pillars
    )

    front = f"""  <p class="label">表（{ROLE}）</p>
  <section class="card front" id="cardFront">
    <div class="orbit"></div>
    <div class="logo">
      {mark_svg("mark")}
      <div>
        {wordmark_svg("wordmark")}
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

    back = f"""  <p class="label">裏（全員共通）</p>
  <section class="card back" id="cardBack">
    <div class="band"></div>
    <div class="logo">
      {mark_svg("mark")}
      <div>
        {wordmark_svg("wordmark")}
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

    color_inputs = "\n".join(
        f'      <label><input type="color" data-var="{v}"><span>{lbl}</span></label>'
        for v, lbl in COLOR_VARS
    )

    panel = f"""  <div class="panel">
    <section>
      <h2>1. 印刷のしかたを選ぶ</h2>
      <div class="modes">
        <label><input type="radio" name="mode" value="mode-cut" checked> 入稿用（名刺サイズ・裁ち落としあり）</label>
        <label><input type="radio" name="mode" value="mode-a4"> A4に10面付け（自分で刷って切る）</label>
        <label><input type="radio" name="mode" value="mode-fax"> FAX・モノクロ（A4・1.6倍）</label>
      </div>
      <p>
        <b>入稿用</b>… ⌘P →用紙「カスタム {FULL_W:g}×{FULL_H:g}mm」／余白なし／背景ON／拡大縮小100%。表・裏で2ページのPDFになります。<br>
        <b>A4に10面付け</b>… ⌘P →用紙A4／余白「なし（既定でも可）」／背景ON。仕上がり（{CARD_W:g}×{CARD_H:g}mm）で並び、薄い線が切る目印です。<br>
        <b>FAX・モノクロ</b>… 白地に黒だけで刷ります（背景の塗りとリングは消えます）。A4に1.6倍で表・裏が1枚ずつ。
        そのままFAXに通すか、PDFにしてFAX送信サービスへ渡してください。
      </p>
    </section>

    <section>
      <h2>2. 色を変える</h2>
      <div class="colors">
{color_inputs}
      </div>
      <p style="margin-top:3mm">
        <button type="button" id="copyCss">この色をCSSとしてコピー</button>
        <button type="button" id="resetCss">元の色に戻す</button>
        <b>画面での変更は保存されません。</b>決まったら下の内容を、このファイル先頭の
        <code>:root{{ … }}</code> と差し替えてください。
      </p>
      <textarea id="cssOut" readonly></textarea>
    </section>

    <section>
      <h2>3. 文字を直す・人を増やす</h2>
      <p>
        ・<b>文字を変える</b>… <code>&lt;p&gt;</code> などの中身を書き換えるだけです。<br>
        ・<b>メールを載せない</b>… <code>&lt;span class="mail"&gt;</code> を
          <code>&lt;span class="mail hidden"&gt;</code> にします（行ごと消してもかまいません）。<br>
        ・<b>社員を増やす</b>… <code>&lt;section class="card front"&gt;〜&lt;/section&gt;</code> を丸ごとコピーし、
          「▼ここから下が人ごとに変わるところ」の氏名・肩書・連絡先だけ書き換えます（<code>id</code> は消してください）。
          裏面は共通なので1枚あれば足ります。<br>
        ・入稿用モードの赤い線が<b>仕上がり</b>、青い破線が<b>安全枠</b>です。画面だけに出ます。
          文字は必ず青い破線の内側に置いてください。<br>
        ・1行に収まらない文字を入れると氏名や下の帯に重なります。短く書くか、文字サイズを
          <code>&lt;style&gt;</code> 側で下げてください。
      </p>
    </section>
  </div>"""

    script = """  <script>
  // 画面用の小道具（印刷結果には影響しません）。JSを切っても名刺はそのまま印刷できます。
  (function () {
    var root = document.documentElement, body = document.body;
    var defaults = {};

    // --- 印刷モードの切り替え ---
    var pageStyle = document.getElementById('page-size');
    var PAGE = {
      'mode-cut': '@page{size:__CUT__;margin:0}',
      'mode-a4': '@page{size:A4;margin:8mm}',
      'mode-fax': '@page{size:A4;margin:8mm}'
    };
    function setMode(name) {
      body.className = name;
      pageStyle.textContent = PAGE[name] || '';
      if (name !== 'mode-cut') buildSheets();
    }
    document.querySelectorAll('input[name=mode]').forEach(function (r) {
      r.addEventListener('change', function () { setMode(r.value); });
      // <body class="..."> を手で書き換えて開いた場合にも、画面と印刷を合わせる
      if (body.classList.contains(r.value)) r.checked = true;
    });

    // --- A4面付け／FAX用の紙面を、元の名刺から複製して組み立てる ---
    function slot(card) {
      var d = document.createElement('div');
      d.className = 'slot';
      var c = card.cloneNode(true);
      c.removeAttribute('id');
      d.appendChild(c);
      return d;
    }
    function buildSheets() {
      document.querySelectorAll('.sheet').forEach(function (s) { s.remove(); });
      var front = document.getElementById('cardFront');
      var back = document.getElementById('cardBack');
      var sheet = document.createElement('div');
      sheet.className = 'sheet';
      if (body.classList.contains('mode-fax')) {
        sheet.appendChild(slot(front));
        sheet.appendChild(slot(back));
      } else {
        for (var i = 0; i < 5; i++) {          // 左に表、右に裏。5行で10面
          sheet.appendChild(slot(front));
          sheet.appendChild(slot(back));
        }
      }
      body.appendChild(sheet);
    }

    // --- 色の調整 ---
    function hex(v) {                           // rgb()表記でもカラーピッカーに入れられるように
      v = (v || '').trim();
      if (v.charAt(0) === '#') return v.length === 4
        ? '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3] : v;
      var m = v.match(/\\d+/g);
      return m ? '#' + m.slice(0, 3).map(function (n) {
        return ('0' + (+n).toString(16)).slice(-2);
      }).join('') : '#000000';
    }
    var inputs = [].slice.call(document.querySelectorAll('.colors input'));
    inputs.forEach(function (input) {
      var name = input.dataset.var;
      defaults[name] = getComputedStyle(root).getPropertyValue(name).trim();
      input.value = hex(defaults[name]);
      input.addEventListener('input', function () {
        root.style.setProperty(name, input.value);
        dumpCss();
      });
    });
    function dumpCss() {
      document.getElementById('cssOut').value = ':root{\\n' + inputs.map(function (i) {
        return '  ' + i.dataset.var + ':' + i.value + ';';
      }).join('\\n') + '\\n}';
    }
    document.getElementById('copyCss').addEventListener('click', function () {
      var t = document.getElementById('cssOut');
      t.select();
      navigator.clipboard ? navigator.clipboard.writeText(t.value) : document.execCommand('copy');
    });
    document.getElementById('resetCss').addEventListener('click', function () {
      inputs.forEach(function (i) {
        root.style.removeProperty(i.dataset.var);
        i.value = hex(defaults[i.dataset.var]);
      });
      dumpCss();
    });
    dumpCss();

    // <body class="..."> を手で書き換えて開いたときも、用紙と紙面を合わせる
    setMode(body.className || 'mode-cut');
  })();
  </script>""".replace("__CUT__", f"{FULL_W:g}mm {FULL_H:g}mm")

    html = f"""<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{COMPANY} 名刺（編集・印刷用）</title>
<!--
  名刺の元データ。**このファイルを手で直して使います。**
  仕上がり {CARD_W:g}×{CARD_H:g}mm ＋ 裁ち落とし各{BLEED:g}mm ＝ {FULL_W:g}×{FULL_H:g}mm。
  色は先頭の :root にまとめてあります。印刷のしかた（入稿用／A4面付け／FAX用モノクロ）は
  <body class="..."> で決まります。掲載内容を変えたら、サイト側（src/lib/site.ts・
  src/lib/author.ts）と食い違わないか確認してください。
-->
<style>{css}</style>
<style id="page-size"></style>
</head>
<body class="mode-cut">
{panel}

<div class="single">
{front}

{back}
</div>

{script}
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
