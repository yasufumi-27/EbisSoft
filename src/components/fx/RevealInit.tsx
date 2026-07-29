"use client";

import { useEffect } from "react";

/**
 * スクロールリビールの起動役。
 * ページ内の [data-reveal] 要素を IntersectionObserver で監視し、
 * ビューポートに入ったら data-revealed 属性を付与する（演出本体は globals.css）。
 * サーバーHTMLには全文が含まれるため、SEO/AEO/LLMOへの影響はない。
 *
 * ※ class ではなく属性で状態を持たせている理由：
 *   className を動的に切り替える要素（例：選択中のカード）が再レンダリングされると、
 *   Reactが className を丸ごと書き戻すため、JSで足したクラスは消えてしまう。
 *   Reactが管理していない data-* 属性なら再レンダリングでも保持される。
 *
 * また、クライアント側で後から追加された要素（デモの切り替え等）も拾えるよう、
 * MutationObserver で新しい [data-reveal] を監視対象に追加している。
 */
export function RevealInit() {
  useEffect(() => {
    const reveal = (el: Element) => el.setAttribute("data-revealed", "");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-reveal]").forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    const observeAll = (root: ParentNode) => {
      root.querySelectorAll("[data-reveal]:not([data-revealed])").forEach((el) => {
        observer.observe(el);
      });
    };
    observeAll(document);

    // 動的に描画された要素（デモの切り替えなど）も監視対象に加える
    const mutations = new MutationObserver(() => observeAll(document));
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return null;
}
