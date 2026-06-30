import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "@/components/ui/icons";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-sm shadow-brand/30 hover:bg-brand-dark focus-visible:outline-brand",
  secondary:
    "bg-white text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:outline-slate-400",
  ghost: "bg-white/10 text-white ring-1 ring-inset ring-white/30 hover:bg-white/20",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:pointer-events-none";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  children: ReactNode;
  className?: string;
};

/** リンクとして使う CTA ボタン（next/link）。 */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  withArrow = false,
  children,
  className = "",
  ...props
}: CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link
      href={href}
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
      {withArrow ? <Icon name="arrowRight" className="size-4" /> : null}
    </Link>
  );
}

/** フォーム送信などに使う通常のボタン。 */
export function Button({
  variant = "primary",
  size = "md",
  withArrow = false,
  children,
  className = "",
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
      {withArrow ? <Icon name="arrowRight" className="size-4" /> : null}
    </button>
  );
}
