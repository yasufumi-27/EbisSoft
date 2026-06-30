"use client";

import { useActionState, useId } from "react";
import { Button } from "@/components/ui/Button";
import { submitContact } from "@/app/actions";
import { initialContactState } from "@/app/contact-state";

const fieldBase =
  "mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-2 focus:outline-offset-1 focus:outline-brand";

/** お問い合わせフォーム（Server Action 連携）。 */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, initialContactState);
  const uid = useId();

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="flex h-full min-h-72 flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-xl"
      >
        <span className="grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 12 5 5L20 7" />
          </svg>
        </span>
        <h3 className="mt-4 text-lg font-bold text-slate-900">送信が完了しました</h3>
        <p className="mt-2 text-sm text-slate-600">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-2xl bg-white p-6 shadow-xl sm:p-8" noValidate>
      {state.status === "error" && state.message ? (
        <p role="alert" className="mb-5 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {state.message}
        </p>
      ) : null}

      <div className="space-y-5">
        <div>
          <label htmlFor={`${uid}-name`} className="text-sm font-semibold text-slate-800">
            お名前 <span className="text-rose-500">*</span>
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={Boolean(state.errors?.name)}
            aria-describedby={state.errors?.name ? `${uid}-name-error` : undefined}
            className={fieldBase}
            placeholder="山田 太郎"
          />
          {state.errors?.name ? (
            <p id={`${uid}-name-error`} className="mt-1 text-xs text-rose-600">
              {state.errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${uid}-email`} className="text-sm font-semibold text-slate-800">
            メールアドレス <span className="text-rose-500">*</span>
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(state.errors?.email)}
            aria-describedby={state.errors?.email ? `${uid}-email-error` : undefined}
            className={fieldBase}
            placeholder="you@example.com"
          />
          {state.errors?.email ? (
            <p id={`${uid}-email-error`} className="mt-1 text-xs text-rose-600">
              {state.errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${uid}-message`} className="text-sm font-semibold text-slate-800">
            お問い合わせ内容 <span className="text-rose-500">*</span>
          </label>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={4}
            required
            aria-invalid={Boolean(state.errors?.message)}
            aria-describedby={state.errors?.message ? `${uid}-message-error` : undefined}
            className={fieldBase}
            placeholder="制作のご相談内容・ご予算・希望納期などをご記入ください。"
          />
          {state.errors?.message ? (
            <p id={`${uid}-message-error`} className="mt-1 text-xs text-rose-600">
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
