"use client";

import { useEffect, useState } from "react";

/**
 * 右端のセクションインジケーター（HUD風のドットナビ）。
 *
 * IntersectionObserver で「いま画面の中心にあるセクション」を判定し、
 * 現在位置を光らせます。クリックでそのセクションへ移動できます。
 * 幅の広い画面でのみ表示（CSS側のメディアクエリ）。
 *
 * 補助的なナビゲーションのため、ページ内リンク（<a href="#id">）で実装しています。
 * JavaScriptが動かない環境でも、リンクとしては機能します。
 */
export function SectionNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const targets = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 画面の中央帯に入っているもののうち、最も見えている面積が大きいセクションを採用
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      // 画面の上下を大きく削り、中央付近に来たセクションだけを対象にする
      { rootMargin: "-42% 0px -42% 0px", threshold: [0, 0.2, 1] },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="dotnav" aria-label="セクション">
      {items.map((i) => (
        <a
          key={i.id}
          href={`#${i.id}`}
          className="dotnav-item"
          data-current={active === i.id ? "" : undefined}
          aria-current={active === i.id ? "true" : undefined}
        >
          <span className="dotnav-label">{i.label}</span>
          <span className="sr-only">{i.label}へ移動</span>
        </a>
      ))}
    </nav>
  );
}
