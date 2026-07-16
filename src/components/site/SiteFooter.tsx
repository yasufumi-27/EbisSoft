import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { nav } from "@/lib/content";
import { Logo } from "@/components/site/Logo";
import { Icon } from "@/components/ui/icons";

const year = new Date().getFullYear();

/** サイト共通フッター。NAP（社名/住所/電話）を明記しローカルSEOに対応。 */
export function SiteFooter() {
  const { contact } = siteConfig;

  return (
    <footer className="relative border-t border-white/5 bg-ink-2/80 text-slate-300 backdrop-blur-md">
      {/* 上辺の発光ライン */}
      <div aria-hidden className="divider-glow absolute inset-x-0 top-0" />

      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* ブランド */}
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              {siteConfig.legalName}は、成果から逆算するWeb制作会社です。集客・採用・売上につながるホームページ制作を、設計から運用までワンストップでご支援します。
            </p>
            <ul className="mt-6 flex gap-3">
              {siteConfig.sameAs.map((url) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-9 place-items-center rounded-lg bg-white/5 text-slate-300 ring-1 ring-white/10 transition-all hover:bg-brand/15 hover:text-brand-light hover:ring-brand/50 hover:shadow-[0_0_16px_rgba(34,211,238,0.35)]"
                    aria-label={`${siteConfig.name}の外部プロフィール`}
                  >
                    <Icon name="arrowRight" className="size-4 -rotate-45" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* サイトメニュー */}
          <nav className="lg:col-span-3" aria-label="フッターナビゲーション">
            <h2 className="font-display text-xs font-bold tracking-[0.3em] text-brand uppercase">
              Menu
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-400 transition-colors hover:text-brand-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="#contact" className="text-slate-400 transition-colors hover:text-brand-light">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </nav>

          {/* 会社情報・NAP */}
          <div className="lg:col-span-4">
            <h2 className="font-display text-xs font-bold tracking-[0.3em] text-brand uppercase">
              Company
            </h2>
            <address className="mt-4 space-y-3 text-sm text-slate-400 not-italic">
              <p className="font-medium text-slate-200">{siteConfig.legalName}</p>
              <p className="flex items-start gap-2.5">
                <Icon name="pin" className="mt-0.5 size-4 shrink-0 text-gold" />
                <span>
                  〒{contact.address.postalCode}
                  <br />
                  {contact.address.region}
                  {contact.address.locality}
                  {contact.address.street}
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Icon name="phone" className="size-4 shrink-0 text-gold" />
                <a href={`tel:${contact.telephone}`} className="transition-colors hover:text-white">
                  {contact.telephoneDisplay}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Icon name="mail" className="size-4 shrink-0 text-gold" />
                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-white">
                  {contact.email}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Icon name="clock" className="size-4 shrink-0 text-gold" />
                <span>{contact.openingHoursDisplay}</span>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-slate-500 sm:flex-row">
          <p className="font-display tracking-widest">
            © {year} {siteConfig.legalName}
          </p>
          <ul className="flex gap-6">
            {/* TODO: プライバシーポリシー・特商法ページを作成したらリンク先を差し替え */}
            <li>
              <Link href="#" className="transition-colors hover:text-slate-300">
                プライバシーポリシー
              </Link>
            </li>
            <li>
              <Link href="#" className="transition-colors hover:text-slate-300">
                会社概要
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
