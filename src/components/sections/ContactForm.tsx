"use client";

import { useActionState, useId } from "react";
import { Button } from "@/components/ui/Button";
import { submitContact } from "@/app/actions";
import { initialContactState } from "@/app/contact-state";

// 見た目の本体は globals.css の .field（ダークガラス＋フォーカスでシアン発光）

/** お問い合わせフォーム（Server Action 連携）。 */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialContactState);
  const uid = useId();

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="panel panel-corners flex h-full min-h-72 flex-col items-center justify-center p-8 text-center"
      >
        <span className="grid size-14 place-items-center rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.35)]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 12 5 5L20 7" />
          </svg>
        </span>
        <h3 className="mt-4 text-lg font-bold text-white">送信が完了しました</h3>
        <p className="mt-2 text-sm text-slate-400">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="panel panel-corners p-6 sm:p-8" noValidate>
      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="mb-5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-300"
        >
          {state.message}
        </p>
      ) : null}

      <div className="space-y-5">
        <div>
          <label htmlFor={`${uid}-name`} className="text-sm font-semibold text-slate-200">
            お名前 <span className="text-gold">*</span>
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={Boolean(state.errors?.name)}
            aria-describedby={state.errors?.name ? `${uid}-name-error` : undefined}
            className="field"
            placeholder="山田 太郎"
          />
          {state.errors?.name ? (
            <p id={`${uid}-name-error`} className="mt-1 text-xs text-rose-400">
              {state.errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${uid}-email`} className="text-sm font-semibold text-slate-200">
            メールアドレス <span className="text-gold">*</span>
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(state.errors?.email)}
            aria-describedby={state.errors?.email ? `${uid}-email-error` : undefined}
            className="field"
            placeholder="you@example.com"
          />
          {state.errors?.email ? (
            <p id={`${uid}-email-error`} className="mt-1 text-xs text-rose-400">
              {state.errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${uid}-message`} className="text-sm font-semibold text-slate-200">
            お問い合わせ内容 <span className="text-gold">*</span>
          </label>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={4}
            required
            aria-invalid={Boolean(state.errors?.message)}
            aria-describedby={state.errors?.message ? `${uid}-message-error` : undefined}
            className="field"
            placeholder="制作のご相談内容・ご予算・希望納期などをご記入ください。"
          />
          {state.errors?.message ? (
            <p id={`${uid}-message-error`} className="mt-1 text-xs text-rose-400">
              {state.errors.message}
            </p>
          ) : null}
        </div>

        {/* ハニーポット（スパム対策・スクリーンリーダー/視覚から隠す） */}
        <div aria-hidden className="absolute -left-[9999px]" tabIndex={-1}>
          <label htmlFor={`${uid}-company-url`}>Company URL</label>
          <input id={`${uid}-company-url`} name="company_url" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <Button type="submit" size="lg" withArrow className="w-full" disabled={pending}>
          {pending ? "送信中…" : "この内容で送信する"}
        </Button>
        <p className="text-center text-xs text-slate-500">
          送信いただいた情報は、お問い合わせ対応の目的にのみ利用します。
        </p>
      </div>
    </form>
  );
}
