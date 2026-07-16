"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * サイト全体の3D背景（Three.js）。
 * - 奥行きのあるパーティクル星野（シアン／バイオレット／ゴールド）
 * - ゆっくり回転するワイヤーフレームの多面体（二重構造）
 * - 床のグリッド（Tron風の遠近感）＋フォグ
 * - マウス追従のパララックス
 *
 * パフォーマンス配慮：
 * - devicePixelRatio を最大2に制限
 * - タブ非表示時はレンダリングを停止
 * - prefers-reduced-motion では静止画を1フレームだけ描画
 */
export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070f, 0.028);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      120
    );
    camera.position.set(0, 1.2, 16);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // 背景色はCSS側（--color-ink）に任せる
    mount.appendChild(renderer.domElement);

    // ---- パーティクル星野 -------------------------------------------------
    const COUNT = 1600;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const palette = [
      new THREE.Color(0x22d3ee), // シアン
      new THREE.Color(0x8b5cf6), // バイオレット
      new THREE.Color(0xe2c078), // ゴールド
      new THREE.Color(0x60a5fa), // ブルー
    ];
    for (let i = 0; i < COUNT; i++) {
      // 中心をやや避けたドーナツ状の分布で、テキスト背後の密度を下げる
      const r = 10 + Math.random() * 34;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 30;
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * r - 10;
      // ゴールドは少数精鋭（1割）で上品に
      const nonGold = [palette[0], palette[1], palette[3]];
      const c = Math.random() < 0.1 ? palette[2] : nonGold[Math.floor(Math.random() * 3)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ---- ワイヤーフレーム多面体（二重・逆回転） ---------------------------
    const core = new THREE.Group();
    const outerGeo = new THREE.IcosahedronGeometry(5.2, 1);
    const outer = new THREE.LineSegments(
      new THREE.WireframeGeometry(outerGeo),
      new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.16 })
    );
    const innerGeo = new THREE.IcosahedronGeometry(3.1, 0);
    const inner = new THREE.LineSegments(
      new THREE.WireframeGeometry(innerGeo),
      new THREE.LineBasicMaterial({ color: 0xe2c078, transparent: true, opacity: 0.14 })
    );
    core.add(outer, inner);
    core.position.set(9, 2.5, -6);
    scene.add(core);

    // ---- 床グリッド（遠近感の演出。フォグで水平線に溶ける） ---------------
    const grid = new THREE.GridHelper(160, 64, 0x155e75, 0x0f2942);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.5;
    grid.position.y = -7.5;
    scene.add(grid);

    // ---- インタラクション・ループ -----------------------------------------
    const mouse = { x: 0, y: 0 };
    const onPointerMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const clock = new THREE.Clock();
    let rafId = 0;
    let running = true;

    const renderFrame = () => {
      const t = clock.getElapsedTime();
      // スクロールに連動して星野が回り、多面体が沈む（スクロール駆動の奥行き演出）
      const sy = window.scrollY;
      stars.rotation.y = t * 0.014 + sy * 0.00012;
      core.rotation.y = t * 0.12 + sy * 0.0005;
      core.rotation.x = Math.sin(t * 0.18) * 0.25;
      inner.rotation.y = -t * 0.3;
      core.position.y = 2.5 + Math.sin(t * 0.5) * 0.5 - Math.min(sy * 0.0012, 4);
      // マウスに緩やかに追従するパララックス
      camera.position.x += (mouse.x * 1.6 - camera.position.x) * 0.03;
      camera.position.y += (1.2 - mouse.y * 1.0 - camera.position.y) * 0.03;
      camera.lookAt(0, 0.5, 0);
      renderer.render(scene, camera);
    };

    const loop = () => {
      if (!running) return;
      renderFrame();
      rafId = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      const visible = document.visibilityState === "visible";
      if (visible && !running && !prefersReducedMotion) {
        running = true;
        clock.start();
        loop();
      } else if (!visible && running) {
        running = false;
        cancelAnimationFrame(rafId);
      }
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    if (prefersReducedMotion) {
      running = false;
      renderFrame(); // 静止した1フレームのみ描画
    } else {
      window.addEventListener("pointermove", onPointerMove);
      loop();
    }

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      starGeo.dispose();
      starMat.dispose();
      outerGeo.dispose();
      innerGeo.dispose();
      outer.geometry.dispose();
      (outer.material as THREE.Material).dispose();
      inner.geometry.dispose();
      (inner.material as THREE.Material).dispose();
      grid.geometry.dispose();
      (grid.material as THREE.Material).dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />
  );
}
