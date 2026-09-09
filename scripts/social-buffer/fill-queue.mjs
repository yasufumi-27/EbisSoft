/**
 * Buffer Free 向けの Instagram Reels キュー補充。
 *
 * - 無料枠の「同時予約10件」を超えず、常に8件（4日分）を目標にする
 * - Codex CLI で原稿・スライド・Reel MP4 を生成する
 * - 動画を GitHub の公開 raw URL に置き、Buffer API へ予約を作成する
 *
 * 投稿実績から選んだ朝・午後の時刻をUTCへ変換して個別予約する。
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { dueAtFor, refreshPerformanceStrategy } from "./performance.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, "../..");
const draftRoot = path.join(projectDir, "social-drafts");
const publicRoot = path.join(projectDir, "public", "social", "instagram");
const performancePath = path.join(projectDir, "social-data", "instagram-performance.json");
const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const sample = args.has("--sample");
const checkOnly = args.has("--check");
const performanceOnly = args.has("--performance-only");
const publishExistingDate = optionValue("--publish-existing");
const target = positiveInt(optionValue("--target") ?? "8", "--target");
const maxPerRun = positiveInt(optionValue("--max-per-run") ?? "2", "--max-per-run");

loadEnv(path.join(projectDir, ".env.local"));

const config = {
  apiKey: process.env.BUFFER_API_KEY?.trim(),
  organizationId: process.env.BUFFER_ORGANIZATION_ID?.trim(),
  channelId: process.env.BUFFER_INSTAGRAM_CHANNEL_ID?.trim(),
  mediaBaseUrl: (process.env.BUFFER_MEDIA_BASE_URL ||
    "https://raw.githubusercontent.com/yasufumi-27/EbisSoft/main/public/social/instagram").replace(/\/+$/, ""),
  gitRemote: process.env.SOCIAL_GIT_REMOTE?.trim() || "origin",
  gitBranch: process.env.SOCIAL_GIT_BRANCH?.trim() || "main",
};

if (target > 10) throw new Error("Buffer Freeでは --target は10以下にしてください");
if (publishExistingDate && !/^\d{4}-\d{2}-\d{2}$/.test(publishExistingDate)) {
  throw new Error("--publish-existing は YYYY-MM-DD 形式で指定してください");
}
if (!dryRun) {
  requireApiKey(config);
  await resolveBufferConfig(config);
}

const scheduled = dryRun ? [] : await scheduledPosts(config);
if (checkOnly) {
  console.log(`Buffer connection OK: @yebisusoft, ${scheduled.length} scheduled posts`);
  process.exit(0);
}

const performanceStrategy = dryRun ? null : await loadPerformanceStrategy(config);
if (performanceOnly) {
  console.log(`Performance report updated: ${performancePath}`);
  process.exit(0);
}

if (publishExistingDate) {
  const jobs = ["morning", "afternoon"].map((slot) =>
    existingMedia(publishExistingDate, slot, dueAtFor(publishExistingDate, slot, performanceStrategy)),
  );
  if (scheduled.length + jobs.length > 10) {
    throw new Error(`予約件数が上限を超えます: ${scheduled.length} + ${jobs.length}`);
  }
  for (const job of jobs) {
    const post = await createReelPost(config, job);
    console.log(`Queued existing ${job.slot} Reel for ${post.dueAt ?? "the next Buffer slot"}: ${post.id}`);
  }
  process.exit(0);
}
const needed = Math.max(0, Math.min(maxPerRun, target - scheduled.length));

if (needed === 0) {
  console.log(`Buffer queue is healthy: ${scheduled.length}/${target} scheduled posts`);
  process.exit(0);
}

const jobs = [];
for (const plan of planNewJobs(scheduled, needed)) {
  const { slot, date } = plan;
  const dueAt = dueAtFor(date, slot, performanceStrategy);
  const draftDir = generateDraft(slot, date, sample, performancePath);
  updateDraftManifest(draftDir, { dueAt, strategyGeneratedAt: performanceStrategy?.generatedAt });
  const media = dryRun ? previewMedia(draftDir, date, slot) : stageMedia(draftDir, date, slot);
  jobs.push({ slot, date, dueAt, draftDir, ...media });
}

if (dryRun) {
  for (const job of jobs) console.log(`Dry run: ${job.slot} ${job.date} -> ${job.publicUrl}`);
  process.exit(0);
}

pushMedia(jobs, config);
for (const job of jobs) {
  const post = await createReelPost(config, job);
  console.log(`Queued ${job.slot} Reel for ${post.dueAt ?? "the next Buffer slot"}: ${post.id}`);
}

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const rawLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = rawLine.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || process.env[match[1]]) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}

function requireApiKey(current) {
  if (!current.apiKey) throw new Error(".env.local に BUFFER_API_KEY を設定してください");
}

async function resolveBufferConfig(current) {
  if (!current.organizationId) {
    const data = await bufferQuery(
      current,
      "query GetOrganizations { account { organizations { id name } } }",
      {},
    );
    const organizations = data.account?.organizations ?? [];
    if (organizations.length !== 1) {
      throw new Error(`Buffer組織が${organizations.length}件のため自動選択できません`);
    }
    current.organizationId = organizations[0].id;
  }

  if (!current.channelId) {
    const query = `query GetChannels($organizationId: OrganizationId!) {
      channels(input: { organizationId: $organizationId }) { id name displayName service }
    }`;
    const data = await bufferQuery(current, query, { organizationId: current.organizationId });
    const instagramChannels = (data.channels ?? []).filter((channel) => channel.service === "instagram");
    const yebisuChannel = instagramChannels.find(
      (channel) => channel.name === "yebisusoft" || channel.displayName === "yebisusoft",
    );
    const selected = yebisuChannel ?? (instagramChannels.length === 1 ? instagramChannels[0] : undefined);
    if (!selected) throw new Error("BufferのInstagramチャンネル @yebisusoft を自動選択できません");
    current.channelId = selected.id;
  }
}

async function scheduledPosts(current) {
  const query = `query ScheduledPosts($organizationId: OrganizationId!, $channelId: ChannelId!) {
    posts(first: 20, input: { organizationId: $organizationId, filter: { status: [scheduled], channelIds: [$channelId] } }) {
      edges { node { id dueAt text } }
    }
  }`;
  const data = await bufferQuery(current, query, {
    organizationId: current.organizationId,
    channelId: current.channelId,
  });
  return data.posts?.edges?.map((edge) => edge.node) ?? [];
}

async function loadPerformanceStrategy(current) {
  try {
    const strategy = await refreshPerformanceStrategy({
      bufferQuery,
      config: current,
      statePath: performancePath,
    });
    strategy.generatedAt = new Date().toISOString();
    console.log(
      `Performance strategy: news ${strategy.times.morning}, knowledge ${strategy.times.afternoon}`,
    );
    return strategy;
  } catch (error) {
    console.warn(`Performance metrics unavailable; using safe defaults: ${error.message}`);
    return null;
  }
}

function generateDraft(slot, date, useSample, strategyPath) {
  const command = process.execPath;
  const commandArgs = [path.join(projectDir, "scripts", "social-drafts", "run.mjs"), slot, "--date", date, "--no-notify"];
  if (useSample) commandArgs.push("--sample");
  if (strategyPath && fs.existsSync(strategyPath)) commandArgs.push("--strategy", strategyPath);
  const result = spawnSync(command, commandArgs, {
    cwd: projectDir,
    encoding: "utf8",
    windowsHide: true,
    timeout: 15 * 60 * 1000,
  });
  if (result.status !== 0) {
    throw new Error(`SNS原稿の生成に失敗しました: ${result.stderr || result.stdout}`);
  }
  const baseLabel = slot === "morning" ? "am-news" : "pm-knowledge";
  const label = useSample ? `${baseLabel}-sample` : baseLabel;
  const draftDir = path.join(draftRoot, date, label);
  if (!fs.existsSync(path.join(draftDir, "reel.mp4"))) {
    throw new Error(`Reel MP4 が見つかりません: ${draftDir}`);
  }
  return draftDir;
}

function updateDraftManifest(draftDir, additions) {
  const manifestPath = path.join(draftDir, "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  fs.writeFileSync(manifestPath, `${JSON.stringify({ ...manifest, ...additions }, null, 2)}\n`, "utf8");
}

function stageMedia(draftDir, date, slot) {
  const destinationDir = path.join(publicRoot, date, slot);
  fs.mkdirSync(destinationDir, { recursive: true });
  for (const name of ["reel.mp4", "caption.txt", "manifest.json"]) {
    fs.copyFileSync(path.join(draftDir, name), path.join(destinationDir, name));
  }
  return { destinationDir, ...previewMedia(draftDir, date, slot) };
}

function existingMedia(date, slot, dueAt) {
  const destinationDir = path.join(publicRoot, date, slot);
  for (const name of ["reel.mp4", "caption.txt"]) {
    if (!fs.existsSync(path.join(destinationDir, name))) {
      throw new Error(`公開済みReelの${name}が見つかりません: ${destinationDir}`);
    }
  }
  return { date, slot, dueAt, destinationDir, ...previewMedia(destinationDir, date, slot) };
}

function previewMedia(draftDir, date, slot) {
  const caption = fs.readFileSync(path.join(draftDir, "caption.txt"), "utf8").trim();
  const relativePath = path.posix.join(date, slot, "reel.mp4");
  return {
    caption,
    publicUrl: `${config.mediaBaseUrl}/${relativePath}`,
  };
}

function pushMedia(jobs, current) {
  const targets = jobs.map((job) => path.relative(projectDir, job.destinationDir));
  git(["add", "--", ...targets]);
  const result = spawnSync(
    "git",
    ["diff", "--cached", "--quiet", "--", ...targets],
    { cwd: projectDir, windowsHide: true },
  );
  if (result.status === 0) return;
  if (result.status !== 1) throw new Error("Gitのステージ状態を確認できませんでした");
  const dates = [...new Set(jobs.map((job) => job.date))].join(", ");
  git(["commit", "-m", `chore(social): stage Instagram reels ${dates}`, "--", ...targets]);
  git(["push", current.gitRemote, `HEAD:${current.gitBranch}`]);
}

function git(commandArgs) {
  const result = spawnSync("git", commandArgs, {
    cwd: projectDir,
    encoding: "utf8",
    windowsHide: true,
    timeout: 2 * 60 * 1000,
  });
  if (result.status !== 0) throw new Error(`git ${commandArgs[0]} に失敗しました: ${result.stderr || result.stdout}`);
}

async function createReelPost(current, job) {
  const query = `mutation CreateInstagramReel($input: CreatePostInput!) {
    createPost(input: $input) {
      ... on PostActionSuccess { post { id dueAt } }
      ... on MutationError { message }
    }
  }`;
  const input = {
    text: job.caption,
    channelId: current.channelId,
    schedulingType: "automatic",
    mode: job.dueAt ? "customScheduled" : "addToQueue",
    ...(job.dueAt ? { dueAt: job.dueAt } : {}),
    aiAssisted: true,
    assets: [{ video: { url: job.publicUrl, metadata: { thumbnailOffset: 0 } } }],
    metadata: { instagram: { type: "reel", shouldShareToFeed: true } },
  };
  const data = await bufferQuery(current, query, { input });
  const payload = data.createPost;
  if (payload?.message) throw new Error(`Buffer投稿作成に失敗しました: ${payload.message}`);
  if (!payload?.post) throw new Error("Buffer投稿作成の応答が不正です");
  return payload.post;
}

function planNewJobs(scheduled, count) {
  const plans = [];
  for (let offset = 1; offset <= 30 && plans.length < count; offset += 1) {
    const date = jstDate(addDays(new Date(), offset));
    const postsForDate = scheduled.filter((post) => jstDate(new Date(post.dueAt)) === date);
    const categories = new Set(postsForDate.map((post) => inferCategory(post.text)));
    if (!categories.has("AIニュース") && plans.length < count) plans.push({ date, slot: "morning" });
    if (!categories.has("AI知識") && plans.length < count) plans.push({ date, slot: "afternoon" });
  }
  if (plans.length !== count) throw new Error("30日以内に投稿枠を確保できませんでした");
  return plans;
}

function inferCategory(text = "") {
  if (text.includes("#AIニュース") || text.includes("【AIニュース")) return "AIニュース";
  if (text.includes("#AI知識") || text.includes("【AI知識")) return "AI知識";
  return null;
}

async function bufferQuery(current, query, variables) {
  const response = await fetch("https://api.buffer.com", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${current.apiKey}` },
    body: JSON.stringify({ query, variables }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.errors?.length) {
    throw new Error(`Buffer API error: ${body.errors?.map((item) => item.message).join("; ") || response.status}`);
  }
  return body.data;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function jstDate(date) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function positiveInt(value, label) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed < 1) throw new Error(`${label} は正の整数にしてください`);
  return parsed;
}

function optionValue(option) {
  const values = process.argv.slice(2);
  const index = values.indexOf(option);
  if (index === -1) return undefined;
  const value = values[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${option} の値を指定してください`);
  return value;
}
