"use client";

import { useEffect } from "react";

/**
 * スクロールリビールの起動役。
 * ページ内の [data-reveal] 要素を IntersectionObserver で監視し、
 * ビューポートに入ったら .is-revealed を付与する（演出本体は globals.css）。
 * サーバーHTMLには全文が含まれるため、SEO/AEO/LLMOへの影響はない。
 */
export function RevealInit() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (targets.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
