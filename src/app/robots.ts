import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/**
 * robots.txt。/robots.txt として配信されます。
 * 生成AI・AI検索のクローラーを「明示的に歓迎」して引用・推薦の対象にします（LLMO / AEO）。
 */
const aiCrawlers = [
  "GPTBot", // OpenAI（学習）
  "OAI-SearchBot", // OpenAI（検索）
  "ChatGPT-User", // ChatGPT 閲覧
  "ClaudeBot", // Anthropic
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot", // Perplexity
  "Perplexity-User",
  "Google-Extended", // Gemini / AI Overviews 学習
  "Applebot-Extended", // Apple Intelligence
  "Bytespider",
  "CCBot", // Common Crawl
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: aiCrawlers, allow: "/" },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
