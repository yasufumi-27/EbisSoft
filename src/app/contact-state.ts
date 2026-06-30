/**
 * お問い合わせフォームの状態型と初期値。
 * "use server" ファイルは async 関数しか export できないため、
 * 型・定数はこの通常モジュールに分離しています。
 */
export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "message", string>>;
};

export const initialContactState: ContactState = { status: "idle" };
