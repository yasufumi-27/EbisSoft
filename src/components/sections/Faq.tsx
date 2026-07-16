import { Section, SectionHeading } from "@/components/ui/Section";
import { faqs } from "@/lib/content";

/**
 * よくある質問。JSなしの <details>/<summary> でアコーディオン化。
 * 表示内容は FAQ 構造化データ（faqJsonLd）と同じ content.ts から生成しています。
 */
export function Faq() {
  return (
    <Section id="faq">
      <SectionHeading
        eyebrow="FAQ"
        title="よくある質問"
        description="ご相談前によくいただく質問をまとめました。ここにない疑問もお気軽にお問い合わせください。"
      />
      <div className="panel mx-auto mt-12 max-w-3xl divide-y divide-white/10 overflow-hidden" data-reveal>
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group px-6 transition-colors open:bg-white/[0.03] [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold text-slate-100 transition-colors hover:text-brand-light">
              {faq.question}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="shrink-0 text-brand transition-transform duration-300 group-open:rotate-180"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <p className="speakable pb-5 text-sm leading-relaxed text-slate-400">{faq.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
