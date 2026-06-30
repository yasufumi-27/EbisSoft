import type { ReactNode } from "react";

/** ページ共通の最大幅・左右余白を与えるラッパー。 */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8 ${className}`}>{children}</div>
  );
}
