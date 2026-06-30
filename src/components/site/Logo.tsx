import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { siteConfig } from "@/lib/site";

/** ロゴ（マーク＋ワードマーク）。ヘッダー/フッターで共用。 */
export function Logo({ tone = "light" }: { tone?: "light" | "dark" }) {
  const wordColor = tone === "dark" ? "text-white" : "text-slate-900";
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5"
      aria-label={`${siteConfig.name} ホームへ`}
    >
      <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-violet-500 text-white shadow-sm">
        <Icon name="rocket" className="size-5" />
      </span>
      <span className={`text-lg font-bold tracking-tight ${wordColor}`}>{siteConfig.name}</span>
    </Link>
  );
}
