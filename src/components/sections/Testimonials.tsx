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
          className="text-amber-400"
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
        <div className="inline-flex items-center gap-3 rounded-full bg-amber-50 px-5 py-2 ring-1 ring-amber-200">
          <Stars rating={5} />
          <span className="text-sm font-semibold text-slate-700">
            総合評価 {aggregateRating.ratingValue} / 5（{aggregateRating.reviewCount}件）
          </span>
        </div>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.author}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7"
          >
            <Stars rating={t.rating} />
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
              「{t.quote}」
            </blockquote>
            <figcaption className="mt-6 border-t border-slate-100 pt-4">
              <span className="block font-bold text-slate-900">{t.author}</span>
              <span className="block text-sm text-slate-500">{t.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
