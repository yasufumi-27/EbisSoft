import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { siteConfig } from "@/lib/site";

/** ロゴ（マーク＋ワードマーク）。ヘッダー/フッターで共用。 */
export function Logo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2.5"
      aria-label={`${siteConfig.name} ホームへ`}
    >
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-lg bg-gradient-to-br from-brand via-sky-500 to-accent text-ink shadow-[0_0_18px_rgba(34,211,238,0.45)] transition-shadow group-hover:shadow-[0_0_28px_rgba(34,211,238,0.7)]">
        <Icon name="rocket" className="size-5" />
      </span>
      <span className="font-display text-lg font-bold tracking-[0.12em] text-white">
        {siteConfig.name}
      </span>
    </Link>
  );
}
