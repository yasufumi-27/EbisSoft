"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ChipButton, ControlGroup, DemoStage, RangeControl } from "./DemoUi";
import { Icon } from "@/components/ui/icons";

/* ------------------------------------------------------------------
 * 商品データ（実寸ミリメートル）
 * 実案件ではお客様のCAD / glTFを読み込みます。
 * ここでは寸法の正しさを見せるため、プリミティブで組んだモデルを使います。
 * ---------------------------------------------------------------- */

type ProductKey = "chair" | "table" | "lamp" | "shelf";

type Product = {
  key: ProductKey;
  name: string;
  /** 実寸（mm）：幅・奥行・高さ */
  size: [number, number, number];
  price: number;
  build: (color: THREE.ColorRepresentation) => THREE.Group;
};

/** 木材と金属のマテリアルを使い分けて、質感の違いも見せる */
function woodMat(color: THREE.ColorRepresentation) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.65, metalness: 0.05 });
}
function metalMat() {
  return new THREE.MeshStandardMaterial({ color: 0x3a4152, roughness: 0.35, metalness: 0.85 });
}

function boxAt(w: number, h: number, d: number, x: number, y: number, z: number, m: THREE.Material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  mesh.position.set(x, y, z);
  return mesh;
}

const PRODUCTS: Product[] = [
  {
    key: "chair",
    name: "ダイニングチェア",
    size: [450, 500, 820],
    price: 38000,
    build: (color) => {
      const g = new THREE.Group();
      const w = woodMat(color);
      const m = metalMat();
      // 座面（高さ 430mm）
      g.add(boxAt(0.45, 0.04, 0.45, 0, 0.43, 0, w));
      // 背もたれ
      g.add(boxAt(0.45, 0.36, 0.04, 0, 0.63, -0.2, w));
      // 脚 4本
      for (const [x, z] of [
        [0.19, 0.19],
        [-0.19, 0.19],
        [0.19, -0.19],
        [-0.19, -0.19],
      ]) {
        g.add(boxAt(0.03, 0.43, 0.03, x, 0.215, z, m));
      }
      return g;
    },
  },
  {
    key: "table",
    name: "ダイニングテーブル",
    size: [1400, 800, 720],
    price: 128000,
    build: (color) => {
      const g = new THREE.Group();
      const w = woodMat(color);
      const m = metalMat();
      g.add(boxAt(1.4, 0.05, 0.8, 0, 0.7, 0, w));
      for (const [x, z] of [
        [0.62, 0.32],
        [-0.62, 0.32],
        [0.62, -0.32],
        [-0.62, -0.32],
      ]) {
        g.add(boxAt(0.05, 0.68, 0.05, x, 0.34, z, m));
      }
      return g;
    },
  },
  {
    key: "lamp",
    name: "フロアランプ",
    size: [320, 320, 1550],
    price: 46000,
    build: (color) => {
      const g = new THREE.Group();
      const m = metalMat();
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.03, 32), m);
      base.position.y = 0.015;
      g.add(base);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.4, 16), m);
      pole.position.y = 0.72;
      g.add(pole);
      const shade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.17, 0.26, 32, 1, true),
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.9,
          side: THREE.DoubleSide,
          emissive: new THREE.Color(color).multiplyScalar(0.25),
        }),
      );
      shade.position.y = 1.42;
      g.add(shade);
      const bulb = new THREE.PointLight(0xffe6b0, 6, 4);
      bulb.position.y = 1.4;
      g.add(bulb);
      return g;
    },
  },
  {
    key: "shelf",
    name: "オープンシェルフ",
    size: [800, 300, 1800],
    price: 72000,
    build: (color) => {
      const g = new THREE.Group();
      const w = woodMat(color);
      // 側板
      g.add(boxAt(0.025, 1.8, 0.3, -0.39, 0.9, 0, w));
      g.add(boxAt(0.025, 1.8, 0.3, 0.39, 0.9, 0, w));
      // 棚板 5枚
      for (let i = 0; i < 5; i += 1) {
        g.add(boxAt(0.78, 0.025, 0.3, 0, 0.05 + i * 0.43, 0, w));
      }
      return g;
    },
  },
];

const COLORS = [
  { hex: 0xb98a5a, label: "オーク" },
  { hex: 0x6b4a33, label: "ウォルナット" },
  { hex: 0xf1eee8, label: "ホワイト" },
  { hex: 0x2c3140, label: "チャコール" },
];

type SceneApi = {
  setProduct: (k: ProductKey) => void;
  setColor: (hex: number) => void;
  setHuman: (v: boolean) => void;
  setDistance: (m: number) => void;
  startAr: () => Promise<void>;
};

/**
 * AR デモ。
 * - WebXR（immersive-ar）対応端末では、実際のカメラ映像に実物大で重ねられます。
 * - 非対応環境では、部屋を模した空間に実寸で配置するプレビューへ自動で切り替わります。
 *   どちらも同じ Three.js のシーンを使っており、寸法は実寸（メートル単位）です。
 */
export default function DemoAr() {
  const mountRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<SceneApi | null>(null);

  const [product, setProduct] = useState<ProductKey>("chair");
  const [color, setColor] = useState(COLORS[0].hex);
  const [human, setHuman] = useState(true);
  const [distance, setDistance] = useState(3);
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  const [inAr, setInAr] = useState(false);
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const current = PRODUCTS.find((p) => p.key === product) ?? PRODUCTS[0];

  /* ---------------- シーン構築 ---------------- */
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      queueMicrotask(() => setMessage("この環境ではWebGLが利用できません。"));
      return;
    }

    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 420;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.xr.enabled = true;
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "pan-y";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.05, 60);
    camera.position.set(0, 1.5, 3);

    // ---- 部屋（AR非対応時のプレビュー用。AR中は隠す） ----
    const room = new THREE.Group();
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.MeshStandardMaterial({ color: 0x2a2f3d, roughness: 0.95 }),
    );
    floor.rotation.x = -Math.PI / 2;
    room.add(floor);
    const grid = new THREE.GridHelper(12, 24, 0x22d3ee, 0x334155);
    (grid.material as THREE.Material).opacity = 0.25;
    (grid.material as THREE.Material).transparent = true;
    grid.position.y = 0.002;
    room.add(grid);
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 5),
      new THREE.MeshStandardMaterial({ color: 0x1b2130, roughness: 1 }),
    );
    backWall.position.set(0, 2.5, -4);
    room.add(backWall);
    scene.add(room);

    // ---- ライト ----
    scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x1a1f2b, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 5, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x22d3ee, 0.9);
    fill.position.set(-4, 2, 2);
    scene.add(fill);

    // ---- 人物シルエット（170cm）：サイズ感の比較用 ----
    const person = new THREE.Group();
    const silMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.28,
    });
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 0.86, 6, 16), silMat);
    body.position.y = 0.95;
    person.add(body);
    const headM = new THREE.Mesh(new THREE.SphereGeometry(0.115, 20, 16), silMat);
    headM.position.y = 1.585;
    person.add(headM);
    person.position.set(0.95, 0, 0);
    scene.add(person);

    // ---- 商品 ----
    let productGroup = PRODUCTS[0].build(COLORS[0].hex);
    scene.add(productGroup);

    const disposeGroup = (g: THREE.Group) => {
      g.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else m?.dispose();
      });
    };

    apiRef.current = {
      setProduct: (k) => {
        const def = PRODUCTS.find((p) => p.key === k);
        if (!def) return;
        scene.remove(productGroup);
        disposeGroup(productGroup);
        productGroup = def.build(color);
        scene.add(productGroup);
      },
      setColor: (hex) => {
        productGroup.traverse((o) => {
          const mesh = o as THREE.Mesh;
          const m = mesh.material as THREE.MeshStandardMaterial | undefined;
          // 金属パーツ（脚など）は色を変えない
          if (m && "color" in m && m.metalness < 0.5) m.color.set(hex);
        });
      },
      setHuman: (v) => {
        person.visible = v;
      },
      setDistance: (m) => {
        camera.position.set(0, 1.45, m);
        camera.lookAt(0, 0.55, 0);
      },
      startAr: async () => {
        const xr = navigator.xr;
        if (!xr) return;
        const session = await xr.requestSession("immersive-ar", {
          requiredFeatures: ["local-floor"],
          optionalFeatures: ["hit-test", "dom-overlay"],
          domOverlay: { root: mount },
        });
        await renderer.xr.setSession(session);
        room.visible = false;
        person.visible = false;
        // AR中は目の前 1.2m 先の床に置く
        productGroup.position.set(0, 0, -1.2);
        setInAr(true);
        session.addEventListener("end", () => {
          room.visible = true;
          person.visible = human;
          productGroup.position.set(0, 0, 0);
          setInAr(false);
        });
      },
    };

    let firstFrame = false;
    renderer.setAnimationLoop(() => {
      if (!renderer.xr.isPresenting) {
        productGroup.rotation.y += 0.0035;
      }
      renderer.render(scene, camera);
      if (!firstFrame) {
        firstFrame = true;
        setReady(true);
      }
    });

    // WebXR の対応状況を判定
    if (navigator.xr?.isSessionSupported) {
      navigator.xr
        .isSessionSupported("immersive-ar")
        .then((ok) => setArSupported(ok))
        .catch(() => setArSupported(false));
    } else {
      queueMicrotask(() => setArSupported(false));
    }

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
      renderer.setAnimationLoop(null);
      ro.disconnect();
      disposeGroup(productGroup);
      disposeGroup(room);
      disposeGroup(person);
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      apiRef.current = null;
    };
    // color / human は API 経由で反映するため依存に含めない（シーンは1度だけ構築する）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    apiRef.current?.setProduct(product);
    apiRef.current?.setColor(color);
  }, [product, color]);
  useEffect(() => {
    apiRef.current?.setHuman(human);
  }, [human]);
  useEffect(() => {
    apiRef.current?.setDistance(distance);
  }, [distance]);

  const [w, d, h] = current.size;

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <DemoStage
        className="lg:col-span-3"
        label="EbisuSoft.AR_Viewer"
        status={inAr ? "AR SESSION" : ready ? "REAL SCALE 1:1" : "LOADING…"}
      >
        <div className="relative">
          <div
            ref={mountRef}
            className="h-[320px] w-full bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.10),transparent_60%)] sm:h-[440px]"
          />
          {!ready && !message ? (
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display animate-pulse text-xs tracking-[0.3em] text-slate-500">
                INITIALIZING…
              </span>
            </div>
          ) : null}
          {message ? (
            <div className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-slate-400">
              {message}
            </div>
          ) : null}

          {/* 実寸の表示：ARの価値は「サイズが分かること」なので常に出す */}
          <div className="pointer-events-none absolute top-3 left-3 rounded-lg border border-white/10 bg-ink/75 px-3 py-2 backdrop-blur">
            <p className="text-xs font-bold text-white">{current.name}</p>
            <p className="font-display mt-0.5 text-[11px] text-brand-light tabular-nums">
              W{w} × D{d} × H{h} mm
            </p>
            <p className="mt-0.5 text-[11px] text-gold-light">
              ¥{current.price.toLocaleString()}
            </p>
          </div>

          {human ? (
            <p className="pointer-events-none absolute right-3 bottom-3 rounded-full border border-brand/30 bg-ink/70 px-3 py-1 text-[11px] text-brand-light backdrop-blur">
              比較用シルエット：身長170cm
            </p>
          ) : null}
        </div>
      </DemoStage>

      <div className="panel space-y-5 p-5 lg:col-span-2">
        {/* AR起動 */}
        <div className="rounded-xl border border-brand/25 bg-brand/[0.07] p-4">
          <p className="font-display text-[10px] font-bold tracking-[0.25em] text-brand uppercase">
            Augmented Reality
          </p>
          {arSupported === null ? (
            <p className="mt-2 text-xs text-slate-500">対応状況を確認しています…</p>
          ) : arSupported ? (
            <>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                この端末はWebXRに対応しています。カメラ映像に実物大で重ねて表示できます。
              </p>
              <button
                type="button"
                onClick={() => apiRef.current?.startAr().catch(() => setMessage("ARを開始できませんでした。"))}
                className="btn btn-primary mt-3 inline-flex h-10 w-full items-center justify-center text-sm"
              >
                <Icon name="ar" className="size-4" />
                ARで実物大表示
              </button>
            </>
          ) : (
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              この端末はWebXRに非対応のため、部屋を模した空間での
              <strong className="font-bold text-white">実寸プレビュー</strong>
              を表示しています。実案件では、iOSには AR Quick Look（USDZ）で同じ体験を提供します。
            </p>
          )}
        </div>

        <ControlGroup label="Product / 商品">
          {PRODUCTS.map((p) => (
            <ChipButton key={p.key} active={product === p.key} onClick={() => setProduct(p.key)}>
              {p.name}
            </ChipButton>
          ))}
        </ControlGroup>

        <ControlGroup label="Finish / 仕上げ">
          {COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => setColor(c.hex)}
              aria-label={c.label}
              aria-pressed={color === c.hex}
              className={`size-8 rounded-lg border-2 transition-all ${
                color === c.hex ? "scale-110 border-white" : "border-white/20 hover:border-white/50"
              }`}
              style={{ backgroundColor: `#${c.hex.toString(16).padStart(6, "0")}` }}
            />
          ))}
        </ControlGroup>

        <RangeControl
          label="View / 見る距離"
          value={distance}
          min={1.5}
          max={7}
          step={0.1}
          suffix="m"
          onChange={setDistance}
        />

        <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
          <ChipButton active={human} onClick={() => setHuman(!human)}>
            人物シルエットで比較
          </ChipButton>
        </div>

        <p className="text-xs leading-relaxed text-slate-500">
          モデルはすべて実寸（mm）で構築しています。距離を変えても、身長170cmのシルエットとの比率は正確に保たれます。
        </p>
      </div>
    </div>
  );
}
