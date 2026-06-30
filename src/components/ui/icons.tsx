import type { SVGProps } from "react";

/** サービス・強みカードなどで使うアイコンのキー */
export type IconKey =
  | "layout"
  | "target"
  | "cart"
  | "code"
  | "refresh"
  | "search"
  | "gauge"
  | "palette"
  | "shield"
  | "headset"
  | "rocket"
  | "chart"
  | "check"
  | "arrowRight"
  | "phone"
  | "mail"
  | "pin"
  | "clock"
  | "sparkles";

const base: SVGProps<SVGSVGElement> = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const iconMap: Record<IconKey, (props: SVGProps<SVGSVGElement>) => React.ReactElement> = {
  layout: (p) => (
    <svg {...base} {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  ),
  target: (p) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  ),
  cart: (p) => (
    <svg {...base} {...p}>
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M2 3h3l2.4 12.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L22 7H6" />
    </svg>
  ),
  code: (p) => (
    <svg {...base} {...p}>
      <path d="m8 18-6-6 6-6M16 6l6 6-6 6" />
    </svg>
  ),
  refresh: (p) => (
    <svg {...base} {...p}>
      <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" />
    </svg>
  ),
  search: (p) => (
    <svg {...base} {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  gauge: (p) => (
    <svg {...base} {...p}>
      <path d="M12 14 8 9" />
      <path d="M3.5 18a9 9 0 1 1 17 0" />
      <circle cx="12" cy="14" r="1.5" />
    </svg>
  ),
  palette: (p) => (
    <svg {...base} {...p}>
      <path d="M12 3a9 9 0 1 0 0 18 2.5 2.5 0 0 0 2-4 2.5 2.5 0 0 1 2-4h1a4 4 0 0 0 4-4 9 9 0 0 0-9-6Z" />
      <circle cx="8" cy="11" r="1" />
      <circle cx="12" cy="8" r="1" />
      <circle cx="16" cy="11" r="1" />
    </svg>
  ),
  shield: (p) => (
    <svg {...base} {...p}>
      <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  headset: (p) => (
    <svg {...base} {...p}>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <path d="M4 13a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2ZM20 13a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z" />
      <path d="M20 19a4 4 0 0 1-4 3h-2" />
    </svg>
  ),
  rocket: (p) => (
    <svg {...base} {...p}>
      <path d="M5 13c-1.5 1.5-2 5-2 5s3.5-.5 5-2c.8-.8.8-2 0-3a2 2 0 0 0-3 0Z" />
      <path d="M14 6c2.5-2.5 6-2 6-2s.5 3.5-2 6l-7 7-4-4 7-7Z" />
      <circle cx="15" cy="9" r="1" />
    </svg>
  ),
  chart: (p) => (
    <svg {...base} {...p}>
      <path d="M3 3v18h18" />
      <path d="m7 14 3-4 3 2 4-6" />
    </svg>
  ),
  check: (p) => (
    <svg {...base} {...p}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  ),
  arrowRight: (p) => (
    <svg {...base} {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  phone: (p) => (
    <svg {...base} {...p}>
      <path d="M4 4h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 6 2 2 0 0 1 4 4Z" />
    </svg>
  ),
  mail: (p) => (
    <svg {...base} {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  pin: (p) => (
    <svg {...base} {...p}>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  clock: (p) => (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  sparkles: (p) => (
    <svg {...base} {...p}>
      <path d="M12 4l1.7 4.6L18 10l-4.3 1.4L12 16l-1.7-4.6L6 10l4.3-1.4L12 4Z" />
      <path d="M18.5 14l.8 2.1 2 .7-2 .8-.8 2-.8-2-2-.8 2-.7.8-2.1Z" />
    </svg>
  ),
};

export function Icon({
  name,
  className,
  ...props
}: { name: IconKey; className?: string } & SVGProps<SVGSVGElement>) {
  const Cmp = iconMap[name];
  return <Cmp className={className} {...props} />;
}
