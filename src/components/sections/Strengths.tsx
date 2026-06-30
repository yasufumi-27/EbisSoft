import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/icons";
import { strengths } from "@/lib/content";

/** 選ばれる理由（強み）。 */
export function Strengths() {
  return (
    <Section id="strengths" bg="muted">
      <SectionHeading
        eyebrow="Why EbisSoft"
        title="「作って終わり」にしない理由"
        description="デザインの美しさはもちろん、ビジネスの成果にこだわります。EbisSoftが選ばれる4つの強みです。"
      />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {strengths.map((s) => (
          <div
            key={s.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg hover:shadow-slate-900/5"
          >
            <span className="grid size-12 place-items-center rounded-xl bg-brand-light text-brand">
              <Icon name={s.icon} className="size-6" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-slate-900">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
