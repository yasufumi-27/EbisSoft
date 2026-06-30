import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/icons";
import { ContactForm } from "@/components/sections/ContactForm";
import { siteConfig } from "@/lib/site";

const benefits = ["初回相談・お見積もりは無料", "全国オンライン対応", "最短2週間で公開"];

/** お問い合わせ（最終CTA）。 */
export function ContactCta() {
  const { contact } = siteConfig;
  return (
    <section id="contact" className="scroll-mt-20 bg-slate-900">
      {/* 上部の装飾グラデーション */}
      <div className="bg-gradient-to-b from-brand/20 to-transparent">
        <Container className="py-20 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="text-white">
              <p className="text-sm font-bold uppercase tracking-wider text-brand-light">Contact</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                まずは無料で
                <br />
                ご相談ください
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-slate-300">
                「何から始めればいいか分からない」段階でも大丈夫です。現状とゴールを伺い、最適な進め方とお見積もりをご提案します。無理な営業は一切いたしません。
              </p>

              <ul className="mt-8 space-y-3">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-slate-200">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-white">
                      <Icon name="check" className="size-4" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-10 space-y-4 border-t border-white/10 pt-8">
                <a
                  href={`tel:${contact.telephone}`}
                  className="flex items-center gap-3 text-slate-200 transition-colors hover:text-white"
                >
                  <span className="grid size-10 place-items-center rounded-lg bg-white/10 ring-1 ring-white/15">
                    <Icon name="phone" className="size-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-slate-400">お電話でのご相談</span>
                    <span className="block text-lg font-bold">{contact.telephoneDisplay}</span>
                    <span className="block text-xs text-slate-400">{contact.openingHoursDisplay}</span>
                  </span>
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 text-slate-200 transition-colors hover:text-white"
                >
                  <span className="grid size-10 place-items-center rounded-lg bg-white/10 ring-1 ring-white/15">
                    <Icon name="mail" className="size-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-slate-400">メールでのご相談</span>
                    <span className="block text-lg font-bold">{contact.email}</span>
                  </span>
                </a>
              </div>
            </div>

            <div className="relative">
              <ContactForm />
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
