import { Section, SectionHeading } from "@/components/ui/Section";
import { testimonials, aggregateRating } from "@/lib/content";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`5段階中${rating}の評価`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-gold drop-shadow-[0_0_6px_rgba(226,192,120,0.6)]"
          aria-hidden="true"
        >
          <path d="m12 2 3 6.5 7 .9-5 4.8 1.2 7L12 18l-6.4 3.2L6.8 14l-5-4.8 7-.9L12 2Z" />
        </svg>
      ))}
    </div>
  );
}

/** お客様の声。集計評価は構造化データ（AggregateRating）と同期。 */
export function Testimonials() {
  return (
    <Section>
      <div className="flex flex-col items-center gap-6 text-center">
        <SectionHeading
          eyebrow="Voice"
          title="お客様の声"
          description="制作後の成果や、伴走したプロセスについて多くの評価をいただいています。（サンプル）"
        />
        <div
          className="inline-flex items-center gap-3 rounded-full border border-gold/40 bg-gold/10 px-5 py-2 backdrop-blur"
          data-reveal
        >
          <Stars rating={5} />
          <span className="text-sm font-semibold text-gold-light">
            総合評価 {aggregateRating.ratingValue} / 5（{aggregateRating.reviewCount}件）
          </span>
        </div>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <figure
            key={t.author}
            className="panel panel-hover flex flex-col p-7"
            data-reveal
            style={{ "--reveal-delay": `${i * 0.1}s` } as React.CSSProperties}
          >
            <Stars rating={t.rating} />
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">
              「{t.quote}」
            </blockquote>
            <figcaption className="mt-6 border-t border-white/10 pt-4">
              <span className="block font-bold text-white">{t.author}</span>
              <span className="block text-sm text-slate-500">{t.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
