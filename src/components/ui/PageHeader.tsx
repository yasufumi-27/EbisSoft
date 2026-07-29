import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

/** 下層ページ共通のページヘッダー（英字ラベル＋H1＋リード文）。 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_-15%,rgba(34,211,238,0.14),transparent_70%)]"
      />
      <div
        aria-hidden
        className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(70%_60%_at_50%_20%,black,transparent)]"
      />
      <Container>
        <div className="max-w-3xl" data-reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {lead ? (
            <p className="speakable mt-6 text-base leading-relaxed text-slate-300 sm:text-lg">
              {lead}
            </p>
          ) : null}
          {children}
        </div>
      </Container>
    </section>
  );
}
