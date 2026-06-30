import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/**
 * サイトマップ。/sitemap.xml として配信されます。
 * 下層ページ（実績詳細・ブログ等）を追加したら、ここに URL を足してください。
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
  ];
}
