import { Container } from "@/components/ui/Container";
import { keyFacts } from "@/lib/content";

/**
 * 「30秒でわかるEbisSoft」要点ブロック。
 * 結論ファーストの短文Q&Aで、AI・検索エンジンがそのまま引用しやすくしています（AEO / LLMO）。
 * 回答には .speakable を付与し、Speakable構造化データの対象にしています。
 */
export function KeyFacts() {
  return (
    <section className="scroll-mt-20 bg-white py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-slate-50 p-7 sm:p-9">
          <p className="text-sm font-bold uppercase tracking-wider text-brand">Summary / 要点</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            30秒でわかるEbisSoft
          </h2>
          <dl className="mt-6 space-y-5">
            {keyFacts.map((f) => (
              <div key={f.q} className="border-l-2 border-brand/40 pl-4">
                <dt className="font-semibold text-slate-900">{f.q}</dt>
                <dd className="speakable mt-1 text-slate-600">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
