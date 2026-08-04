import * as THREE from "three";

/**
 * 職種別の3Dモデル。
 *
 * 「この職種ならこんな感じ」の説明ではなく、**その職種で実際に見せたい物**を
 * その場で組み立てます（医療なら診療ユニット、製造なら機械部品、不動産なら間取り）。
 * 外部の3Dファイルを読み込まず、基本形状の組み合わせだけで作っているため、
 * **追加のダウンロードがゼロ**です（デモを軽く保つための判断）。
 *
 * 実案件では、ここをお客様のCADデータや3Dスキャンに差し替えます。
 * デモの中でもその旨を必ず出すこと（`Demo3dcg` の注記）。
 *
 * 【素材切り替えとの関係】
 * `themed` に入れたメッシュだけが、デモの「素材・カラー」の切り替え対象になります。
 * 影になる部品（ゴム・木・ガラス面など）は固定の素材にして、
 * 全体が単色にならないようにしています。
 */

export type IndustryModelKey =
  | "cup"
  | "dish"
  | "dental-unit"
  | "machine-part"
  | "floorplan"
  | "house"
  | "desk"
  | "documents"
  | "salon-chair"
  | "dumbbell"
  | "guestroom"
  | "truck"
  | "wheel"
  | "crate"
  | "arch"
  | "care-bed"
  | "server"
  | "garment";

export type IndustryModel = {
  group: THREE.Group;
  /** 素材・カラーの切り替え対象（ここに入れたものだけ色が変わる） */
  themed: THREE.Mesh[];
  triangles: number;
  dispose: () => void;
};

/** モデルの表示名（デモ側のラベルに使う） */
export const INDUSTRY_MODEL_LABEL: Record<IndustryModelKey, string> = {
  cup: "マグカップ",
  dish: "会席の一皿",
  "dental-unit": "歯科診療ユニット",
  "machine-part": "機械部品",
  floorplan: "間取り",
  house: "住宅",
  desk: "学習机",
  documents: "書類一式",
  "salon-chair": "サロンチェア",
  dumbbell: "ダンベル",
  guestroom: "客室",
  truck: "配送トラック",
  wheel: "ホイール",
  crate: "収穫コンテナ",
  arch: "装花アーチ",
  "care-bed": "介護ベッド",
  server: "サーバーラック",
  garment: "トルソーと衣服",
};

/* ------------------------------------------------------------------
 * 補助（作るときの決まりごと）
 * ---------------------------------------------------------------- */

/** 固定素材（切り替え対象外）。作りすぎないよう、ここに定義したものだけを使う */
function fixed(color: number, opts: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({ color, metalness: 0.1, roughness: 0.72, ...opts });
}

const PALETTE = {
  dark: 0x2b3444,
  light: 0xe8edf4,
  wood: 0xb98a54,
  woodDark: 0x8a6238,
  rubber: 0x1b2029,
  fabric: 0x5c6b86,
  green: 0x4fa96b,
  red: 0xc4483a,
  glass: 0x9fd8ef,
  gold: 0xd9b96a,
};

/** メッシュを作って位置・回転・スケールを一度に指定する */
function put(
  geo: THREE.BufferGeometry,
  mat: THREE.Material,
  pos: [number, number, number] = [0, 0, 0],
  rot: [number, number, number] = [0, 0, 0],
): THREE.Mesh {
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(...pos);
  mesh.rotation.set(...rot);
  return mesh;
}

/** ロクロで挽いた形（カップ・器）を輪郭から作る */
function lathe(points: [number, number][], segments = 48): THREE.LatheGeometry {
  return new THREE.LatheGeometry(
    points.map(([x, y]) => new THREE.Vector2(x, y)),
    segments,
  );
}

/* ------------------------------------------------------------------
 * 職種ごとのモデル
 * ---------------------------------------------------------------- */

type Build = (themed: THREE.Material) => { group: THREE.Group; themed: THREE.Mesh[] };

const BUILDERS: Record<IndustryModelKey, Build> = {
  /* 小売・EC：陶器のマグカップ（底面・持ち手まで回して見せる） */
  cup: (mat) => {
    const g = new THREE.Group();
    const body = put(
      lathe([
        [0, -1.1],
        [0.92, -1.1],
        [0.95, -0.95],
        [0.86, -0.2],
        [0.9, 1.0],
        [0.82, 1.05],
        [0.78, -0.2],
        [0.84, -0.9],
        [0, -0.92],
      ]),
      mat,
    );
    const handle = put(
      new THREE.TorusGeometry(0.5, 0.11, 20, 48, Math.PI * 1.25),
      mat,
      [1.0, 0.05, 0],
      [0, 0, -Math.PI / 2.4],
    );
    const saucer = put(
      lathe([
        [0, -1.35],
        [1.7, -1.35],
        [1.72, -1.22],
        [0, -1.24],
      ]),
      fixed(PALETTE.light, { roughness: 0.5 }),
    );
    g.add(body, handle, saucer);
    return { group: g, themed: [body, handle] };
  },

  /* 飲食店：椀と皿に盛った一皿 */
  dish: (mat) => {
    const g = new THREE.Group();
    const plate = put(
      lathe([
        [0, -0.55],
        [1.9, -0.35],
        [1.95, -0.2],
        [1.6, -0.3],
        [0, -0.42],
      ]),
      mat,
    );
    const bowl = put(
      lathe([
        [0, -0.3],
        [0.78, 0.35],
        [0.84, 0.42],
        [0.7, 0.3],
        [0, -0.22],
      ]),
      mat,
      [-0.55, 0.05, 0.3],
    );
    const food = put(
      new THREE.SphereGeometry(0.42, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      fixed(PALETTE.red, { roughness: 0.55 }),
      [0.55, -0.22, -0.1],
    );
    const garnish = put(
      new THREE.ConeGeometry(0.16, 0.5, 12),
      fixed(PALETTE.green),
      [0.75, -0.05, 0.35],
      [0.2, 0, 0.35],
    );
    const chopsticks = put(
      new THREE.CylinderGeometry(0.035, 0.02, 2.4, 8),
      fixed(PALETTE.woodDark),
      [0.1, -0.4, 1.15],
      [0, 0, Math.PI / 2],
    );
    g.add(plate, bowl, food, garnish, chopsticks);
    return { group: g, themed: [plate, bowl] };
  },

  /* クリニック・歯科：診療ユニット（チェア＋アーム＋無影灯＋モニタ） */
  "dental-unit": (mat) => {
    const g = new THREE.Group();
    const base = put(new THREE.CylinderGeometry(0.75, 0.95, 0.24, 24), fixed(PALETTE.dark), [0, -1.75, 0]);
    const post = put(new THREE.CylinderGeometry(0.22, 0.26, 1.1, 16), fixed(PALETTE.dark), [0, -1.15, 0]);
    const seat = put(new THREE.BoxGeometry(0.95, 0.22, 2.0), mat, [0, -0.6, 0.1]);
    const backrest = put(new THREE.BoxGeometry(0.9, 1.5, 0.22), mat, [0, 0.05, -0.85], [0.34, 0, 0]);
    const headrest = put(new THREE.BoxGeometry(0.55, 0.4, 0.2), mat, [0, 0.72, -1.28], [0.34, 0, 0]);
    const armPost = put(new THREE.CylinderGeometry(0.09, 0.09, 2.6, 12), fixed(PALETTE.light), [-1.15, -0.3, -0.2]);
    const armH = put(
      new THREE.CylinderGeometry(0.08, 0.08, 1.5, 12),
      fixed(PALETTE.light),
      [-0.45, 0.95, -0.2],
      [0, 0, Math.PI / 2],
    );
    // 無影灯
    const lamp = put(
      lathe([
        [0, 0],
        [0.5, 0.02],
        [0.52, 0.16],
        [0.1, 0.22],
        [0, 0.2],
      ]),
      fixed(PALETTE.light, { metalness: 0.5, roughness: 0.28 }),
      [0.3, 0.8, -0.2],
      [Math.PI, 0, 0],
    );
    const lampGlow = put(
      new THREE.CircleGeometry(0.42, 24),
      new THREE.MeshBasicMaterial({ color: 0xfff6d8 }),
      [0.3, 0.78, -0.2],
      [Math.PI / 2, 0, 0],
    );
    // 器具トレイとモニタ
    const tray = put(new THREE.BoxGeometry(0.7, 0.06, 0.45), fixed(PALETTE.light), [1.0, -0.15, 0.1]);
    const trayArm = put(
      new THREE.CylinderGeometry(0.05, 0.05, 0.9, 10),
      fixed(PALETTE.light),
      [0.6, -0.15, 0.1],
      [0, 0, Math.PI / 2],
    );
    const monitor = put(new THREE.BoxGeometry(0.9, 0.55, 0.06), fixed(PALETTE.dark), [1.35, 0.75, -0.1], [0, -0.4, 0]);
    const screen = put(
      new THREE.PlaneGeometry(0.8, 0.45),
      new THREE.MeshBasicMaterial({ color: 0x2f6f8f }),
      [1.33, 0.75, -0.07],
      [0, -0.4, 0],
    );
    g.add(base, post, seat, backrest, headrest, armPost, armH, lamp, lampGlow, tray, trayArm, monitor, screen);
    g.position.y = 0.35;
    return { group: g, themed: [seat, backrest, headrest] };
  },

  /* 製造業：フランジつきの機械部品（穴・面取り・軸） */
  "machine-part": (mat) => {
    const g = new THREE.Group();
    const flange = put(new THREE.CylinderGeometry(1.5, 1.5, 0.34, 48), mat);
    const collar = put(new THREE.CylinderGeometry(0.85, 1.0, 0.55, 40), mat, [0, 0.42, 0]);
    const shaft = put(new THREE.CylinderGeometry(0.42, 0.42, 1.7, 32), mat, [0, 1.1, 0]);
    const keyway = put(new THREE.BoxGeometry(0.18, 0.9, 0.5), fixed(PALETTE.dark), [0.32, 1.35, 0]);
    g.add(flange, collar, shaft, keyway);
    // ボルト穴（実際に穴は開けず、座ぐりの形で表現する）
    for (let i = 0; i < 6; i += 1) {
      const a = (i / 6) * Math.PI * 2;
      const hole = put(
        new THREE.CylinderGeometry(0.19, 0.19, 0.4, 20),
        fixed(PALETTE.dark, { metalness: 0.6, roughness: 0.35 }),
        [Math.cos(a) * 1.15, 0, Math.sin(a) * 1.15],
      );
      g.add(hole);
    }
    g.rotation.z = 0.12;
    return { group: g, themed: [flange, collar, shaft] };
  },

  /* 不動産：間取り（床・壁・家具のブロック） */
  floorplan: (mat) => {
    const g = new THREE.Group();
    const floor = put(new THREE.BoxGeometry(4.4, 0.16, 3.4), fixed(PALETTE.wood), [0, -1.0, 0]);
    const wallN = put(new THREE.BoxGeometry(4.4, 1.1, 0.12), mat, [0, -0.36, -1.7]);
    const wallW = put(new THREE.BoxGeometry(0.12, 1.1, 3.4), mat, [-2.2, -0.36, 0]);
    const wallMid = put(new THREE.BoxGeometry(0.12, 1.1, 1.9), mat, [0.35, -0.36, -0.75]);
    const bed = put(new THREE.BoxGeometry(1.2, 0.35, 1.7), fixed(PALETTE.fabric), [-1.4, -0.74, -0.6]);
    const sofa = put(new THREE.BoxGeometry(1.5, 0.4, 0.7), fixed(PALETTE.fabric), [1.3, -0.72, 0.7]);
    const table = put(new THREE.BoxGeometry(0.9, 0.1, 0.6), fixed(PALETTE.woodDark), [1.3, -0.5, -0.2]);
    const kitchen = put(new THREE.BoxGeometry(0.5, 0.7, 1.6), fixed(PALETTE.light), [1.85, -0.55, -0.85]);
    g.add(floor, wallN, wallW, wallMid, bed, sofa, table, kitchen);
    g.rotation.x = 0.12;
    return { group: g, themed: [wallN, wallW, wallMid] };
  },

  /* 建設・工務店：切妻屋根の住宅 */
  house: (mat) => {
    const g = new THREE.Group();
    const ground = put(new THREE.BoxGeometry(4.6, 0.14, 4.0), fixed(0x6f7c68), [0, -1.55, 0]);
    const body = put(new THREE.BoxGeometry(2.8, 1.7, 2.2), mat, [0, -0.6, 0]);
    const roof = put(new THREE.ConeGeometry(2.2, 1.2, 4), fixed(PALETTE.dark), [0, 0.85, 0], [0, Math.PI / 4, 0]);
    const door = put(new THREE.BoxGeometry(0.5, 0.9, 0.08), fixed(PALETTE.woodDark), [-0.6, -0.98, 1.12]);
    const win1 = put(
      new THREE.BoxGeometry(0.8, 0.6, 0.08),
      fixed(PALETTE.glass, { metalness: 0.4, roughness: 0.15 }),
      [0.65, -0.4, 1.12],
    );
    const win2 = put(
      new THREE.BoxGeometry(0.08, 0.6, 0.9),
      fixed(PALETTE.glass, { metalness: 0.4, roughness: 0.15 }),
      [1.42, -0.4, -0.1],
    );
    const carport = put(new THREE.BoxGeometry(1.6, 0.08, 1.8), fixed(PALETTE.light), [2.2, -0.35, 0.4]);
    const post1 = put(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 10), fixed(PALETTE.light), [2.9, -0.93, 1.2]);
    const post2 = put(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 10), fixed(PALETTE.light), [2.9, -0.93, -0.4]);
    g.add(ground, body, roof, door, win1, win2, carport, post1, post2);
    return { group: g, themed: [body] };
  },

  /* 学習塾：学習机と椅子、教材 */
  desk: (mat) => {
    const g = new THREE.Group();
    const top = put(new THREE.BoxGeometry(2.6, 0.12, 1.3), mat, [0, -0.2, 0]);
    const legs = [-1.15, 1.15].flatMap((x) =>
      [-0.5, 0.5].map((z) =>
        put(new THREE.BoxGeometry(0.1, 1.3, 0.1), fixed(PALETTE.dark), [x, -0.88, z]),
      ),
    );
    const chairSeat = put(new THREE.BoxGeometry(0.8, 0.1, 0.8), fixed(PALETTE.fabric), [0, -0.75, 1.5]);
    const chairBack = put(new THREE.BoxGeometry(0.8, 0.7, 0.1), fixed(PALETTE.fabric), [0, -0.35, 1.85]);
    const chairLegs = [-0.3, 0.3].flatMap((x) =>
      [1.2, 1.8].map((z) =>
        put(new THREE.CylinderGeometry(0.04, 0.04, 0.85, 8), fixed(PALETTE.dark), [x, -1.2, z]),
      ),
    );
    const book1 = put(new THREE.BoxGeometry(0.7, 0.08, 0.95), fixed(PALETTE.red), [-0.5, -0.1, 0]);
    const book2 = put(new THREE.BoxGeometry(0.68, 0.07, 0.92), fixed(0x3f6fb0), [-0.48, -0.02, 0.04]);
    const lampPost = put(new THREE.CylinderGeometry(0.04, 0.1, 0.9, 10), fixed(PALETTE.light), [1.0, 0.3, -0.3]);
    const lampHead = put(
      new THREE.ConeGeometry(0.28, 0.3, 16, 1, true),
      fixed(PALETTE.light, { side: THREE.DoubleSide }),
      [0.8, 0.72, -0.3],
      [0.5, 0, 0.4],
    );
    g.add(top, chairSeat, chairBack, book1, book2, lampPost, lampHead, ...legs, ...chairLegs);
    g.position.z = -0.6;
    return { group: g, themed: [top] };
  },

  /* 士業：書類の束・ファイル・印鑑 */
  documents: (mat) => {
    const g = new THREE.Group();
    const desk = put(new THREE.BoxGeometry(3.4, 0.12, 2.2), fixed(PALETTE.woodDark), [0, -1.1, 0]);
    const stack: THREE.Mesh[] = [];
    for (let i = 0; i < 7; i += 1) {
      stack.push(
        put(
          new THREE.BoxGeometry(1.5, 0.035, 2.1),
          mat,
          [-0.6, -0.98 + i * 0.045, 0],
          [0, (i % 2 ? 1 : -1) * 0.02, 0],
        ),
      );
    }
    const folder = put(new THREE.BoxGeometry(1.6, 0.22, 2.2), fixed(0x2c5f8a), [1.15, -0.92, -0.05], [0, 0.08, 0]);
    const sealBody = put(new THREE.CylinderGeometry(0.16, 0.16, 0.5, 24), fixed(PALETTE.woodDark), [1.1, -0.75, 0.9]);
    const sealFace = put(new THREE.CylinderGeometry(0.17, 0.17, 0.06, 24), fixed(PALETTE.red), [1.1, -1.0, 0.9]);
    const pen = put(
      new THREE.CylinderGeometry(0.045, 0.03, 1.1, 12),
      fixed(PALETTE.dark),
      [0.2, -0.98, 1.0],
      [0, 0, Math.PI / 2.2],
    );
    g.add(desk, folder, sealBody, sealFace, pen, ...stack);
    return { group: g, themed: stack };
  },

  /* 美容室：サロンチェア */
  "salon-chair": (mat) => {
    const g = new THREE.Group();
    const base = put(new THREE.CylinderGeometry(0.85, 0.95, 0.16, 28), fixed(PALETTE.dark), [0, -1.7, 0]);
    const post = put(new THREE.CylinderGeometry(0.16, 0.2, 1.0, 16), fixed(0xb8bec9, { metalness: 0.8, roughness: 0.25 }), [0, -1.12, 0]);
    const seat = put(new THREE.BoxGeometry(1.5, 0.34, 1.4), mat, [0, -0.5, 0.1]);
    const back = put(new THREE.BoxGeometry(1.4, 1.6, 0.3), mat, [0, 0.35, -0.62], [0.16, 0, 0]);
    const headrest = put(new THREE.BoxGeometry(0.7, 0.42, 0.28), mat, [0, 1.22, -0.85], [0.16, 0, 0]);
    const armL = put(new THREE.BoxGeometry(0.18, 0.16, 1.1), fixed(PALETTE.dark), [-0.75, -0.18, 0.1]);
    const armR = put(new THREE.BoxGeometry(0.18, 0.16, 1.1), fixed(PALETTE.dark), [0.75, -0.18, 0.1]);
    const foot = put(new THREE.BoxGeometry(0.9, 0.1, 0.4), fixed(PALETTE.dark), [0, -1.35, 0.85]);
    const mirror = put(
      new THREE.CylinderGeometry(1.0, 1.0, 0.06, 40),
      fixed(0xdfe9f2, { metalness: 0.9, roughness: 0.08 }),
      [0, 0.4, -1.9],
      [Math.PI / 2, 0, 0],
    );
    g.add(base, post, seat, back, headrest, armL, armR, foot, mirror);
    return { group: g, themed: [seat, back, headrest] };
  },

  /* フィットネス：ダンベル */
  dumbbell: (mat) => {
    const g = new THREE.Group();
    const bar = put(
      new THREE.CylinderGeometry(0.17, 0.17, 2.0, 24),
      fixed(0xc3c9d2, { metalness: 0.95, roughness: 0.22 }),
      [0, 0, 0],
      [0, 0, Math.PI / 2],
    );
    const plates: THREE.Mesh[] = [];
    [-1, 1].forEach((s) => {
      [0.0, 0.32].forEach((o, i) => {
        plates.push(
          put(
            new THREE.CylinderGeometry(i === 0 ? 0.95 : 0.72, i === 0 ? 0.95 : 0.72, 0.26, 32),
            mat,
            [s * (1.0 + o), 0, 0],
            [0, 0, Math.PI / 2],
          ),
        );
      });
    });
    const grip = put(
      new THREE.CylinderGeometry(0.2, 0.2, 0.9, 24),
      fixed(PALETTE.rubber, { roughness: 0.9 }),
      [0, 0, 0],
      [0, 0, Math.PI / 2],
    );
    const mat2 = put(new THREE.BoxGeometry(4.0, 0.1, 2.4), fixed(PALETTE.rubber, { roughness: 0.95 }), [0, -1.35, 0]);
    g.add(bar, grip, mat2, ...plates);
    return { group: g, themed: plates };
  },

  /* 宿泊：客室（畳・布団・障子） */
  guestroom: (mat) => {
    const g = new THREE.Group();
    const tatami = put(new THREE.BoxGeometry(4.2, 0.14, 3.2), fixed(0xbfc48b, { roughness: 0.9 }), [0, -1.2, 0]);
    const futon = put(new THREE.BoxGeometry(1.6, 0.24, 2.2), mat, [-0.9, -1.0, 0.1]);
    const pillow = put(new THREE.BoxGeometry(0.7, 0.16, 0.4), fixed(PALETTE.light), [-0.9, -0.82, -0.75]);
    const shoji = put(new THREE.BoxGeometry(3.6, 1.9, 0.08), fixed(0xf2ecdd), [0, -0.2, -1.6]);
    const frameV = [-1.2, 0, 1.2].map((x) =>
      put(new THREE.BoxGeometry(0.06, 1.9, 0.12), fixed(PALETTE.woodDark), [x, -0.2, -1.55]),
    );
    const frameH = [-0.75, 0.35].map((y) =>
      put(new THREE.BoxGeometry(3.6, 0.06, 0.12), fixed(PALETTE.woodDark), [0, y, -1.55]),
    );
    const table = put(new THREE.BoxGeometry(1.1, 0.1, 0.8), fixed(PALETTE.woodDark), [1.3, -0.75, 0.5]);
    const cushion = put(new THREE.BoxGeometry(0.6, 0.12, 0.6), mat, [1.3, -1.05, 1.3]);
    g.add(tatami, futon, pillow, shoji, table, cushion, ...frameV, ...frameH);
    g.rotation.x = 0.08;
    return { group: g, themed: [futon, cushion] };
  },

  /* 運送：配送トラック */
  truck: (mat) => {
    const g = new THREE.Group();
    const box = put(new THREE.BoxGeometry(2.6, 1.5, 1.5), mat, [-0.55, -0.15, 0]);
    const cab = put(new THREE.BoxGeometry(1.2, 1.1, 1.45), fixed(PALETTE.light), [1.35, -0.35, 0]);
    const windshield = put(
      new THREE.BoxGeometry(0.08, 0.55, 1.3),
      fixed(PALETTE.glass, { metalness: 0.5, roughness: 0.1 }),
      [1.95, -0.1, 0],
    );
    const chassis = put(new THREE.BoxGeometry(4.2, 0.18, 1.3), fixed(PALETTE.dark), [0.1, -0.95, 0]);
    const wheels: THREE.Mesh[] = [];
    [
      [1.35, 0.78],
      [1.35, -0.78],
      [-1.0, 0.78],
      [-1.0, -0.78],
      [-1.65, 0.78],
      [-1.65, -0.78],
    ].forEach(([x, z]) => {
      wheels.push(
        put(
          new THREE.CylinderGeometry(0.42, 0.42, 0.26, 24),
          fixed(PALETTE.rubber, { roughness: 0.95 }),
          [x, -1.15, z],
          [Math.PI / 2, 0, 0],
        ),
      );
    });
    const road = put(new THREE.BoxGeometry(6.5, 0.06, 3.0), fixed(0x3a4150), [0, -1.6, 0]);
    g.add(box, cab, windshield, chassis, road, ...wheels);
    return { group: g, themed: [box] };
  },

  /* 自動車：ホイールとタイヤ */
  wheel: (mat) => {
    const g = new THREE.Group();
    const tire = put(
      new THREE.TorusGeometry(1.45, 0.45, 24, 56),
      fixed(PALETTE.rubber, { roughness: 0.95 }),
      [0, 0, 0],
    );
    const rim = put(new THREE.CylinderGeometry(1.15, 1.15, 0.62, 48), mat, [0, 0, 0], [Math.PI / 2, 0, 0]);
    const hub = put(new THREE.CylinderGeometry(0.35, 0.35, 0.72, 24), mat, [0, 0, 0], [Math.PI / 2, 0, 0]);
    const spokes: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i += 1) {
      const a = (i / 5) * Math.PI * 2;
      spokes.push(
        put(new THREE.BoxGeometry(0.9, 0.22, 0.34), mat, [Math.cos(a) * 0.72, Math.sin(a) * 0.72, 0.16], [0, 0, a]),
      );
    }
    const disc = put(
      new THREE.CylinderGeometry(0.85, 0.85, 0.12, 32),
      fixed(0x8b929d, { metalness: 0.85, roughness: 0.35 }),
      [0, 0, -0.2],
      [Math.PI / 2, 0, 0],
    );
    g.add(tire, rim, hub, disc, ...spokes);
    return { group: g, themed: [rim, hub, ...spokes] };
  },

  /* 農業：収穫コンテナと野菜 */
  crate: (mat) => {
    const g = new THREE.Group();
    const bottom = put(new THREE.BoxGeometry(2.6, 0.12, 1.9), mat, [0, -1.0, 0]);
    const walls = [
      put(new THREE.BoxGeometry(2.6, 0.9, 0.1), mat, [0, -0.55, 0.9]),
      put(new THREE.BoxGeometry(2.6, 0.9, 0.1), mat, [0, -0.55, -0.9]),
      put(new THREE.BoxGeometry(0.1, 0.9, 1.9), mat, [1.25, -0.55, 0]),
      put(new THREE.BoxGeometry(0.1, 0.9, 1.9), mat, [-1.25, -0.55, 0]),
    ];
    const veggies: THREE.Mesh[] = [];
    const colors = [PALETTE.red, PALETTE.green, 0x7a4fa8, 0xe0a92b];
    for (let i = 0; i < 9; i += 1) {
      const c = colors[i % colors.length];
      veggies.push(
        put(
          new THREE.SphereGeometry(0.3, 20, 14),
          fixed(c, { roughness: 0.6 }),
          [-0.9 + (i % 3) * 0.9, -0.55 + Math.floor(i / 3) * 0.12, -0.5 + Math.floor(i / 3) * 0.5],
        ),
      );
    }
    const leaf = put(new THREE.ConeGeometry(0.22, 0.6, 10), fixed(PALETTE.green), [0.9, -0.1, 0.4], [0.3, 0, -0.4]);
    g.add(bottom, leaf, ...walls, ...veggies);
    return { group: g, themed: [bottom, ...walls] };
  },

  /* ブライダル：装花アーチとテーブル */
  arch: (mat) => {
    const g = new THREE.Group();
    const archMesh = put(new THREE.TorusGeometry(1.7, 0.11, 16, 48, Math.PI), mat, [0, -0.2, 0]);
    const legL = put(new THREE.CylinderGeometry(0.11, 0.11, 1.4, 12), mat, [-1.7, -0.9, 0]);
    const legR = put(new THREE.CylinderGeometry(0.11, 0.11, 1.4, 12), mat, [1.7, -0.9, 0]);
    const flowers: THREE.Mesh[] = [];
    for (let i = 0; i < 14; i += 1) {
      const a = (i / 13) * Math.PI;
      const c = [0xf2c9d6, 0xffffff, 0xf6e6b8, PALETTE.green][i % 4];
      flowers.push(
        put(
          new THREE.SphereGeometry(0.16 + (i % 3) * 0.03, 14, 10),
          fixed(c, { roughness: 0.7 }),
          [Math.cos(a) * 1.7, -0.2 + Math.sin(a) * 1.7, (i % 2 ? 0.12 : -0.12)],
        ),
      );
    }
    const table = put(new THREE.CylinderGeometry(0.8, 0.8, 0.08, 32), fixed(0xf7f3ee), [0, -0.75, 1.4]);
    const tableLeg = put(new THREE.CylinderGeometry(0.1, 0.3, 0.85, 16), fixed(0xf7f3ee), [0, -1.2, 1.4]);
    const centerpiece = put(new THREE.SphereGeometry(0.28, 18, 12), fixed(0xf2c9d6), [0, -0.5, 1.4]);
    const runner = put(new THREE.CylinderGeometry(0.82, 0.82, 0.02, 32), fixed(PALETTE.gold), [0, -0.7, 1.4]);
    g.add(archMesh, legL, legR, table, tableLeg, centerpiece, runner, ...flowers);
    return { group: g, themed: [archMesh, legL, legR] };
  },

  /* 介護：介護ベッド（手すり・昇降） */
  "care-bed": (mat) => {
    const g = new THREE.Group();
    const frame = put(new THREE.BoxGeometry(3.2, 0.16, 1.6), fixed(PALETTE.light), [0, -0.75, 0]);
    const mattress = put(new THREE.BoxGeometry(3.0, 0.3, 1.5), mat, [0, -0.52, 0]);
    const backUp = put(new THREE.BoxGeometry(1.2, 0.28, 1.5), mat, [-1.05, -0.16, 0], [0, 0, 0.42]);
    const pillow = put(new THREE.BoxGeometry(0.7, 0.18, 1.0), fixed(0xf3f6fa), [-1.25, 0.16, 0], [0, 0, 0.42]);
    const railL = put(new THREE.BoxGeometry(1.4, 0.5, 0.06), fixed(0xb8bec9, { metalness: 0.7 }), [0.2, -0.2, 0.78]);
    const railR = put(new THREE.BoxGeometry(1.4, 0.5, 0.06), fixed(0xb8bec9, { metalness: 0.7 }), [0.2, -0.2, -0.78]);
    const head = put(new THREE.BoxGeometry(0.1, 0.8, 1.5), fixed(PALETTE.woodDark), [-1.6, -0.4, 0]);
    const foot = put(new THREE.BoxGeometry(0.1, 0.6, 1.5), fixed(PALETTE.woodDark), [1.6, -0.5, 0]);
    const legs = [
      [-1.4, 0.65],
      [-1.4, -0.65],
      [1.4, 0.65],
      [1.4, -0.65],
    ].map(([x, z]) => put(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 12), fixed(PALETTE.dark), [x, -1.25, z]));
    g.add(frame, mattress, backUp, pillow, railL, railR, head, foot, ...legs);
    return { group: g, themed: [mattress, backUp] };
  },

  /* IT・SaaS：サーバーラックと流れるデータ */
  server: (mat) => {
    const g = new THREE.Group();
    const rack = put(new THREE.BoxGeometry(1.9, 3.0, 1.3), fixed(PALETTE.dark), [0, -0.1, 0]);
    const units: THREE.Mesh[] = [];
    for (let i = 0; i < 7; i += 1) {
      units.push(put(new THREE.BoxGeometry(1.7, 0.26, 0.08), mat, [0, 1.05 - i * 0.36, 0.66]));
    }
    const leds: THREE.Mesh[] = [];
    for (let i = 0; i < 7; i += 1) {
      leds.push(
        put(
          new THREE.SphereGeometry(0.045, 10, 8),
          new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0x6ee7a8 : 0x38bdf8 }),
          [0.7, 1.05 - i * 0.36, 0.72],
        ),
      );
    }
    const cloud = put(new THREE.SphereGeometry(0.55, 20, 14), fixed(0x9ec9e8, { roughness: 0.4 }), [1.8, 1.5, 0]);
    const cloud2 = put(new THREE.SphereGeometry(0.38, 18, 12), fixed(0x9ec9e8, { roughness: 0.4 }), [2.35, 1.32, 0.1]);
    const linkA = put(
      new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
      [1.15, 1.0, 0.3],
      [0, 0, -0.8],
    );
    g.add(rack, cloud, cloud2, linkA, ...units, ...leds);
    return { group: g, themed: units };
  },

  /* アパレル：トルソーに掛けた衣服 */
  garment: (mat) => {
    const g = new THREE.Group();
    const stand = put(new THREE.CylinderGeometry(0.6, 0.75, 0.1, 28), fixed(PALETTE.dark), [0, -1.75, 0]);
    const pole = put(new THREE.CylinderGeometry(0.07, 0.07, 1.1, 12), fixed(PALETTE.dark), [0, -1.2, 0]);
    const torso = put(
      lathe([
        [0, -0.75],
        [0.52, -0.7],
        [0.44, -0.2],
        [0.58, 0.35],
        [0.5, 0.78],
        [0.24, 0.95],
        [0, 0.97],
      ]),
      mat,
    );
    const neck = put(new THREE.CylinderGeometry(0.16, 0.22, 0.34, 20), fixed(PALETTE.light), [0, 1.1, 0]);
    const shoulderL = put(new THREE.SphereGeometry(0.2, 16, 12), mat, [-0.45, 0.78, 0]);
    const shoulderR = put(new THREE.SphereGeometry(0.2, 16, 12), mat, [0.45, 0.78, 0]);
    const skirt = put(
      new THREE.ConeGeometry(0.95, 1.2, 32, 1, true),
      fixed(PALETTE.fabric, { side: THREE.DoubleSide, roughness: 0.85 }),
      [0, -1.15, 0],
    );
    const rail = put(
      new THREE.CylinderGeometry(0.04, 0.04, 2.6, 12),
      fixed(0xb8bec9, { metalness: 0.8 }),
      [1.9, 0.9, 0],
      [Math.PI / 2, 0, 0],
    );
    g.add(stand, pole, torso, neck, shoulderL, shoulderR, skirt, rail);
    return { group: g, themed: [torso, shoulderL, shoulderR] };
  },
};

/* ------------------------------------------------------------------
 * 組み立て
 * ---------------------------------------------------------------- */

/** 三角形の数を数える（デモの性能表示に使う） */
function countTriangles(group: THREE.Group): number {
  let n = 0;
  group.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const geo = mesh.geometry;
    const idx = geo.getIndex();
    n += idx ? idx.count / 3 : geo.getAttribute("position").count / 3;
  });
  return Math.round(n);
}

/**
 * 職種別モデルを組み立てる。
 * @param key   職種のモデル種別
 * @param themedMaterial 素材・カラー切り替えの対象になる素材（デモ側が差し替える）
 */
export function createIndustryModel(
  key: IndustryModelKey,
  themedMaterial: THREE.Material,
): IndustryModel {
  const { group, themed } = BUILDERS[key](themedMaterial);
  group.scale.setScalar(0.95);

  return {
    group,
    themed,
    triangles: countTriangles(group),
    dispose: () => {
      group.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry.dispose();
        // 切り替え対象の素材はデモ側が管理しているので、ここでは破棄しない
        if (!themed.includes(mesh)) {
          const m = mesh.material;
          if (Array.isArray(m)) m.forEach((x) => x.dispose());
          else m.dispose();
        }
      });
    },
  };
}
