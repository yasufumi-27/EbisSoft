import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/icons";
import { ContactForm } from "@/components/sections/ContactForm";
import { siteConfig } from "@/lib/site";

const benefits = ["初回相談・お見積もりは無料", "全国オンライン対応", "最短2週間で公開"];

/** お問い合わせ（最終CTA）。 */
export function ContactCta() {
  const { contact } = siteConfig;
  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden">
      {/* クライマックスの光芒：シアン→ゴールド */}
      <div aria-hidden className="divider-glow absolute inset-x-0 top-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(34,211,238,0.12),transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-[-8%] -z-10 size-[30rem] rounded-full bg-gold/10 blur-3xl"
      />

      <Container className="py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="text-white" data-reveal>
            <p className="eyebrow">Contact</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              まずは<span className="text-gradient">無料</span>で
              <br />
              ご相談ください
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-slate-300">
              「何から始めればいいか分からない」段階でも大丈夫です。現状とゴールを伺い、最適な進め方とお見積もりをご提案します。無理な営業は一切いたしません。
            </p>

            <ul className="mt-8 space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-slate-200">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-accent text-ink shadow-[0_0_12px_rgba(34,211,238,0.5)]">
                    <Icon name="check" className="size-4" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-10 space-y-4 border-t border-white/10 pt-8">
              <a
                href={`tel:${contact.telephone}`}
                className="group flex items-center gap-3 text-slate-200 transition-colors hover:text-white"
              >
                <span className="grid size-10 place-items-center rounded-lg border border-white/15 bg-white/5 transition-all group-hover:border-brand/50 group-hover:shadow-[0_0_16px_rgba(34,211,238,0.3)]">
                  <Icon name="phone" className="size-5" />
                </span>
                <span>
                  <span className="block text-xs text-slate-500">お電話でのご相談</span>
                  <span className="font-display block text-lg font-bold tracking-wide">
                    {contact.telephoneDisplay}
                  </span>
                  <span className="block text-xs text-slate-500">{contact.openingHoursDisplay}</span>
                </span>
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="group flex items-center gap-3 text-slate-200 transition-colors hover:text-white"
              >
                <span className="grid size-10 place-items-center rounded-lg border border-white/15 bg-white/5 transition-all group-hover:border-brand/50 group-hover:shadow-[0_0_16px_rgba(34,211,238,0.3)]">
                  <Icon name="mail" className="size-5" />
                </span>
                <span>
                  <span className="block text-xs text-slate-500">メールでのご相談</span>
                  <span className="block text-lg font-bold">{contact.email}</span>
                </span>
              </a>
            </div>
          </div>

          <div className="relative" data-reveal style={{ "--reveal-delay": "0.12s" } as React.CSSProperties}>
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
