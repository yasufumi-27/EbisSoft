import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import logoFontData from "./logoFont.json";

/**
 * 会社ロゴの3Dモデル。
 *
 * 構成（依頼主のご要望どおり、パーツを分けています）：
 * - `letters` … 押し出した立体文字「EBISU」。素材・カラーを差し替えられる
 * - `soft`    … 「Soft」。**回転させず固定**
 * - `ring`    … EBISU の周りを回るリング（別オブジェクト。2本＋軌道上の粒）
 * - `sparks`  … 模型の周りを飛ぶ小さな光
 *
 * 文字は Geist（SIL Open Font License 1.1）の Black を three.js の typeface 形式へ
 * 変換したもの（`logoFont.json`。EBISUoft の8字だけなので約2.8KB）。
 * ビットマップ画像ではなく実際のジオメトリなので、どこから見ても立体で、拡大しても滲みません。
 */

const font = new FontLoader().parse(logoFontData as unknown as Parameters<FontLoader["parse"]>[0]);

/** ブランドのロゴブルー（元のロゴの文字色に合わせた青） */
export const LOGO_BLUE = "#2f6cb0";
/** リングのシアン（サイトのブランドカラー） */
const RING_CYAN = 0x22d3ee;

export type Logo3d = {
  /** シーンに追加するルート */
  group: THREE.Group;
  /** 立体文字「EBISU」。素材を差し替えるときはこの material を入れ替える */
  letters: THREE.Mesh;
  /** 三角形の数（デモのステータス表示用） */
  triangles: number;
  /** 毎フレーム呼ぶ（t = 経過秒） */
  update: (t: number) => void;
  dispose: () => void;
};

/** 立体文字を作り、原点中心にそろえて返す。 */
function makeText(text: string, size: number, depth: number) {
  const geo = new TextGeometry(text, {
    font,
    size,
    depth,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: size * 0.03,
    bevelSize: size * 0.025,
    bevelSegments: 2,
  });
  geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  geo.translate(-(bb.max.x + bb.min.x) / 2, -(bb.max.y + bb.min.y) / 2, -depth / 2);
  return { geo, width: bb.max.x - bb.min.x, height: bb.max.y - bb.min.y };
}

export function createLogo3d(options: { lettersMaterial?: THREE.Material } = {}): Logo3d {
  const group = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  /* --- EBISU（立体文字） --- */
  const { geo: textGeo, width: textWidth } = makeText("EBISU", 1, 0.32);
  const lettersMat =
    options.lettersMaterial ??
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(LOGO_BLUE),
      metalness: 0.85,
      roughness: 0.25,
      envMapIntensity: 1.2,
    });
  const letters = new THREE.Mesh(textGeo, lettersMat);
  group.add(letters);
  disposables.push(textGeo);

  /* --- Soft（固定。リングと一緒には回さない） --- */
  const { geo: softGeo } = makeText("Soft", 0.42, 0.16);
  const softMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#a51f38"),
    metalness: 0.55,
    roughness: 0.35,
  });
  const soft = new THREE.Mesh(softGeo, softMat);
  soft.position.set(textWidth / 2 - 0.62, -0.74, 0.02);
  group.add(soft);
  disposables.push(softGeo, softMat);

  /* --- リング（EBISU の周りを回る。文字とは別オブジェクト） --- */
  const ring = new THREE.Group();
  const ringRadius = textWidth * 0.72;
  const ringMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(RING_CYAN),
    emissive: new THREE.Color(RING_CYAN),
    emissiveIntensity: 0.9,
    metalness: 0.6,
    roughness: 0.2,
  });
  const ringGeoA = new THREE.TorusGeometry(ringRadius, 0.035, 12, 128);
  const ringGeoB = new THREE.TorusGeometry(ringRadius * 0.82, 0.018, 10, 128);
  const ringA = new THREE.Mesh(ringGeoA, ringMat);
  const ringB = new THREE.Mesh(ringGeoB, ringMat);
  ringB.rotation.z = 0.5;
  // 軌道上を流れる小さな粒（リングと一緒に回る）
  const beadGeo = new THREE.SphereGeometry(0.055, 10, 8);
  const beadMat = new THREE.MeshBasicMaterial({ color: 0xd8f7ff });
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const bead = new THREE.Mesh(beadGeo, beadMat);
    bead.position.set(Math.cos(a) * ringRadius, Math.sin(a) * ringRadius, 0);
    ringA.add(bead);
  }
  ring.add(ringA, ringB);
  // 楕円の軌道に見えるよう寝かせる
  ring.rotation.x = 1.02;
  ring.rotation.z = -0.2;
  group.add(ring);
  disposables.push(ringGeoA, ringGeoB, ringMat, beadGeo, beadMat);

  /* --- 周りを飛ぶ小さな光 --- */
  const SPARKS = 90;
  const sparkPos = new Float32Array(SPARKS * 3);
  const sparkSeed: { r: number; y: number; speed: number; phase: number; bob: number }[] = [];
  for (let i = 0; i < SPARKS; i++) {
    sparkSeed.push({
      r: ringRadius * (0.7 + Math.random() * 0.6),
      y: (Math.random() - 0.5) * 1.5,
      speed: 0.15 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      bob: 0.1 + Math.random() * 0.25,
    });
  }
  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
  const sparkMat = new THREE.PointsMaterial({
    size: 0.055,
    color: 0xbdf0ff,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const sparks = new THREE.Points(sparkGeo, sparkMat);
  group.add(sparks);
  disposables.push(sparkGeo, sparkMat);

  const triangles = [textGeo, softGeo, ringGeoA, ringGeoB].reduce((n, g) => {
    const idx = g.getIndex();
    return n + (idx ? idx.count / 3 : g.getAttribute("position").count / 3);
  }, 0);

  const update = (t: number) => {
    // リングだけが回る（EBISU と Soft は回さない）
    ringA.rotation.z = t * 0.55;
    ringB.rotation.z = -t * 0.38;
    ring.rotation.y = Math.sin(t * 0.25) * 0.35;
    // 小さな光が模型の周りを流れる
    for (let i = 0; i < SPARKS; i++) {
      const s = sparkSeed[i];
      const a = s.phase + t * s.speed;
      sparkPos[i * 3] = Math.cos(a) * s.r;
      sparkPos[i * 3 + 1] = s.y + Math.sin(t * s.speed * 2 + s.phase) * s.bob;
      sparkPos[i * 3 + 2] = Math.sin(a) * s.r * 0.6;
    }
    sparkGeo.getAttribute("position").needsUpdate = true;
  };
  update(0);

  return {
    group,
    letters,
    triangles: Math.round(triangles),
    update,
    dispose: () => {
      disposables.forEach((d) => d.dispose());
      // letters の material は呼び出し側が管理する（差し替えるため）
    },
  };
}
