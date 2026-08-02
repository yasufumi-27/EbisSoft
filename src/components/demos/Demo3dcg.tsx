"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { ChipButton, ControlGroup, DemoStage, RangeControl, SwitchButton } from "./DemoUi";
import { createLogo3d, LOGO_BLUE, type Logo3d } from "@/components/fx/logo3d";

/* ------------------------------------------------------------------
 * 選択肢の定義
 * ---------------------------------------------------------------- */

type ShapeKey = "knot" | "icosa" | "box" | "sphere" | "torus" | "logo";
type PrimitiveKey = Exclude<ShapeKey, "logo">;
type MaterialKey = "metal" | "glass" | "matte" | "wire";

const SHAPES: { key: ShapeKey; label: string }[] = [
  { key: "logo", label: "会社ロゴ" },
  { key: "knot", label: "トーラスノット" },
  { key: "icosa", label: "多面体" },
  { key: "box", label: "キューブ" },
  { key: "sphere", label: "球" },
  { key: "torus", label: "トーラス" },
];

const MATERIALS: { key: MaterialKey; label: string }[] = [
  { key: "metal", label: "メタル" },
  { key: "glass", label: "ガラス" },
  { key: "matte", label: "マット" },
  { key: "wire", label: "ワイヤー" },
];

/** 既定のカラー（基本形状のとき） */
const CYAN = "#22d3ee";

const COLORS = [
  { hex: LOGO_BLUE, label: "ロゴブルー" },
  { hex: CYAN, label: "シアン" },
  { hex: "#8b5cf6", label: "バイオレット" },
  { hex: "#e2c078", label: "ゴールド" },
  { hex: "#f43f5e", label: "ルビー" },
  { hex: "#f1f5f9", label: "プラチナ" },
];

function createGeometry(shape: PrimitiveKey): THREE.BufferGeometry {
  switch (shape) {
    case "knot":
      return new THREE.TorusKnotGeometry(1.05, 0.36, 240, 40);
    case "icosa":
      return new THREE.IcosahedronGeometry(1.65, 1);
    case "box":
      return new THREE.BoxGeometry(2.1, 2.1, 2.1, 8, 8, 8);
    case "sphere":
      return new THREE.SphereGeometry(1.6, 96, 64);
    case "torus":
      return new THREE.TorusGeometry(1.35, 0.5, 64, 160);
  }
}

function createMaterial(kind: MaterialKey, color: string): THREE.Material {
  const c = new THREE.Color(color);
  switch (kind) {
    case "metal":
      return new THREE.MeshStandardMaterial({
        color: c,
        metalness: 1,
        roughness: 0.16,
        envMapIntensity: 1.4,
      });
    case "glass":
      return new THREE.MeshPhysicalMaterial({
        color: c,
        metalness: 0,
        roughness: 0.05,
        transmission: 1,
        thickness: 1.6,
        ior: 1.5,
        transparent: true,
        envMapIntensity: 1.2,
      });
    case "matte":
      return new THREE.MeshStandardMaterial({
        color: c,
        metalness: 0.05,
        roughness: 0.78,
        envMapIntensity: 0.6,
      });
    case "wire":
      return new THREE.MeshBasicMaterial({ color: c, wireframe: true });
  }
}

/** シーンを外から操作するためのハンドル */
type SceneApi = {
  setShape: (s: ShapeKey) => void;
  setMaterial: (m: MaterialKey, color: string) => void;
  setLight: (v: number) => void;
  setAutoRotate: (v: boolean) => void;
  reset: () => void;
};

/**
 * 3DCG / WebGL デモ。
 * Three.js でリアルタイムにレンダリングし、形状・素材・カラー・光量・自動回転を
 * その場で切り替えられます（動画ではなく実際のWebGL描画）。
 */
export default function Demo3dcg() {
  const mountRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<SceneApi | null>(null);

  const [shape, setShape] = useState<ShapeKey>("knot");
  const [material, setMaterial] = useState<MaterialKey>("metal");
  const [color, setColor] = useState(CYAN);
  const [light, setLight] = useState(120);
  const [autoRotate, setAutoRotate] = useState(true);
  const [ready, setReady] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  const [fps, setFps] = useState(0);
  const [triangles, setTriangles] = useState(0);

  /* ------------------------------------------------------------------
   * シーンの構築（マウント時に一度だけ）
   * ---------------------------------------------------------------- */
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      // WebGL非対応環境。エフェクト内で同期的に状態更新しないよう次のタスクへ回す
      queueMicrotask(() => setUnsupported(true));
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 400;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "pan-y";

    const scene = new THREE.Scene();

    // 室内環境マップ：金属・ガラスに映り込みを与え、質感を一気に引き上げる
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.6, 6.2);

    // キーライト／フィルライト（ブランドカラーで色味を作る）
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 5, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x22d3ee, 1.4);
    fill.position.set(-5, -1, 3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x8b5cf6, 1.8);
    rim.position.set(-2, 3, -5);
    scene.add(rim);
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    const lights = [key, fill, rim, ambient];
    const baseIntensity = lights.map((l) => l.intensity);

    // メッシュ本体
    let geometry = createGeometry("knot");
    let mat = createMaterial("metal", CYAN);
    const mesh = new THREE.Mesh(geometry, mat);
    scene.add(mesh);

    /* --- 会社ロゴの3Dモデル ---
       立体文字「EBISU」＋固定の「Soft」＋その周りを回るリング＋飛び交う小さな光。
       画像ではなく実際のジオメトリなので、素材・カラーの切り替えもそのまま効く。
       生成コストがあるので「会社ロゴ」を選んだときに初めて組み立てる。 */
    let matKind: MaterialKey = "metal";
    let matColor = CYAN;
    let logo: Logo3d | null = null;

    const applyMaterial = () => {
      const next = createMaterial(matKind, matColor);
      mesh.material = next;
      if (logo) logo.letters.material = next;
      mat.dispose();
      mat = next;
    };

    const ensureLogo = () => {
      if (logo) return;
      logo = createLogo3d({ lettersMaterial: mat });
      logo.group.scale.setScalar(0.92);
      scene.add(logo.group);
    };

    // 足元のリフレクション代わりの発光リング（見栄えの底上げ）
    const glow = new THREE.Mesh(
      new THREE.RingGeometry(2.1, 3.4, 64),
      new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
      }),
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -2;
    scene.add(glow);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 3.4;
    controls.maxDistance = 11;
    controls.autoRotate = !prefersReducedMotion;
    controls.autoRotateSpeed = 1.6;

    const countTriangles = () => {
      const idx = geometry.getIndex();
      const n = idx ? idx.count / 3 : geometry.getAttribute("position").count / 3;
      setTriangles(Math.round(n));
    };
    countTriangles();

    /* --- 外部から操作するためのAPI --- */
    apiRef.current = {
      setShape: (s) => {
        if (s === "logo") {
          ensureLogo();
          mesh.visible = false;
          logo!.group.visible = true;
          setTriangles(logo!.triangles);
        } else {
          if (logo) logo.group.visible = false;
          mesh.visible = true;
          const next = createGeometry(s);
          mesh.geometry = next;
          geometry.dispose();
          geometry = next;
          countTriangles();
        }
        applyMaterial();
      },
      setMaterial: (m, c) => {
        matKind = m;
        matColor = c;
        applyMaterial();
      },
      setLight: (v) => {
        const scale = v / 100;
        lights.forEach((l, i) => {
          l.intensity = baseIntensity[i] * scale;
        });
        renderer.toneMappingExposure = 0.7 + scale * 0.4;
      },
      setAutoRotate: (v) => {
        controls.autoRotate = v && !prefersReducedMotion;
      },
      reset: () => {
        camera.position.set(0, 0.6, 6.2);
        controls.target.set(0, 0, 0);
        controls.update();
      },
    };

    /* --- 描画ループ（タブ非表示・画面外では停止） --- */
    let raf = 0;
    let running = true;
    let frames = 0;
    let last = performance.now();
    let firstFrameDone = false;

    const clock = new THREE.Clock();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!running) return;
      controls.update();
      glow.rotation.z += 0.0015;
      // ロゴのリング回転と光の飛び交いを進める（表示中のみ）
      if (logo?.group.visible) logo.update(clock.getElapsedTime());
      renderer.render(scene, camera);

      // 最初のフレームを描き終えた時点で「準備完了」にする
      if (!firstFrameDone) {
        firstFrameDone = true;
        setReady(true);
      }

      frames += 1;
      const now = performance.now();
      if (now - last >= 500) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
    };
    loop();

    const onVisibility = () => {
      running = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    // 画面外ではレンダリングを止め、無駄なGPU負荷をかけない
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting && document.visibilityState === "visible";
      },
      { threshold: 0.05 },
    );
    io.observe(mount);

    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      ro.disconnect();
      controls.dispose();
      geometry.dispose();
      mat.dispose();
      logo?.dispose();
      glow.geometry.dispose();
      (glow.material as THREE.Material).dispose();
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      apiRef.current = null;
    };
  }, []);

  /* --- Reactの状態をシーンへ反映 --- */
  useEffect(() => {
    apiRef.current?.setShape(shape);
  }, [shape]);

  useEffect(() => {
    apiRef.current?.setMaterial(material, color);
  }, [material, color]);

  useEffect(() => {
    apiRef.current?.setLight(light);
  }, [light]);

  useEffect(() => {
    apiRef.current?.setAutoRotate(autoRotate);
  }, [autoRotate]);

  /** 会社ロゴ（画像テクスチャ）表示中は、素材・カラーの切替が効かない */
  const isLogo = shape === "logo";

  if (unsupported) {
    return (
      <DemoStage label="エビスソフト.WebGL_Viewer">
        <div className="p-10 text-center text-sm text-slate-400">
          お使いの環境ではWebGLが利用できないため、3Dデモを表示できません。
          <br />
          最新のChrome / Safari / Edge でお試しください。
        </div>
      </DemoStage>
    );
  }

  return (
    <div className="grid gap-5 [&>*]:min-w-0 lg:grid-cols-5">
      <DemoStage
        className="min-w-0 lg:col-span-3"
        label="エビスソフト.WebGL_Viewer"
        status={ready ? `${fps} FPS · ${triangles.toLocaleString()} TRI` : "LOADING…"}
      >
        <div className="relative">
          {/* 実際のWebGLキャンバスがここに描画されます */}
          <div
            ref={mountRef}
            className="h-[300px] w-full cursor-grab bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.10),transparent_60%)] active:cursor-grabbing sm:h-[420px]"
          />
          {!ready ? (
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display animate-pulse text-xs tracking-[0.3em] text-slate-500">
                INITIALIZING WEBGL…
              </span>
            </div>
          ) : null}
          <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-ink/70 px-3 py-1 text-[11px] text-slate-400 backdrop-blur">
            ドラッグで回転 / ホイール・ピンチで拡大
          </p>
        </div>
      </DemoStage>

      {/* 操作パネル */}
      <div className="panel space-y-5 p-5 min-w-0 lg:col-span-2">
        <ControlGroup label="Shape / 形状">
          {SHAPES.map((s) => (
            <ChipButton
              key={s.key}
              active={shape === s.key}
              onClick={() => {
                setShape(s.key);
                // ロゴは正面・青のメタルで見せる。その後は自由に変えられる。
                // カメラの自動回転は切る（リング自体が回るので二重に回ると読みづらい）
                if (s.key === "logo") {
                  setMaterial("metal");
                  setColor(LOGO_BLUE);
                  setAutoRotate(false);
                  apiRef.current?.reset();
                }
              }}
            >
              {s.label}
            </ChipButton>
          ))}
        </ControlGroup>

        <ControlGroup label="Material / 素材">
          {MATERIALS.map((m) => (
            <ChipButton
              key={m.key}
              active={material === m.key}
              onClick={() => setMaterial(m.key)}
            >
              {m.label}
            </ChipButton>
          ))}
        </ControlGroup>

        <ControlGroup label="Color / カラー">
          {COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => setColor(c.hex)}
              aria-label={c.label}
              aria-pressed={color === c.hex}
              className={`size-8 rounded-lg border-2 transition-all ${
                color === c.hex
                  ? "scale-110 border-white shadow-[0_0_14px_rgba(255,255,255,0.4)]"
                  : "border-white/20 hover:border-white/50"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </ControlGroup>

        {isLogo ? (
          <p className="rounded-lg border border-brand/25 bg-brand/[0.07] px-3 py-2 text-xs leading-relaxed text-brand-light">
            画像ではなく実物の3Dモデルです。「EBISU」は押し出した立体文字、リングは別オブジェクトで文字の周りを回り、「Soft」は固定。素材とカラーは文字に反映されます。
          </p>
        ) : null}

        <RangeControl
          label="Light / 光量"
          value={light}
          min={20}
          max={200}
          step={5}
          suffix="%"
          onChange={setLight}
        />

        <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
          <SwitchButton checked={autoRotate} onChange={setAutoRotate}>
            自動回転
          </SwitchButton>
          <ChipButton active={false} onClick={() => apiRef.current?.reset()}>
            視点をリセット
          </ChipButton>
        </div>

        <p className="text-xs leading-relaxed text-slate-500">
          描画はすべてブラウザ上のリアルタイムWebGLです。環境マップ（映り込み）・トーンマッピング・被写界深度相当の演出を、追加のプラグインなしで実装しています。
        </p>
      </div>
    </div>
  );
}
