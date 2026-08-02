"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ページ内メニュー（スクロールしても画面上部に残る横並びナビ）。
 *
 * ヘッダー（h-16 / sticky top-0）のすぐ下に貼り付き、いま読んでいる節を光らせます。
 * 右端のドットナビ（fx/SectionNav）は広い画面の装飾ですが、こちらは
 * 端末を問わず常に見える主要導線として使います。
 *
 * - 実体は <a href="#id"> なので、JavaScriptが動かない環境でもリンクとして機能します。
 * - 現在地の判定は IntersectionObserver（スクロールイベントを使わない＝軽い）。
 * - 背景に backdrop-filter は使いません（動く3D背景の上ではスクロールが重くなるため）。
 */
export function PageNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const listRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const targets = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      // ヘッダー＋このナビの高さ（約136px）を除いた領域で判定する
      // （rootMargin は px か % しか受け付けない。rem を渡すと例外になる）
      { rootMargin: "-136px 0px -55% 0px", threshold: [0, 0.15, 0.5, 1] },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  /* 狭い画面ではメニューが横スクロールになるため、現在地が画面外に出ないよう寄せる。
     ページ自体は動かさないよう、要素の scrollLeft だけを変える。 */
  useEffect(() => {
    const list = listRef.current;
    const current = list?.querySelector<HTMLElement>("[data-current]");
    if (!list || !current) return;
    if (list.scrollWidth <= list.clientWidth) return;
    const left = current.offsetLeft - list.clientWidth / 2 + current.offsetWidth / 2;
    list.scrollTo({
      left,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [active]);

  return (
    <div className="pagenav">
      <nav
        ref={listRef}
        className="gutter-x mx-auto flex w-full max-w-6xl items-center gap-1 overflow-x-auto py-2"
        aria-label="ページ内メニュー"
      >
        <span aria-hidden className="pagenav-mark" />
        {items.map((i) => (
          <a
            key={i.id}
            href={`#${i.id}`}
            className="pagenav-item"
            data-current={active === i.id ? "" : undefined}
            aria-current={active === i.id ? "true" : undefined}
          >
            {i.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
