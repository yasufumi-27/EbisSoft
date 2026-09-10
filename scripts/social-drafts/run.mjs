import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, "../..");
const outputRoot = path.join(projectDir, "social-drafts");
const schemaPath = path.join(scriptDir, "draft.schema.json");
const logoPath = path.join(
  projectDir,
  "assets/brand/logo/yebisu-soft-logo-horizontal-ondark.png",
);
const markPath = path.join(projectDir, "assets/brand/logo/yebisu-soft-mark.png");

loadEnv(path.join(projectDir, ".env.local"));

const args = new Set(process.argv.slice(2));
const requestedSlot = process.argv[2] ?? "both";
const slots =
  requestedSlot === "both" ? ["morning", "afternoon"] : [requestedSlot];
const sample = args.has("--sample");
const reuseDraft = args.has("--reuse-draft");
const noNotify = args.has("--no-notify");
const requestedDate = optionValue("--date");
const strategyPath = optionValue("--strategy");
const performanceReport = strategyPath && fs.existsSync(strategyPath)
  ? JSON.parse(fs.readFileSync(strategyPath, "utf8"))
  : null;

if (!slots.every((slot) => ["morning", "afternoon"].includes(slot))) {
  throw new Error("slot は morning / afternoon / both のいずれかです");
}

fs.mkdirSync(outputRoot, { recursive: true });

for (const slot of slots) {
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const date = requestedDate ?? today;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("--date は YYYY-MM-DD 形式で指定してください");
  }
  const baseSlotLabel = slot === "morning" ? "am-news" : "pm-knowledge";
  const slotLabel = sample ? `${baseSlotLabel}-sample` : baseSlotLabel;
  const draftDir = path.join(outputRoot, date, slotLabel);
  fs.mkdirSync(draftDir, { recursive: true });

  const existingDraftPath = path.join(draftDir, "draft.json");
  const draft = reuseDraft && fs.existsSync(existingDraftPath)
    ? JSON.parse(fs.readFileSync(existingDraftPath, "utf8"))
    : sample
      ? sampleDraft(slot)
      : generateWithCodex(
        slot,
        date,
        existingDraftPath,
        performanceReport?.strategy?.content?.[slot],
      );
  validateDraft(draft, slot);
  fs.writeFileSync(
    path.join(draftDir, "draft.json"),
    `${JSON.stringify(draft, null, 2)}\n`,
    "utf8",
  );
  fs.writeFileSync(
    path.join(draftDir, "caption.txt"),
    `${draft.caption}\n\n${draft.hashtags.join(" ")}\n\n出典:\n${draft.sources
      .map((source) => `- ${source.label}: ${source.url}`)
      .join("\n")}\n`,
    "utf8",
  );

  const images = await renderDraft(draft, draftDir, date);
  fs.writeFileSync(
    path.join(draftDir, "manifest.json"),
    `${JSON.stringify(
      {
        date,
        slot,
        category: draft.category,
        captionFile: "caption.txt",
        mediaType: "carousel",
        imageFiles: images.map((file) => path.basename(file)),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  const zipPath = createZip(draftDir, images, slotLabel);

  if (!noNotify) {
    await notifyIPhone(draft, images[0], zipPath, slot);
  }

  console.log(`Generated: ${draftDir}`);
}

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const rawLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = rawLine.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || process.env[match[1]]) continue;
    let value = match[2];
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}

function generateWithCodex(slot, date, outputPath, performanceAdvice) {
  const category = slot === "morning" ? "AIニュース" : "AI知識";
  const focus =
    slot === "morning"
      ? `直近48時間を中心にAI関連の重要ニュースをWeb検索してください。企業ブログ、公式発表、論文など一次情報を優先し、発表日を確認してください。大きなニュースがなければ、直近7日以内の重要発表を1件選んでください。`
      : `中小企業の経営者・Web担当者に役立つ、AIの実務知識を1テーマ選んでください。Web制作、SEO/AEO/LLMO、業務効率化、組み込み・IoTのどれかにつなげ、一次資料または公的資料で裏づけてください。`;
  const prompt = `
エビスソフト（京都市伏見区、AI活用型Web制作・組み込み開発）のInstagram投稿案を日本語で1本作成してください。
日付は${date}（日本時間）、投稿区分は「${category}」です。

${focus}

過去投稿からの改善データ:
${performanceAdvice ? JSON.stringify(performanceAdvice, null, 2) : "まだ実績がないため、基準品質を優先してください。"}

条件:
- 読者はAIを仕事に生かしたい中小企業の経営者・担当者。
- 1枚目の表紙と最後の導線ページは別処理で追加するため、slidesには本文4枚だけを書く。
- 断定や煽りを避け、未確認情報を事実として書かない。
- ニュースは「何が起きたか」「なぜ重要か」「実務への影響」「今できること」の順で構成する。
- 知識は「定義」「よくある誤解」「実務例」「小さな始め方」の順で構成する。
- 各本文は短く、スマートフォンで数秒で読める文量にする。
- summaryは30〜76字の完全な文にし、必ず句点で終える。文字数上限で文を途中切れにしない。
- captionだけで内容が伝わるようにし、最後に「詳しくはプロフィールの yebisusoft.jp へ。」を入れる。
- hashtagsは日本語中心で3〜8個。
- sourcesには実際に確認した一次情報URLを入れる。検索結果ページやニュース転載URLは不可。
- 改善データに好調例がある場合は、切り口・読みやすさ・実務性を参考にする。ただし同じ題材や表現を繰り返さない。
- 低調例がある場合は、抽象度や情報量を見直し、より具体的な行動につながる構成にする。
- JSON以外は出力しない。
`;

  const codexCommand = process.platform === "win32" ? "codex.cmd" : "codex";
  const codexArgs = [
    "--search",
    "exec",
    "--ephemeral",
    "--sandbox",
    "read-only",
    "--output-schema",
    schemaPath,
    "--output-last-message",
    outputPath,
    "-C",
    projectDir,
    "-",
  ];
  const result = spawnSync(codexCommand, codexArgs, {
    cwd: projectDir,
    input: prompt,
    encoding: "utf8",
    windowsHide: true,
    shell: process.platform === "win32",
    timeout: 12 * 60 * 1000,
  });
  if (result.status !== 0) {
    throw new Error(`Codex CLI failed (${result.status}): ${result.stderr || result.stdout}`);
  }
  return JSON.parse(fs.readFileSync(outputPath, "utf8"));
}

function validateDraft(draft, slot) {
  const expected = slot === "morning" ? "AIニュース" : "AI知識";
  if (draft.category !== expected) throw new Error(`category must be ${expected}`);
  if (!Array.isArray(draft.slides) || draft.slides.length !== 4) {
    throw new Error("本文スライドは4枚必要です");
  }
  for (const source of draft.sources ?? []) {
    const url = new URL(source.url);
    if (!/^https?:$/.test(url.protocol)) throw new Error("出典URLが不正です");
  }
}

async function renderDraft(draft, draftDir, date) {
  const logo = await sharp(logoPath).resize({ width: 430 }).png().toBuffer();
  const mark = await sharp(markPath).resize({ width: 360 }).png().toBuffer();
  const pages = [
    { type: "cover", heading: draft.headline, body: draft.summary },
    ...draft.slides.map((slide) => ({ type: "body", ...slide })),
    { type: "cta" },
  ];
  const paths = [];

  for (let index = 0; index < pages.length; index += 1) {
    const page = pages[index];
    const svg = cardSvg(page, draft, index, pages.length, date);
    const overlays = [
      { input: logo, left: 76, top: 58 },
      ...(page.type === "cta" ? [{ input: mark, left: 360, top: 260 }] : []),
    ];
    const outputPath = path.join(draftDir, `${String(index + 1).padStart(2, "0")}.png`);
    await sharp(Buffer.from(svg))
      .composite(overlays)
      .png({ compressionLevel: 9, palette: true })
      .toFile(outputPath);
    paths.push(outputPath);
  }
  return paths;
}

function cardSvg(page, draft, index, total, date) {
  const accent = draft.category === "AIニュース" ? "#22d3ee" : "#7dd3fc";
  const label = escapeXml(draft.category);
  const progress = Math.round(((index + 1) / total) * 928);
  let main = "";

  if (page.type === "cover") {
    main = `
      <rect x="76" y="285" width="260" height="72" rx="36" fill="${accent}" opacity="0.14"/>
      <text x="206" y="335" text-anchor="middle" class="label" fill="${accent}">${label}</text>
      ${textBlock(page.heading, 76, 470, 76, 12, 1.18, "title")}
      ${textBlock(page.body, 80, 900, 38, 22, 1.55, "summary")}
    `;
  } else if (page.type === "body") {
    main = `
      <text x="76" y="290" class="eyebrow" fill="${accent}">${label}  ${String(index).padStart(2, "0")}</text>
      ${textBlock(page.heading, 76, 410, 58, 15, 1.28, "heading")}
      <line x1="76" y1="650" x2="1004" y2="650" stroke="${accent}" stroke-width="3" opacity="0.45"/>
      ${textBlock(page.body, 80, 760, 38, 22, 1.62, "body")}
    `;
  } else {
    main = `
      <text x="540" y="735" text-anchor="middle" class="ctaTitle">AIを、事業の力に。</text>
      <text x="540" y="820" text-anchor="middle" class="ctaBody">毎日のAI情報を、実務につながる言葉で。</text>
      <rect x="170" y="900" width="740" height="160" rx="42" fill="#22d3ee" opacity="0.12" stroke="#22d3ee" stroke-width="2"/>
      <text x="540" y="970" text-anchor="middle" class="handle">@yebisusoft</text>
      <text x="540" y="1030" text-anchor="middle" class="url">https://www.yebisusoft.jp/</text>
      <text x="540" y="1145" text-anchor="middle" class="ctaSmall">プロフィールからご相談ください</text>
    `;
  }

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#071a35"/>
        <stop offset="0.58" stop-color="#0f2e5f"/>
        <stop offset="1" stop-color="#061326"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.84" cy="0.16" r="0.72">
        <stop offset="0" stop-color="${accent}" stop-opacity="0.28"/>
        <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
      </radialGradient>
      <style>
        text { font-family: "Yu Gothic", "Meiryo", sans-serif; }
        .label,.eyebrow { font-size: 31px; font-weight: 800; letter-spacing: 4px; }
        .title { font-size: 76px; font-weight: 800; fill: #fff; }
        .summary { font-size: 38px; font-weight: 600; fill: #dbeafe; }
        .heading { font-size: 58px; font-weight: 800; fill: #fff; }
        .body { font-size: 38px; font-weight: 600; fill: #e5eefc; }
        .ctaTitle { font-size: 68px; font-weight: 800; fill: #fff; }
        .ctaBody { font-size: 34px; font-weight: 600; fill: #dbeafe; }
        .handle { font-size: 46px; font-weight: 800; fill: #22d3ee; }
        .url { font-size: 29px; font-weight: 600; fill: #fff; }
        .ctaSmall { font-size: 30px; font-weight: 600; fill: #bfdbfe; }
        .footer { font-size: 24px; font-weight: 600; fill: #94a3b8; }
      </style>
    </defs>
    <rect width="1080" height="1350" fill="url(#bg)"/>
    <rect width="1080" height="1350" fill="url(#glow)"/>
    <circle cx="1015" cy="90" r="210" fill="none" stroke="${accent}" stroke-width="2" opacity="0.22"/>
    <circle cx="1015" cy="90" r="142" fill="none" stroke="${accent}" stroke-width="1" opacity="0.17"/>
    ${main}
    <text x="76" y="1265" class="footer">${escapeXml(date)}  ·  エビスソフト</text>
    <text x="1004" y="1265" text-anchor="end" class="footer">${index + 1} / ${total}</text>
    <rect x="76" y="1305" width="928" height="5" rx="2.5" fill="#fff" opacity="0.12"/>
    <rect x="76" y="1305" width="${progress}" height="5" rx="2.5" fill="${accent}"/>
  </svg>`;
}

function textBlock(text, x, y, fontSize, maxUnits, lineHeight, className) {
  const lines = wrapText(text, maxUnits);
  return `<text x="${x}" y="${y}" class="${className}">${lines
    .map(
      (line, index) =>
        `<tspan x="${x}" dy="${index === 0 ? 0 : Math.round(fontSize * lineHeight)}">${escapeXml(line)}</tspan>`,
    )
    .join("")}</text>`;
}

function wrapText(text, maxUnits) {
  const normalized = String(text).replace(/\s+/g, " ").trim();
  const lines = [];
  let line = "";
  let units = 0;
  for (const char of normalized) {
    const charUnits = /[\x00-\xff]/.test(char) ? 0.56 : 1;
    if (units + charUnits > maxUnits && line) {
      if (/[、。，．！？：；）］｝」』】]/.test(char)) {
        line += char;
        lines.push(line.trim());
        line = "";
        units = 0;
        continue;
      }
      lines.push(line.trim());
      line = "";
      units = 0;
    }
    line += char;
    units += charUnits;
  }
  if (line) lines.push(line.trim());
  return lines;
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function createZip(draftDir, imagePaths, slotLabel) {
  const zipPath = path.join(draftDir, `${slotLabel}-instagram-images.zip`);
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
  const names = imagePaths.map((file) => path.basename(file));
  const result = spawnSync("tar.exe", ["-a", "-c", "-f", zipPath, "-C", draftDir, ...names], {
    windowsHide: true,
    encoding: "utf8",
  });
  if (result.status !== 0) throw new Error(`ZIP作成に失敗しました: ${result.stderr}`);
  return zipPath;
}

async function notifyIPhone(draft, coverPath, zipPath, slot) {
  const topic = process.env.NTFY_TOPIC?.trim();
  if (!topic) {
    console.warn("NTFY_TOPIC が未設定のため、通知をスキップしました");
    return;
  }
  if (!/^[A-Za-z0-9_-]{16,128}$/.test(topic)) {
    throw new Error("NTFY_TOPIC は推測されにくい16文字以上の英数字・_-にしてください");
  }
  const base = (process.env.NTFY_BASE_URL || "https://ntfy.sh").replace(/\/+$/, "");
  const endpoint = `${base}/${encodeURIComponent(topic)}`;
  const title = slot === "morning" ? "EbisSoft AI News Draft" : "EbisSoft AI Knowledge Draft";
  await upload(endpoint, coverPath, {
    Title: title,
    Message: "Instagram draft images are ready",
    Tags: "robot,camera_flash",
    Priority: "4",
  });
  await upload(endpoint, zipPath, {
    Title: `${title} - all images`,
    Message: "6 PNG files for Instagram",
    Tags: "package",
    Priority: "2",
  });
}

async function upload(endpoint, filePath, headers) {
  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      ...headers,
      Filename: path.basename(filePath),
      "Content-Type": filePath.endsWith(".png") ? "image/png" : "application/zip",
    },
    body: fs.readFileSync(filePath),
  });
  if (!response.ok) {
    throw new Error(`ntfy送信に失敗しました (${response.status}): ${await response.text()}`);
  }
}

function sampleDraft(slot) {
  const news = slot === "morning";
  return {
    category: news ? "AIニュース" : "AI知識",
    headline: news ? "AIニュースを仕事の判断材料に変える" : "生成AIは小さく試すほど定着しやすい",
    summary: news
      ? "発表の大きさより、自社の業務に何が変わるかを短く整理します。"
      : "一度に全社導入せず、毎日繰り返す一作業から始めるのが近道です。",
    caption: news
      ? "AIの発表は、機能名だけ追っても仕事にはつながりません。誰の何が変わるのか、今日できる確認は何かまで整理することが大切です。詳しくはプロフィールの yebisusoft.jp へ。"
      : "生成AI導入は、大きなシステムから始める必要はありません。文章の下書きや確認作業など、小さく測れる仕事を一つ選ぶと改善を続けやすくなります。詳しくはプロフィールの yebisusoft.jp へ。",
    hashtags: ["#生成AI", "#AI活用", "#業務効率化", "#エビスソフト"],
    slides: [
      { heading: news ? "何が起きたか" : "まず一作業を選ぶ", body: "毎日発生し、結果を人が確認できる作業から始めます。文章の下書き、要約、分類などが候補です。" },
      { heading: news ? "なぜ重要か" : "よくある誤解", body: "AIを入れればすぐ自動化できるとは限りません。入力、確認、例外処理まで含めて仕事の流れを見ます。" },
      { heading: "実務へのつなぎ方", body: "作業時間と修正回数を記録し、導入前後を比べます。感想だけでなく小さな数字で効果を判断します。" },
      { heading: "今日できること", body: "繰り返し作業を一つ選び、入力例と理想の出力例を三件ずつ用意して試してみましょう。" },
    ],
    sources: [{ label: "エビスソフト", url: "https://www.yebisusoft.jp/ai" }],
  };
}

function optionValue(option) {
  const values = process.argv.slice(2);
  const index = values.indexOf(option);
  if (index === -1) return undefined;
  const value = values[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${option} の値を指定してください`);
  }
  return value;
}
