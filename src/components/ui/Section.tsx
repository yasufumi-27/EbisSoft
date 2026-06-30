import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

/** セクション見出し（アイ・キャッチ＋H2＋リード文）。 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
}) {
  const alignment = align === "center" ? "mx-auto text-center" : "text-left";
  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-bold tracking-wider text-brand uppercase">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

/** ページの各セクション。id でアンカーナビ対応、bg で背景切り替え。 */
export function Section({
  id,
  children,
  className = "",
  bg = "white",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  bg?: "white" | "muted" | "brand";
}) {
  const bgClass =
    bg === "muted" ? "bg-slate-50" : bg === "brand" ? "bg-slate-900 text-white" : "bg-white";
  return (
    <section id={id} className={`scroll-mt-20 py-20 sm:py-28 ${bgClass} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}
