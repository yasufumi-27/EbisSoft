import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/icons";
import { strengths } from "@/lib/content";

/** 選ばれる理由（強み）。 */
export function Strengths() {
  return (
    <Section id="strengths">
      <SectionHeading
        eyebrow="Why エビスソフト"
        title="速い。強い。そして、確かめられる。"
        description="AIを使いこなす制作体制と、AIそのものを作る技術力。エビスソフトが選ばれる4つの理由です。"
      />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {strengths.map((s, i) => (
          <div
            key={s.title}
            className="panel panel-hover panel-corners p-6"
            data-reveal
            style={{ "--reveal-delay": `${i * 0.1}s` } as React.CSSProperties}
          >
            <span className="grid size-12 place-items-center rounded-xl border border-brand/30 bg-brand/10 text-brand-light shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <Icon name={s.icon} className="size-6" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-white">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
