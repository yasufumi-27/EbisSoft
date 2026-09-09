import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { exportJarvisReport } from "./jarvis-report.mjs";

test("exports Jarvis-readable files and replaces a same-day history snapshot", () => {
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "ebissoft-report-"));
  const base = {
    generatedAt: "2026-09-10T01:00:00.000Z",
    account: { platform: "instagram", username: "yebisusoft" },
    strategy: { times: { morning: "07:30", afternoon: "15:30" } },
    posts: [{
      id: "post/1", status: "sent", category: "AIニュース", dueAt: "2026-09-09T22:30:00.000Z",
      content: "テスト投稿", excerpt: "テスト投稿", score: 42, metricsUpdatedAt: "2026-09-10T00:00:00.000Z",
      metrics: { views: 100, reach: 80, saves: 3 },
    }],
  };
  exportJarvisReport(base, outputDir);
  exportJarvisReport({ ...base, generatedAt: "2026-09-10T05:00:00.000Z", posts: [{ ...base.posts[0], score: 50, metrics: { views: 150, reach: 120, saves: 5 } }] }, outputDir);

  for (const relative of ["latest.json", "posts.jsonl", "posts.csv", "history.jsonl", "schema.json", "README.md", "charts/overview.svg", "charts/posts/post_1.svg", "posts/post_1.json"]) {
    assert.equal(fs.existsSync(path.join(outputDir, relative)), true, relative);
  }
  const history = fs.readFileSync(path.join(outputDir, "history.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
  assert.equal(history.length, 1);
  assert.equal(history[0].score, 50);
  const post = JSON.parse(fs.readFileSync(path.join(outputDir, "posts", "post_1.json"), "utf8"));
  assert.equal(post.history.length, 1);
  assert.equal(post.metrics.views, 150);
  assert.match(fs.readFileSync(path.join(outputDir, "posts.csv"), "utf8"), /"テスト投稿"/);
  assert.match(fs.readFileSync(path.join(outputDir, "charts", "posts", "post_1.svg"), "utf8"), /総合スコア/);

  fs.rmSync(outputDir, { recursive: true, force: true });
});
