import fs from "node:fs";
import path from "node:path";
import { exportJarvisReport } from "./jarvis-report.mjs";

const TIME_CANDIDATES = {
  morning: ["07:30", "08:30", "09:30", "10:30"],
  afternoon: ["15:30", "17:00", "18:30", "20:00"],
};

export async function refreshPerformanceStrategy({ bufferQuery, config, statePath, scheduledPosts = [], jarvisOutputDir }) {
  const query = `query SentPostsWithMetrics($organizationId: OrganizationId!, $channelId: ChannelId!) {
    posts(first: 50, input: {
      organizationId: $organizationId,
      filter: { status: [sent], channelIds: [$channelId] }
    }) {
      edges {
        node {
          id
          text
          dueAt
          metrics { type name value unit }
          metricsUpdatedAt
        }
      }
    }
  }`;
  const data = await bufferQuery(config, query, {
    organizationId: config.organizationId,
    channelId: config.channelId,
  });
  const posts = (data.posts?.edges ?? [])
    .map((edge) => normalizePost(edge.node))
    .filter((post) => post.category);
  const strategy = buildStrategy(posts);
  const report = {
    version: 1,
    generatedAt: new Date().toISOString(),
    account: { platform: "instagram", username: "yebisusoft" },
    sentPostCount: posts.length,
    scheduledPostCount: scheduledPosts.length,
    strategy,
    posts: [
      ...posts.map((post) => ({ ...post, status: "sent" })),
      ...scheduledPosts.map(normalizeScheduledPost),
    ],
  };
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  exportJarvisReport(report, jarvisOutputDir);
  return strategy;
}

export function dueAtFor(date, slot, strategy) {
  const time = strategy?.times?.[slot] ?? TIME_CANDIDATES[slot][0];
  return new Date(`${date}T${time}:00+09:00`).toISOString();
}

export function buildStrategy(posts) {
  return {
    times: {
      morning: selectTime("morning", posts),
      afternoon: selectTime("afternoon", posts),
    },
    content: {
      morning: contentGuidance("morning", posts),
      afternoon: contentGuidance("afternoon", posts),
    },
    scoring: "exposure 40 + weighted engagement rate 60",
  };
}

function selectTime(slot, posts) {
  const candidates = TIME_CANDIDATES[slot];
  const category = slot === "morning" ? "AIニュース" : "AI知識";
  const relevant = posts.filter((post) => post.category === category);
  const buckets = candidates.map((time) => ({ time, scores: [] }));

  for (const post of relevant) {
    if (post.score === null) continue;
    const postMinutes = jstMinutes(post.dueAt);
    const nearest = buckets
      .map((bucket, index) => ({ index, distance: Math.abs(toMinutes(bucket.time) - postMinutes) }))
      .sort((a, b) => a.distance - b.distance)[0];
    if (nearest.distance <= 90) buckets[nearest.index].scores.push(post.score);
  }

  const start = relevant.length % candidates.length;
  for (let offset = 0; offset < candidates.length; offset += 1) {
    const bucket = buckets[(start + offset) % candidates.length];
    if (bucket.scores.length === 0) return bucket.time;
  }

  const total = buckets.reduce((sum, bucket) => sum + bucket.scores.length, 0);
  return buckets
    .map((bucket) => {
      const average = bucket.scores.reduce((sum, score) => sum + score, 0) / bucket.scores.length;
      const exploration = 8 * Math.sqrt(Math.log(total + 1) / bucket.scores.length);
      return { time: bucket.time, value: average + exploration };
    })
    .sort((a, b) => b.value - a.value)[0].time;
}

function contentGuidance(slot, posts) {
  const category = slot === "morning" ? "AIニュース" : "AI知識";
  const relevant = posts.filter((post) => post.category === category && post.score !== null);
  if (relevant.length === 0) {
    return {
      sampleSize: 0,
      instruction: "実績データがまだないため、一次情報・実務性・読みやすさを優先して探索する。",
      strongExamples: [],
      weakExamples: [],
    };
  }
  const ranked = [...relevant].sort((a, b) => b.score - a.score);
  return {
    sampleSize: relevant.length,
    instruction: "好調投稿の切り口と実務への落とし込み方を参考にする。題材や表現のコピーは避ける。",
    strongExamples: ranked.slice(0, 3).map(summarizeForPrompt),
    weakExamples: ranked.slice(-2).reverse().map(summarizeForPrompt),
  };
}

function normalizePost(post) {
  const metrics = Object.fromEntries(
    (post.metrics ?? []).map((metric) => [metric.type || metric.name, numeric(metric.value)]),
  );
  return {
    id: post.id,
    dueAt: post.dueAt,
    category: inferCategory(post.text, post.dueAt),
    content: post.text ?? "",
    excerpt: cleanExcerpt(post.text),
    metricsUpdatedAt: post.metricsUpdatedAt,
    metrics,
    score: performanceScore(metrics),
  };
}

function performanceScore(metrics) {
  if (Object.keys(metrics).length === 0) return null;
  const exposure = Math.max(metrics.views ?? 0, metrics.impressions ?? 0, metrics.reach ?? 0);
  const engagement =
    (metrics.reactions ?? 0) +
    2 * (metrics.comments ?? 0) +
    3 * (metrics.shares ?? 0) +
    4 * (metrics.saves ?? 0);
  const engagementRate = exposure > 0 ? engagement / exposure : 0;
  const exposureScore = 40 * clamp(Math.log1p(exposure) / Math.log1p(10000));
  const engagementScore = 60 * clamp(engagementRate / 0.1);
  return Number(clamp(exposureScore + engagementScore, 0, 100).toFixed(2));
}

function normalizeScheduledPost(post) {
  return {
    id: post.id,
    status: "scheduled",
    dueAt: post.dueAt,
    category: inferCategory(post.text, post.dueAt),
    content: post.text ?? "",
    excerpt: cleanExcerpt(post.text),
    metricsUpdatedAt: null,
    metrics: {},
    score: null,
  };
}

function clamp(value, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function summarizeForPrompt(post) {
  return {
    excerpt: post.excerpt,
    score: post.score,
    views: post.metrics.views ?? post.metrics.impressions ?? post.metrics.reach ?? 0,
    saves: post.metrics.saves ?? 0,
    shares: post.metrics.shares ?? 0,
  };
}

function inferCategory(text = "", dueAt) {
  if (text.includes("#AIニュース") || text.includes("【AIニュース")) return "AIニュース";
  if (text.includes("#AI知識") || text.includes("【AI知識")) return "AI知識";
  if (dueAt) return jstMinutes(dueAt) < 12 * 60 ? "AIニュース" : "AI知識";
  return null;
}

function cleanExcerpt(text = "") {
  return text.replace(/\s+/g, " ").trim().slice(0, 180);
}

function numeric(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function jstMinutes(isoDate) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(isoDate));
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

function toMinutes(time) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}
