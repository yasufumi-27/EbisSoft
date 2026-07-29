"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DemoStage } from "./DemoUi";
import { Icon } from "@/components/ui/icons";
import {
  CONFIDENCE_THRESHOLD,
  kbDocs,
  searchKb,
  suggestedQuestions,
  type SearchHit,
} from "@/lib/kb";

/** 知識ドキュメント数（表示用）。モジュール読み込み時に確定します。 */
const KB_DOC_COUNT = kbDocs.length;

type Message = {
  id: number;
  role: "user" | "bot";
  text: string;
  /** 回答の根拠として使った知識ドキュメント */
  sources?: SearchHit[];
  /** 表示中（1文字ずつ描画中）かどうか */
  streaming?: boolean;
  /** 知識源から答えられなかった場合 */
  unanswered?: boolean;
};

const GREETING =
  "こんにちは。EbisuSoftのサイト内AIアシスタントです。制作期間・料金・できること・会社情報などについてお答えします。下の質問例からも選べます。";

let messageId = 0;
const nextId = () => (messageId += 1);

/** 検索の実行時間を計測する（コンポーネント外に置き、レンダー純粋性を保つ） */
function measure<T>(fn: () => T): { value: T; ms: number } {
  const t0 = performance.now();
  const value = fn();
  return { value, ms: performance.now() - t0 };
}

/**
 * AIチャットボットのデモ。
 *
 * 実装：BM25による検索（RAGのRetrieval）→ 根拠つきで回答 → 閾値未満なら答えない。
 * 本番ではこの後段にLLMを接続して自然文を生成しますが、
 * 「根拠を示す」「知らないことは答えない」という設計はこのデモと同じです。
 */
export default function DemoChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: nextId(), role: "bot", text: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [lastHits, setLastHits] = useState<SearchHit[]>([]);
  const [lastQuery, setLastQuery] = useState("");
  const [latency, setLatency] = useState<number | null>(null);

  const logRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  // タイマーは必ず後片付けする（アンマウント後のsetState防止）
  useEffect(() => {
    const list = timers.current;
    return () => {
      list.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // 新しいメッセージが来たらチャット欄を末尾へ
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const later = (fn: () => void, ms: number) => {
    const t = window.setTimeout(fn, ms);
    timers.current.push(t);
  };

  /** 1文字ずつ表示して、生成AIのストリーミング応答を再現する */
  const streamAnswer = (id: number, full: string) => {
    let i = 0;
    const step = () => {
      i += Math.max(1, Math.round(full.length / 90));
      const slice = full.slice(0, i);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, text: slice, streaming: i < full.length } : m)),
      );
      if (i < full.length) later(step, 16);
    };
    step();
  };

  const ask = (question: string) => {
    const q = question.trim();
    if (!q || thinking) return;

    setInput("");
    setMessages((prev) => [...prev, { id: nextId(), role: "user", text: q }]);
    setThinking(true);
    setLastQuery(q);

    // 検索の実行時間を計測（ブラウザ内で完結するため通常1ms未満）
    const { value: hits, ms } = measure(() => searchKb(q, 3));
    setLatency(Math.max(ms, 0.01));
    setLastHits(hits);

    const top = hits[0];
    const confident = !!top && top.score >= CONFIDENCE_THRESHOLD;

    // 検索〜生成の待ち時間を再現（実際のLLM応答は数百ms〜数秒）
    later(() => {
      setThinking(false);
      const id = nextId();
      if (confident) {
        setMessages((prev) => [
          ...prev,
          { id, role: "bot", text: "", sources: hits, streaming: true },
        ]);
        streamAnswer(id, top.doc.answer);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id,
            role: "bot",
            text: "",
            sources: hits.length ? hits : undefined,
            streaming: true,
            unanswered: true,
          },
        ]);
        streamAnswer(
          id,
          "申し訳ありません。その質問に確実にお答えできる情報が知識源に見つかりませんでした。憶測でお答えするより、担当者から正確にご回答します。お問い合わせフォームからご連絡ください（初回相談は無料です）。",
        );
      }
    }, 480);
  };

  const reset = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setMessages([{ id: nextId(), role: "bot", text: GREETING }]);
    setLastHits([]);
    setLastQuery("");
    setLatency(null);
    setThinking(false);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      {/* ---------------- チャット本体 ---------------- */}
      <DemoStage
        className="lg:col-span-3"
        label="EbisuSoft.AI_Assistant"
        status={thinking ? "THINKING…" : "ONLINE"}
      >
        <div
          ref={logRef}
          className="h-[380px] space-y-4 overflow-y-auto p-5 sm:h-[440px]"
          role="log"
          aria-live="polite"
          aria-label="チャットの履歴"
        >
          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-brand/20 px-4 py-2.5 text-sm leading-relaxed text-white ring-1 ring-brand/30">
                  {m.text}
                </p>
              </div>
            ) : (
              <div key={m.id} className="flex gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-brand/30 bg-brand/10 text-brand-light">
                  <Icon name="sparkles" className="size-4" />
                </span>
                <div className="max-w-[88%]">
                  <div
                    className={`rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ring-1 ${
                      m.unanswered
                        ? "bg-amber-400/10 text-amber-100 ring-amber-400/25"
                        : "bg-white/[0.06] text-slate-200 ring-white/10"
                    }`}
                  >
                    {m.text}
                    {m.streaming ? (
                      <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse bg-brand" />
                    ) : null}
                  </div>

                  {/* 回答の根拠（RAGの肝：どの情報を使ったかを開示する） */}
                  {m.sources && !m.streaming && !m.unanswered ? (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="font-display text-[10px] tracking-[0.2em] text-slate-500 uppercase">
                        Source
                      </span>
                      {m.sources.slice(0, 2).map((h) =>
                        h.doc.href ? (
                          <Link
                            key={h.doc.id}
                            href={h.doc.href}
                            className="rounded-md border border-gold/30 bg-gold/10 px-2 py-0.5 text-[11px] text-gold-light transition-colors hover:bg-gold/20"
                          >
                            {h.doc.source}
                          </Link>
                        ) : (
                          <span
                            key={h.doc.id}
                            className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-400"
                          >
                            {h.doc.source}
                          </span>
                        ),
                      )}
                    </div>
                  ) : null}

                  {m.unanswered && !m.streaming ? (
                    <Link
                      href="/contact"
                      className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-brand/40 bg-brand/10 px-3 py-1 text-[11px] font-semibold text-brand-light transition-colors hover:bg-brand/20"
                    >
                      お問い合わせフォームへ
                      <Icon name="arrowRight" className="size-3" />
                    </Link>
                  ) : null}
                </div>
              </div>
            ),
          )}

          {thinking ? (
            <div className="flex gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-brand/30 bg-brand/10 text-brand-light">
                <Icon name="sparkles" className="size-4" />
              </span>
              <span className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white/[0.06] px-4 py-3 ring-1 ring-white/10">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-1.5 animate-bounce rounded-full bg-brand"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </span>
            </div>
          ) : null}
        </div>

        {/* 質問例 */}
        <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-3">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => ask(q)}
              disabled={thinking}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-400 transition-colors hover:border-brand/40 hover:text-brand-light disabled:opacity-40"
            >
              {q}
            </button>
          ))}
        </div>

        {/* 入力欄 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex items-center gap-2 border-t border-white/10 p-3"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="質問を入力してください（例：料金はいくら？）"
            aria-label="質問を入力"
            className="field !mt-0 flex-1"
          />
          <button
            type="submit"
            disabled={thinking || !input.trim()}
            className="grid size-11 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand to-accent text-ink transition-opacity disabled:opacity-40"
            aria-label="送信"
          >
            <Icon name="arrowRight" className="size-5" />
          </button>
          <button
            type="button"
            onClick={reset}
            className="grid size-11 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:text-white"
            aria-label="会話をリセット"
          >
            <Icon name="refresh" className="size-4" />
          </button>
        </form>
      </DemoStage>

      {/* ---------------- 検索プロセスの可視化 ---------------- */}
      <div className="panel space-y-4 p-5 lg:col-span-2">
        <div>
          <p className="font-display text-[10px] font-bold tracking-[0.25em] text-slate-500 uppercase">
            Retrieval / 検索プロセス
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            AIが「どの情報を根拠に答えたか」をリアルタイムで表示しています。RAG構成では、この検索結果だけを材料にして回答を生成するため、知識源にないことは答えられません。
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/5 text-center">
          <div className="bg-ink-2/80 px-3 py-3">
            <dt className="text-[10px] text-slate-500">知識ドキュメント</dt>
            <dd className="font-display mt-1 text-lg font-bold text-brand-light">
              {KB_DOC_COUNT}
            </dd>
          </div>
          <div className="bg-ink-2/80 px-3 py-3">
            <dt className="text-[10px] text-slate-500">検索時間</dt>
            <dd className="font-display mt-1 text-lg font-bold text-brand-light">
              {latency === null ? "—" : `${latency.toFixed(2)}ms`}
            </dd>
          </div>
        </dl>

        {lastQuery ? (
          <div>
            <p className="text-[11px] text-slate-500">
              クエリ：<span className="text-slate-300">{lastQuery}</span>
            </p>
            <ul className="mt-3 space-y-3">
              {lastHits.length === 0 ? (
                <li className="text-xs text-amber-200/80">
                  一致する知識ドキュメントが見つかりませんでした。
                </li>
              ) : (
                lastHits.map((h, i) => (
                  <li key={h.doc.id}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-xs text-slate-300">
                        <span className="font-display mr-1.5 text-[10px] text-slate-600">
                          #{i + 1}
                        </span>
                        {h.doc.source}
                      </span>
                      <span className="font-display shrink-0 text-[10px] text-brand-light tabular-nums">
                        {h.score.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          i === 0 && h.score >= CONFIDENCE_THRESHOLD
                            ? "bg-gradient-to-r from-brand to-accent"
                            : "bg-white/25"
                        }`}
                        style={{ width: `${Math.round(h.relevance * 100)}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[10px] text-slate-600">{h.doc.category}</p>
                  </li>
                ))
              )}
            </ul>
            <p className="mt-4 border-t border-white/10 pt-3 text-[11px] text-slate-500">
              しきい値 <span className="text-slate-300">{CONFIDENCE_THRESHOLD}</span> 未満のときは
              回答せず、問い合わせへ誘導します（誤答の抑制）。
            </p>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-slate-500">
            質問を送ると、ここに検索結果とスコアが表示されます。
          </p>
        )}
      </div>
    </div>
  );
}
