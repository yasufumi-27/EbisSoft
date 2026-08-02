"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 「いま読んでいるセクション」を返す共通フック（ページ内メニューと右端のドットナビで共用）。
 *
 * 以前は IntersectionObserver の intersectionRatio（見えている面積の割合）で選んでいましたが、
 * 割合はセクション自身の高さに対する比なので、背の低いセクションほど有利になります。
 * さらに、アンカー移動後の位置（scroll-margin-top）と判定帯の上端がちょうど重なるため、
 * 画面の高さによって「1つ前のセクション」が選ばれる、という不安定さがありました。
 *
 * ここでは面積を使わず、「読み始めの線（＝固定ヘッダーの下端）を最後に越えたセクション」を
 * 現在地とします。人が読んでいる位置と一致し、画面サイズにも左右されません。
 *
 * - 監視は passive なスクロールイベント＋requestAnimationFrame（1フレームに1回だけ計算）。
 * - メニューをクリックした直後は、自動スクロールが終わるまで判定を止めます
 *   （通過するセクションで表示がちらつかないように）。
 */

/**
 * 各セクションの「読み始めの線」（画面上端からの px）。
 *
 * アンカーで移動したときにそのセクションが止まる位置＝ CSS の scroll-margin-top です。
 * 同じ値を判定にも使うことで、「クリックで移動したのに、別の節が光る」ずれをなくします。
 * 指定が無いページのために、固定ヘッダー類の高さを控えとして使います。
 */
function lineFor(el: HTMLElement) {
  const specified = parseFloat(getComputedStyle(el).scrollMarginTop);
  if (specified > 0) return specified;
  const headerH = document.querySelector<HTMLElement>("header")?.offsetHeight ?? 64;
  const navH = document.querySelector<HTMLElement>(".pagenav")?.offsetHeight ?? 0;
  return headerH + navH;
}

/** 判定の遊び（px）。ちょうど境界のときに現在地が揺れないようにする。 */
const SLACK = 8;

export function useSectionSpy(items: { id: string; label: string }[]) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  /** クリック直後の自動スクロール中は判定を止める（止めている間の目標id） */
  const lockedTo = useRef<string | null>(null);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** メニューをクリックしたときに呼ぶ：即座にそのセクションを現在地にし、判定を一時停止する。 */
  const lockTo = useCallback((id: string) => {
    lockedTo.current = id;
    setActive(id);
    if (lockTimer.current) clearTimeout(lockTimer.current);
    // 自動スクロールが長引いても、いつかは必ず判定を再開する
    lockTimer.current = setTimeout(() => {
      lockedTo.current = null;
    }, 1600);
  }, []);

  useEffect(() => {
    const targets = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    let frame = 0;
    // 線の位置はレイアウトが変わらない限り一定なので、毎フレーム計算し直さない
    let lines = targets.map(lineFor);

    const measure = () => {
      frame = 0;

      // 目標セクションが線の位置まで来たら、クリックによる一時停止を解除する
      if (lockedTo.current) {
        const index = targets.findIndex((el) => el.id === lockedTo.current);
        if (index >= 0 && Math.abs(targets[index].getBoundingClientRect().top - lines[index]) < 40) {
          lockedTo.current = null;
          if (lockTimer.current) clearTimeout(lockTimer.current);
        } else {
          return;
        }
      }

      // 線を越えた（＝上端が線より上にある）最後のセクションが現在地
      let current = targets[0].id;
      targets.forEach((el, i) => {
        if (el.getBoundingClientRect().top - lines[i] <= SLACK) current = el.id;
      });

      // ページ末尾まで来たときは、最後のセクションを必ず選ぶ
      // （最後の節が短いと線まで届かず、手前の節が選ばれたままになるため）
      const doc = document.documentElement;
      if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
        current = targets[targets.length - 1].id;
      }

      setActive((prev) => (prev === current ? prev : current));
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    const onResize = () => {
      lines = targets.map(lineFor);
      schedule();
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
    };
  }, [items]);

  useEffect(() => () => void (lockTimer.current && clearTimeout(lockTimer.current)), []);

  return { active, lockTo };
}
