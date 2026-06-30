import { Section, SectionHeading } from "@/components/ui/Section";
import { steps } from "@/lib/content";

/** 制作の流れ。 */
export function Process() {
  return (
    <Section id="process" bg="muted">
      <SectionHeading
        eyebrow="Process"
        title="制作の流れ"
        description="ご相談から公開・運用まで。各ステップで丁寧にご確認いただきながら進めます。"
      />
      <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="relative rounded-2xl border border-slate-200 bg-white p-6"
          >
            <div className="flex items-center gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-violet-500 text-base font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
