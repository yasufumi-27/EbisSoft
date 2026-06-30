import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/icons";
import { plans } from "@/lib/content";

/** 料金プラン。 */
export function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeading
        eyebrow="Pricing"
        title="料金プラン"
        description="目的と規模に合わせて選べる3プラン。すべて税別・初期費用の目安です。詳細はお見積もりにてご提案します。"
      />
      <div className="mt-14 grid items-start gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const featured = plan.featured ?? false;
          return (
            <div
              key={plan.name}
              className={
                featured
                  ? "relative rounded-3xl bg-slate-900 p-8 text-white shadow-2xl shadow-slate-900/20 ring-2 ring-brand lg:-mt-4 lg:pb-12"
                  : "relative rounded-3xl border border-slate-200 bg-white p-8"
              }
            >
              {featured ? (
                <span className="absolute right-6 top-6 rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
                  人気No.1
                </span>
              ) : null}
              <h3 className={`text-lg font-bold ${featured ? "text-white" : "text-slate-900"}`}>
                {plan.name}
              </h3>
              <p className={`mt-1 text-sm ${featured ? "text-slate-300" : "text-slate-500"}`}>
                {plan.priceNote}
              </p>
              <p className="mt-5">
                <span
                  className={`text-3xl font-bold tracking-tight ${
                    featured ? "text-white" : "text-slate-900"
                  }`}
                >
                  {plan.price}
                </span>
              </p>
              <p className={`mt-3 text-sm leading-relaxed ${featured ? "text-slate-300" : "text-slate-600"}`}>
                {plan.description}
              </p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-start gap-2.5 text-sm ${
                      featured ? "text-slate-200" : "text-slate-700"
                    }`}
                  >
                    <Icon
                      name="check"
                      className={`mt-0.5 size-4 shrink-0 ${featured ? "text-brand-light" : "text-brand"}`}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <ButtonLink
                href="#contact"
                variant={featured ? "primary" : "secondary"}
                className="mt-8 w-full"
                withArrow
              >
                このプランで相談する
              </ButtonLink>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
