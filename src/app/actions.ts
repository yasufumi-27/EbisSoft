"use server";

import type { ContactState } from "./contact-state";

/**
 * お問い合わせフォームのサーバーアクション。
 * 現状はバリデーションと擬似処理のみです。
 * 本番では下部の TODO 部分にメール送信（Resend / SendGrid 等）や
 * CRM 登録などの実処理を実装してください。
 */

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // ハニーポット（人間には見えない項目）に入力があればボットとみなし、静かに成功扱い
  const honeypot = String(formData.get("company_url") ?? "");
  if (honeypot) return { status: "success" };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const errors: ContactState["errors"] = {};
  if (!name) errors.name = "お名前を入力してください。";
  if (!EMAIL_RE.test(email)) errors.email = "正しいメールアドレスを入力してください。";
  if (message.length < 10) errors.message = "お問い合わせ内容を10文字以上でご入力ください。";

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "入力内容をご確認ください。", errors };
  }

  // ── TODO: 実際の送信処理をここに実装 ───────────────────────────
  // 例) await sendEmail({ to: siteConfig.contact.email, name, email, message });
  //     await saveToCrm({ name, email, message });
  await new Promise((resolve) => setTimeout(resolve, 400)); // 疑似的な送信待ち
  // ─────────────────────────────────────────────────────────────

  return {
    status: "success",
    message: "送信ありがとうございます。担当者より2営業日以内にご連絡いたします。",
  };
}
