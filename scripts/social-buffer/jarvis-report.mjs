import fs from "node:fs";
import path from "node:path";

const SCHEMA_VERSION = 1;
const METRIC_KEYS = [
  "views",
  "reach",
  "impressions",
  "saves",
  "shares",
  "comments",
  "reactions",
  "totalTimeWatched",
  "averageTimeWatched",
];

export function exportJarvisReport(report, outputDir) {
  if (!outputDir) return;
  const capturedAt = report.generatedAt ?? new Date().toISOString();
  const capturedDate = jstDate(capturedAt);
  const historyPath = path.join(outputDir, "history.jsonl");
  const previousPosts = readJsonLines(path.join(outputDir, "posts.jsonl"));
  const previousHistory = readJsonLines(historyPath);
  const current = (report.posts ?? []).map((post) => normalizeRecord(post, capturedAt));
  const mergedHistory = mergeHistory(previousHistory, current, capturedAt, capturedDate);
  const historyByPost = groupHistory(mergedHistory);
  const posts = mergePosts(previousPosts, current).map((post) => ({
    ...post,
    history: historyByPost.get(post.post_id) ?? post.history ?? [],
    chart: `charts/posts/${safeId(post.post_id)}.svg`,
  }));

  fs.mkdirSync(path.join(outputDir, "posts"), { recursive: true });
  fs.mkdirSync(path.join(outputDir, "charts", "posts"), { recursive: true });
  const latest = {
    schema_version: SCHEMA_VERSION,
    generated_at: capturedAt,
    account: report.account ?? { platform: "instagram", username: "yebisusoft" },
    summary: {
      sent_posts: posts.filter((post) => post.status === "sent").length,
      scheduled_posts: posts.filter((post) => post.status === "scheduled").length,
      average_score: average(posts.map((post) => post.score).filter(Number.isFinite)),
    },
    strategy: report.strategy,
    files: {
      posts_jsonl: "posts.jsonl",
      posts_csv: "posts.csv",
      history_jsonl: "history.jsonl",
      overview_chart: "charts/overview.svg",
    },
  };
  writeJsonLines(historyPath, mergedHistory);
  writeJsonLines(path.join(outputDir, "posts.jsonl"), posts);
  writeText(path.join(outputDir, "posts.csv"), toCsv(posts));
  for (const post of posts) {
    writeJson(path.join(outputDir, "posts", `${safeId(post.post_id)}.json`), post);
    writeText(
      path.join(outputDir, "charts", "posts", `${safeId(post.post_id)}.svg`),
      postChart(post),
    );
  }
  writeText(path.join(outputDir, "charts", "overview.svg"), overviewChart(posts));
  writeJson(path.join(outputDir, "schema.json"), schemaContract());
  writeText(path.join(outputDir, "README.md"), readme());
  // Readers can use latest.json as the completion marker for this refresh.
  writeJson(path.join(outputDir, "latest.json"), latest);
}

function normalizeRecord(post, capturedAt) {
  return {
    schema_version: SCHEMA_VERSION,
    post_id: String(post.id),
    status: post.status ?? "sent",
    category: post.category,
    published_at_utc: post.status === "sent" ? post.dueAt ?? null : null,
    published_at_jst: post.status === "sent" ? jstDateTime(post.dueAt) : null,
    scheduled_at_utc: post.status === "scheduled" ? post.dueAt ?? null : null,
    scheduled_at_jst: post.status === "scheduled" ? jstDateTime(post.dueAt) : null,
    content: post.content ?? post.text ?? "",
    excerpt: post.excerpt ?? cleanExcerpt(post.text),
    score: post.score ?? null,
    metrics: Object.fromEntries(METRIC_KEYS.map((key) => [key, numeric(post.metrics?.[key])])),
    metrics_updated_at: post.metricsUpdatedAt ?? null,
    report_updated_at: capturedAt,
  };
}

function mergeHistory(previous, current, capturedAt, capturedDate) {
  const keyed = new Map();
  for (const point of previous) {
    if (point?.post_id && point?.captured_date) keyed.set(`${point.post_id}:${point.captured_date}`, point);
  }
  for (const post of current.filter((item) => item.status === "sent")) {
    keyed.set(`${post.post_id}:${capturedDate}`, {
      schema_version: SCHEMA_VERSION,
      captured_at: capturedAt,
      captured_date: capturedDate,
      post_id: post.post_id,
      category: post.category,
      published_at_utc: post.published_at_utc,
      score: post.score,
      metrics: post.metrics,
    });
  }
  return [...keyed.values()].sort((a, b) =>
    `${a.captured_at}:${a.post_id}`.localeCompare(`${b.captured_at}:${b.post_id}`),
  );
}

function mergePosts(previous, current) {
  const merged = new Map(previous.filter((post) => post.status === "sent").map((post) => [post.post_id, post]));
  for (const post of current) merged.set(post.post_id, post);
  return [...merged.values()].sort((a, b) =>
    String(b.published_at_utc ?? b.scheduled_at_utc ?? "").localeCompare(
      String(a.published_at_utc ?? a.scheduled_at_utc ?? ""),
    ),
  );
}

function groupHistory(history) {
  const grouped = new Map();
  for (const point of history) {
    if (!grouped.has(point.post_id)) grouped.set(point.post_id, []);
    grouped.get(point.post_id).push(point);
  }
  return grouped;
}

function toCsv(posts) {
  const headings = [
    "post_id", "status", "category", "published_at_jst", "scheduled_at_jst", "content", "score",
    ...METRIC_KEYS, "metrics_updated_at", "report_updated_at", "chart",
  ];
  const rows = posts.map((post) => headings.map((heading) => {
    if (METRIC_KEYS.includes(heading)) return post.metrics?.[heading] ?? 0;
    return post[heading] ?? "";
  }));
  return `\uFEFF${[headings, ...rows].map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

function postChart(post) {
  const history = post.history ?? [];
  const panels = [
    { title: "閲覧・リーチ", keys: ["views", "reach", "impressions"], colors: ["#2563eb", "#16a34a", "#7c3aed"] },
    { title: "保存・反応", keys: ["saves", "shares", "comments", "reactions"], colors: ["#ea580c", "#db2777", "#0891b2", "#64748b"] },
    { title: "総合スコア（0–100）", keys: ["score"], colors: ["#111827"], fixedMax: 100 },
  ];
  const body = panels.map((panel, index) => plotPanel(history, panel, 90, 240 + index * 205, 1020, 145)).join("\n");
  return svgDocument(`
    <text x="90" y="82" class="title">${xml(post.category ?? "Instagram投稿")}</text>
    <text x="90" y="122" class="meta">${xml(post.published_at_jst ?? post.scheduled_at_jst ?? "日時未定")} / score ${post.score ?? "–"}</text>
    <text x="90" y="160" class="excerpt">${xml(trim(post.excerpt, 70))}</text>
    ${history.length === 0 ? '<text x="600" y="205" text-anchor="middle" class="empty">公開後の計測データを待っています</text>' : ""}
    ${body}
  `);
}

function overviewChart(posts) {
  const scored = posts
    .filter((post) => post.status === "sent" && Number.isFinite(post.score))
    .sort((a, b) => String(a.published_at_utc).localeCompare(String(b.published_at_utc)));
  const history = scored.map((post, index) => ({
    captured_date: post.published_at_jst?.slice(0, 10) ?? String(index + 1),
    score: post.score,
  }));
  return svgDocument(`
    <text x="90" y="82" class="title">エビスソフト Instagram 投稿スコア推移</text>
    <text x="90" y="122" class="meta">公開順 / 0–100点（閲覧40・反応40・視聴20）</text>
    ${scored.length === 0 ? '<text x="600" y="220" text-anchor="middle" class="empty">公開済み投稿の計測データを待っています</text>' : ""}
    ${plotPanel(history, { title: "全投稿", keys: ["score"], colors: ["#2563eb"], fixedMax: 100 }, 90, 180, 1020, 520)}
  `);
}

function plotPanel(history, panel, x, y, width, height) {
  const values = panel.keys.flatMap((key) => history.map((point) => metricValue(point, key)));
  const max = panel.fixedMax ?? Math.max(1, ...values);
  const xAt = (index) => x + (history.length <= 1 ? width / 2 : (index / (history.length - 1)) * width);
  const yAt = (value) => y + height - (Math.max(0, value) / max) * height;
  const series = panel.keys.map((key, seriesIndex) => {
    const points = history.map((point, index) => `${xAt(index)},${yAt(metricValue(point, key))}`).join(" ");
    const circles = history.map((point, index) =>
      `<circle cx="${xAt(index)}" cy="${yAt(metricValue(point, key))}" r="4" fill="${panel.colors[seriesIndex]}"/>`,
    ).join("");
    return `${history.length > 1 ? `<polyline points="${points}" fill="none" stroke="${panel.colors[seriesIndex]}" stroke-width="3"/>` : ""}${circles}`;
  }).join("");
  const legend = panel.keys.map((key, index) =>
    `<g transform="translate(${x + 250 + index * 165},${y - 24})"><circle r="5" fill="${panel.colors[index]}"/><text x="11" y="5" class="legend">${xml(key)}</text></g>`,
  ).join("");
  const dates = history.map((point, index) =>
    `<text x="${xAt(index)}" y="${y + height + 26}" text-anchor="middle" class="axis">${xml(point.captured_date?.slice(5) ?? "")}</text>`,
  ).join("");
  return `<g><text x="${x}" y="${y - 20}" class="panel">${xml(panel.title)}</text>${legend}
    <line x1="${x}" y1="${y}" x2="${x}" y2="${y + height}" class="grid"/><line x1="${x}" y1="${y + height}" x2="${x + width}" y2="${y + height}" class="grid"/>
    <text x="${x - 12}" y="${y + 5}" text-anchor="end" class="axis">${formatNumber(max)}</text><text x="${x - 12}" y="${y + height + 5}" text-anchor="end" class="axis">0</text>${series}${dates}</g>`;
}

function svgDocument(body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" role="img">
  <rect width="1200" height="900" fill="#f8fafc"/>
  <style>.title{font:700 32px system-ui,sans-serif;fill:#0f172a}.meta{font:18px system-ui,sans-serif;fill:#475569}.excerpt{font:16px system-ui,sans-serif;fill:#334155}.panel{font:700 18px system-ui,sans-serif;fill:#0f172a}.legend,.axis{font:13px system-ui,sans-serif;fill:#64748b}.grid{stroke:#cbd5e1;stroke-width:1}.empty{font:20px system-ui,sans-serif;fill:#64748b}</style>
  ${body}
</svg>\n`;
}

function schemaContract() {
  return {
    schema_version: SCHEMA_VERSION,
    description: "エビスソフト Instagram 投稿実績データ契約",
    primary_files: {
      "latest.json": "最新集計と改善戦略",
      "posts.jsonl": "投稿ごとの最新値と日次履歴（1行1投稿）",
      "history.jsonl": "日次スナップショット（1行1投稿・1日）",
      "posts.csv": "表計算・BI向けの最新値",
    },
    score: {
      range: [0, 100],
      weights: { exposure: 40, engagement_rate: 40, watch_time: 20 },
      note: "Bufferが返した指標だけで算出。未取得時はnull。",
    },
    timezone: "Asia/Tokyo",
    metric_fields: METRIC_KEYS,
  };
}

function readme() {
  return `# エビスソフト Instagram 分析データ\n\nこのディレクトリは自動生成されます。ジャービス側は \`latest.json\` から各ファイルを発見でき、\`posts.jsonl\` または \`posts.csv\` で投稿時刻・本文・閲覧・リーチ・保存・スコアを参照できます。\n\n- \`history.jsonl\`: 公開投稿の日次推移（同じ日を再実行すると上書き統合）\n- \`charts/posts/*.svg\`: 投稿別の推移グラフ\n- \`charts/overview.svg\`: 全投稿のスコア推移\n- \`schema.json\`: フィールドとスコア仕様\n\n時刻はUTCと日本時間（Asia/Tokyo）を併記します。APIキーなどの秘密情報は含みません。\n`;
}

function metricValue(point, key) {
  return numeric(key === "score" ? point.score : point.metrics?.[key]);
}

function writeJson(filePath, value) {
  writeText(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeJsonLines(filePath, values) {
  writeText(filePath, values.map((value) => JSON.stringify(value)).join("\n") + (values.length ? "\n" : ""));
}

function writeText(filePath, content) {
  const temporary = `${filePath}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, content, "utf8");
  fs.renameSync(temporary, filePath);
}

function readJsonLines(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return fs.readFileSync(filePath, "utf8").split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

function csvCell(value) {
  const text = String(value).replace(/"/g, '""');
  return `"${text}"`;
}

function numeric(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function average(values) {
  if (values.length === 0) return null;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

function safeId(value) {
  return String(value).replace(/[^A-Za-z0-9._-]/g, "_");
}

function cleanExcerpt(text = "") {
  return text.replace(/\s+/g, " ").trim().slice(0, 180);
}

function trim(value = "", length) {
  return value.length > length ? `${value.slice(0, length - 1)}…` : value;
}

function xml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character]);
}

function formatNumber(value) {
  return new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 1 }).format(value);
}

function jstDate(value) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
}

function jstDateTime(value) {
  if (!value) return null;
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).format(new Date(value));
  return `${parts.replace(" ", "T")}+09:00`;
}
