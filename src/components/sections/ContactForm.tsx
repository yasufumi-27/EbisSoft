"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site";

// 見た目の本体は globals.css の .field（ダークガラス＋フォーカスでシアン発光）

type Errors = Partial<Record<"name" | "email" | "message", string>>;

/**
 * お問い合わせフォーム。
 * 静的書き出し（GitHub Pages）でも動くよう、クライアント側でバリデーションし、
 * 送信内容を添えてメールソフトを起動する（mailto）方式。
 * 実送信（Resend等のAPI連携）を実装する際は src/app/actions.ts の
 * Server Action 版に差し替える（output: "export" では不可）。
 */
export function ContactForm() {
  const uid = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // ハニーポット：ボットが埋めたら黙って成功扱い
    if (String(data.get("company_url") ?? "") !== "") {
      setDone(true);
      return;
    }

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = "お名前を入力してください。";
    if (!email) next.email = "メールアドレスを入力してください。";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "メールアドレスの形式が正しくありません。";
    }
    if (!message) next.message = "お問い合わせ内容を入力してください。";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const subject = `【お問い合わせ】${name} 様より`;
    const body = `お名前: ${name}\nメールアドレス: ${email}\n\n${message}`;
    window.location.href = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setDone(true);
  };

  if (done) {
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
        <h3 className="mt-4 text-lg font-bold text-white">メールソフトを起動しました</h3>
        <p className="mt-2 text-sm text-slate-400">
          入力内容を添えたメールが作成されます。そのまま送信してください。
          <br />
          起動しない場合は {siteConfig.contact.email} へ直接ご連絡ください。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="panel panel-corners p-6 sm:p-8" noValidate>
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
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${uid}-name-error` : undefined}
            className="field"
            placeholder="山田 太郎"
          />
          {errors.name ? (
            <p id={`${uid}-name-error`} className="mt-1 text-xs text-rose-400">
              {errors.name}
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
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${uid}-email-error` : undefined}
            className="field"
            placeholder="you@example.com"
          />
          {errors.email ? (
            <p id={`${uid}-email-error`} className="mt-1 text-xs text-rose-400">
              {errors.email}
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
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? `${uid}-message-error` : undefined}
            className="field"
            placeholder="制作のご相談内容・ご予算・希望納期などをご記入ください。"
          />
          {errors.message ? (
            <p id={`${uid}-message-error`} className="mt-1 text-xs text-rose-400">
              {errors.message}
            </p>
          ) : null}
        </div>

        {/* ハニーポット（スパム対策・スクリーンリーダー/視覚から隠す） */}
        <div aria-hidden className="absolute -left-[9999px]" tabIndex={-1}>
          <label htmlFor={`${uid}-company-url`}>Company URL</label>
          <input id={`${uid}-company-url`} name="company_url" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <Button type="submit" size="lg" withArrow className="w-full">
          この内容で送信する
        </Button>
        <p className="text-center text-xs text-slate-500">
          送信いただいた情報は、お問い合わせ対応の目的にのみ利用します。
        </p>
      </div>
    </form>
  );
}
