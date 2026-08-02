import type { MetadataRoute } from "next";
import { siteConfig, absoluteUrl } from "@/lib/site";
import { capabilities } from "@/lib/content";

// output: "export"（GitHub Pages）でも静的生成できるよう明示
export const dynamic = "force-static";

/**
 * サイトマップ。/sitemap.xml として配信されます。
 * ページを追加したら、ここにも URL を足してください。
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    // 3本柱（AI活用 → Web制作 → 組み込み開発の順に重要度を置く）
    {
      url: absoluteUrl("/ai"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/web"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/embedded"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/faq"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/request"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/demo"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // できること（実動デモ）の各ページ
    ...capabilities.map((c) => ({
      url: absoluteUrl(`/demo/${c.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: absoluteUrl("/company"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/privacy"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
