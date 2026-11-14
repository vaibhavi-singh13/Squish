/* SQUISH 3D! — Bounce Back Adventure
   A 3D remake of the 2D canvas platformer, built with Three.js. */
(function () {
"use strict";

const T = window.THREE;
const $ = (id) => document.getElementById(id);
if (!T) {
  document.body.innerHTML = '<p style="font-family:Nunito,sans-serif;padding:40px">Three.js failed to load from vendor/three.min.js</p>';
  return;
}

/* ------------------------------------------------------------------ *
 *  CONTENT
 * ------------------------------------------------------------------ */
const WORLDS = [
  { name: "SLIME FOREST", short: "Slime Forest", icon: "🌳", desc: "Bouncy branches and friendly forest critters.",
    sky: 0xbfeaff, fog: 0xdff6ff, ground: 0x63c187, soil: 0x3f8f5e, top: 0x9be8b9,
    accent: 0x3fa86d, spike: 0x53606e, prop: "trees" },
  { name: "CANDY KINGDOM", short: "Candy Kingdom", icon: "🍬", desc: "Sticky sweets, gumdrop hills and sugary surprises.",
    sky: 0xffd9eb, fog: 0xffeef6, ground: 0xf4a6c8, soil: 0xd8809f, top: 0xffc3dd,
    accent: 0xdf6c9d, spike: 0xf3f0f7, prop: "candy" },
  { name: "FROZEN MOUNTAINS", short: "Frozen Mountains", icon: "❄️", desc: "Slippery slopes and icy platforms.",
    sky: 0xc7e7ff, fog: 0xeaf7ff, ground: 0xa3d8ef, soil: 0x74a9c4, top: 0xd6f1ff,
    accent: 0x64b5df, spike: 0xdff4ff, prop: "ice", slippery: true },
  { name: "LAVA LAND", short: "Lava Land", icon: "🌋", desc: "Hot jumps, fireballs and brave bounces.",
    sky: 0xffcfad, fog: 0xffe2c6, ground: 0x8a4436, soil: 0x54251f, top: 0xb06046,
    accent: 0xf18a48, spike: 0xff7a3c, prop: "lava" },
  { name: "SKY KINGDOM", short: "Sky Kingdom", icon: "☁️", desc: "Cloud platforms and one final showdown.",
    sky: 0xb7c8ff, fog: 0xe8e6ff, ground: 0xaaa4ed, soil: 0x7a72c4, top: 0xd2cdfa,
    accent: 0x776bd1, spike: 0xded9ff, prop: "sky" }
];

// [x, surfaceHeight, width] — surface heights need a charged jump above ~4.1
const LEVELS = [
  { name: "First Bounce", length: 150, goal: 142,
    plats: [[11,3.0,6],[23,4.2,6],[35,3.0,7],[50,4.4,6],[64,3.2,6],[79,4.2,7],[95,3.0,6],[110,4.2,6],[124,3.2,6]],
    hazards: [[17,3],[43,3],[70,3.2],[90,3.6],[118,3]],
    crystals: [[11,4.8],[23,6.0],[35,4.8],[50,6.2],[64,5.0],[79,6.0],[95,4.8],[110,6.0],[124,5.0]],
    enemies: [[30,26,40],[60,52,75],[100,92,112]] },
  { name: "Gummy Gap", length: 166, goal: 157,
    plats: [[12,3.4,6],[24,5.4,5],[38,3.4,7],[52,5.0,6],[66,3.2,6],[80,5.6,5],[94,3.6,6],[108,4.8,6],[122,3.2,6],[136,5.2,5]],
    hazards: [[19,3.4],[46,3.4],[74,3.4],[102,3.4],[130,3]],
    crystals: [[12,5.2],[24,7.2],[38,5.2],[52,6.8],[66,5.0],[80,7.4],[94,5.4],[108,6.6],[122,5.0],[136,7.0]],
    enemies: [[33,28,44],[70,60,86],[116,108,128]] },
  { name: "Ice, Ice, Baby", length: 180, goal: 170,
    plats: [[12,3.2,6],[26,4.6,5],[40,3.4,6],[54,5.2,5],[68,3.6,6],[82,4.8,5],[96,3.4,6],[110,5.4,5],[124,3.6,6],[138,4.6,5]],
    hazards: [[20,3],[48,3],[76,3.2],[104,3.2],[132,3]],
    crystals: [[12,5.0],[26,6.4],[40,5.2],[54,7.0],[68,5.4],[82,6.6],[96,5.2],[110,7.2],[124,5.4],[138,6.4]],
    enemies: [[33,28,46],[90,84,104],[150,142,162]] },
  { name: "Hot Stuff", length: 194, goal: 184,
    plats: [[12,3.4,6],[26,5.0,5],[40,3.4,6],[54,5.4,5],[68,3.6,6],[82,5.0,5],[96,3.4,6],[110,5.6,5],[124,3.6,6],[138,5.0,5],[152,3.4,6]],
    hazards: [[19,4],[47,4],[75,4],[103,4],[131,4],[160,3]],
    crystals: [[12,5.2],[26,6.8],[40,5.2],[54,7.2],[68,5.4],[82,6.8],[96,5.2],[110,7.4],[124,5.4],[138,6.8]],
    enemies: [[33,28,44],[62,56,72],[90,84,100],[145,140,158]] },
  { name: "Crusher's Castle", length: 178, goal: 166,
    plats: [[13,3.2,6],[27,4.8,5],[41,3.4,7],[56,5.2,5],[70,3.6,6],[85,4.8,5],[100,3.4,6],[115,5.0,5],[130,3.6,6]],
    hazards: [[21,3],[50,3],[78,3],[107,3],[136,3]],
    crystals: [[13,5.0],[27,6.6],[41,5.2],[56,7.0],[70,5.4],[85,6.6],[100,5.2],[115,6.8],[130,5.4]],
    enemies: [[35,30,46],[94,88,104]],
    boss: 150 }
];

/* ------------------------------------------------------------------ *
 *  STATE
 * ------------------------------------------------------------------ */
const screens = ["menu", "levels", "gameScreen", "story"];
let currentWorld = 0, gameState = "menu", soundOn = true, keys = {}, last = 0, toastTimer = 0;
let totalCrystals = Number(localStorage.getItem("squishCrystals") || 0);
let unlocked = Number(localStorage.getItem("squishUnlocked") || 0);
let worldCrystals = JSON.parse(localStorage.getItem("squishWorldCrystals") || "{}");

const PLAYER_R = 0.95, PLAYER_H = 2.05;
const GRAV = 72, JUMP = 24.5, JUMP_CHARGED = 31.5, MAX_SPEED = 14;
const CLAMP = (v, a, b) => Math.max(a, Math.min(b, v));

let player = { x: 5, y: 0, vx: 0, vy: 0, onGround: true, squish: 0, energy: 0, invuln: 0, stretch: 0, face: 1 };
let coins = [], enemies = [], particles = [], boss = null;
let levelData = null, levelLength = 0, collected = 0, lives = 3, levelWon = false;
let pip = null, pipInner = null, pipRing = null, camShake = 0, particlesCursor = 0;

/* ------------------------------------------------------------------ *
 *  AUDIO
 * ------------------------------------------------------------------ */
let audioCtx = null;
function beep(freq, dur, type) {
  if (!soundOn) return;
  dur = dur || 0.08;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = type || "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.06, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + dur);
  } catch (e) { /* audio is optional */ }
}

/* ------------------------------------------------------------------ *
 *  THREE SET-UP
 * ------------------------------------------------------------------ */
const canvas = $("game");
const renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = T.PCFSoftShadowMap;
if ("outputColorSpace" in renderer) renderer.outputColorSpace = T.SRGBColorSpace;

const scene = new T.Scene();
const camera = new T.PerspectiveCamera(48, 16 / 9, 0.1, 320);
const stage = new T.Group();
scene.add(stage);

const hemi = new T.HemisphereLight(0xffffff, 0x7a9a88, 1.15);
scene.add(hemi);
scene.add(new T.AmbientLight(0xffffff, 0.3));

const sun = new T.DirectionalLight(0xfff5e2, 2.05);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.bias = -0.0007;
sun.shadow.normalBias = 0.035;
const shadowCam = sun.shadow.camera;
shadowCam.left = -28; shadowCam.right = 28; shadowCam.top = 26; shadowCam.bottom = -20;
shadowCam.near = 1; shadowCam.far = 150;
shadowCam.updateProjectionMatrix();
scene.add(sun);
scene.add(sun.target);

const camLook = new T.Vector3(4, 2, 0);
const tmpVec = new T.Vector3();

/* ------------------------------------------------------------------ *
 *  HELPERS
 * ------------------------------------------------------------------ */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function mat(color, o) {
  o = o || {};
  return new T.MeshStandardMaterial({
    color: color,
    roughness: o.roughness === undefined ? 0.8 : o.roughness,
    metalness: o.metalness === undefined ? 0.03 : o.metalness,
    emissive: o.emissive === undefined ? 0x000000 : o.emissive,
    emissiveIntensity: o.emissiveIntensity === undefined ? 1 : o.emissiveIntensity,
    flatShading: !!o.flat,
    transparent: !!o.transparent,
    opacity: o.opacity === undefined ? 1 : o.opacity
  });
}
function box(w, h, d, color, o) {
  const m = new T.Mesh(new T.BoxGeometry(w, h, d), mat(color, o));
  m.castShadow = true; m.receiveShadow = true;
  return m;
}
function clearStage() {
  stage.traverse(function (o) {
    if (o.isMesh) {
      if (o.geometry) o.geometry.dispose();
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach(function (m) { if (m) m.dispose(); });
    }
  });
  stage.clear();
  coins = []; enemies = []; particles = []; boss = null; pip = null; pipInner = null; pipRing = null;
  particlesCursor = 0;
}

/* ------------------------------------------------------------------ *
 *  BUILDERS
 * ------------------------------------------------------------------ */
function buildPip() {
  const g = new T.Group();
  const inner = new T.Group();
  g.add(inner);

  const body = new T.Mesh(new T.SphereGeometry(1.05, 40, 28),
    mat(0x6fe08a, { roughness: 0.35, metalness: 0.02 }));
  body.scale.set(1.02, 0.93, 1);
  body.castShadow = true;
  inner.add(body);

  // glossy highlight
  const shine = new T.Mesh(new T.SphereGeometry(0.3, 16, 12),
    mat(0xffffff, { roughness: 0.2, transparent: true, opacity: 0.42 }));
  shine.scale.set(1.5, 0.65, 0.5);
  shine.position.set(-0.42, 0.46, 0.82);
  shine.rotation.z = 0.5;
  inner.add(shine);

  const white = mat(0xffffff, { roughness: 0.25 });
  const dark = mat(0x1d3b3f, { roughness: 0.3 });
  [-0.4, 0.4].forEach(function (x) {
    const eye = new T.Mesh(new T.SphereGeometry(0.24, 18, 14), white);
    eye.scale.set(0.95, 1.1, 0.6);
    eye.position.set(x, 0.18, 0.9);
    inner.add(eye);
    const pupil = new T.Mesh(new T.SphereGeometry(0.12, 14, 10), dark);
    pupil.position.set(x, 0.17, 1.03);
    inner.add(pupil);
  });

  const mouth = new T.Mesh(new T.TorusGeometry(0.27, 0.06, 8, 22, Math.PI), dark);
  mouth.position.set(0, -0.16, 1.0);
  mouth.rotation.z = Math.PI;
  mouth.rotation.x = 0.2;
  inner.add(mouth);

  const ring = new T.Mesh(new T.TorusGeometry(1.42, 0.1, 8, 44),
    mat(0xfff3a1, { emissive: 0xffe066, emissiveIntensity: 1.7, roughness: 0.3 }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -1.0;
  ring.visible = false;
  g.add(ring);

  g.userData.inner = inner;
  g.userData.ring = ring;
  return g;
}

function buildEnemy(color) {
  const g = new T.Group();
  const body = new T.Mesh(new T.SphereGeometry(0.95, 26, 18), mat(color, { roughness: 0.45, flat: true }));
  body.scale.set(1.12, 0.98, 1.08);
  body.position.y = 0.98;
  body.castShadow = true;
  g.add(body);
  const dark = mat(0x27384b, { roughness: 0.3 });
  [-0.32, 0.32].forEach(function (x) {
    const eye = new T.Mesh(new T.SphereGeometry(0.16, 12, 10), dark);
    eye.position.set(x, 1.12, 0.94);
    g.add(eye);
  });
  const mouth = new T.Mesh(new T.TorusGeometry(0.18, 0.045, 6, 16, Math.PI), dark);
  mouth.position.set(0, 0.92, 0.96);
  mouth.rotation.z = Math.PI;
  g.add(mouth);
  [-0.45, 0.45].forEach(function (x) {
    const foot = new T.Mesh(new T.SphereGeometry(0.3, 12, 8), mat(color, { roughness: 0.5 }));
    foot.scale.set(1, 0.55, 1.2);
    foot.position.set(x, 0.16, 0.2);
    foot.castShadow = true;
    g.add(foot);
  });
  g.userData.body = body;
  return g;
}

function buildBoss() {
  const g = new T.Group();
  const body = new T.Mesh(new T.SphereGeometry(2.3, 34, 24), mat(0x67556f, { roughness: 0.55 }));
  body.scale.set(1.05, 1.08, 1);
  body.position.y = 2.45;
  body.castShadow = true;
  g.add(body);
  // crown of spikes
  for (let i = 0; i < 5; i++) {
    const spike = new T.Mesh(new T.ConeGeometry(0.42, 1.1, 7), mat(0x4b3d55, { flat: true }));
    const a = -0.7 + i * 0.35;
    spike.position.set(Math.sin(a) * 2.0, 4.3 + Math.cos(a) * 0.25, Math.cos(a) * -0.2);
    spike.rotation.z = -Math.sin(a) * 0.6;
    spike.castShadow = true;
    g.add(spike);
  }
  const white = mat(0xf9d4ea, { roughness: 0.3 });
  const dark = mat(0x2e2638, { roughness: 0.25 });
  [-0.75, 0.75].forEach(function (x) {
    const eye = new T.Mesh(new T.SphereGeometry(0.5, 20, 14), white);
    eye.scale.set(1, 1.15, 0.7);
    eye.position.set(x, 2.85, 2.0);
    g.add(eye);
    const pupil = new T.Mesh(new T.SphereGeometry(0.2, 14, 10), dark);
    pupil.position.set(x, 2.8, 2.3);
    g.add(pupil);
  });
  const brow = new T.Mesh(new T.BoxGeometry(2.2, 0.22, 0.3), dark);
  brow.position.set(0, 3.55, 2.0);
  brow.rotation.z = 0.12;
  g.add(brow);
  g.userData.body = body;
  return g;
}

function buildCrystal(color) {
  const g = new T.Group();
  const core = new T.Mesh(new T.OctahedronGeometry(0.62, 0), mat(color, {
    roughness: 0.18, metalness: 0.35, emissive: color, emissiveIntensity: 0.7
  }));
  core.castShadow = true;
  g.add(core);
  const halo = new T.Mesh(new T.SphereGeometry(1.0, 16, 12),
    mat(0xffffff, { transparent: true, opacity: 0.13, emissive: color, emissiveIntensity: 0.9, roughness: 0.4 }));
  g.add(halo);
  return g;
}

function buildGoal(color) {
  const g = new T.Group();
  const ring = new T.Mesh(new T.TorusGeometry(2.05, 0.22, 12, 44),
    mat(0xffffff, { emissive: color, emissiveIntensity: 0.8, roughness: 0.3, metalness: 0.2 }));
  ring.position.y = 2.7;
  ring.castShadow = true;
  g.add(ring);
  const inner = new T.Mesh(new T.CircleGeometry(1.85, 32),
    mat(color, { transparent: true, opacity: 0.32, emissive: color, emissiveIntensity: 0.7, roughness: 0.4 }));
  inner.position.set(0, 2.7, -0.05);
  g.add(inner);
  [-1, 1].forEach(function (s) {
    const post = box(0.28, 2.6, 0.28, 0xf2f4ff, { roughness: 0.5 });
    post.position.set(s * 2.2, 1.3, 0);
    g.add(post);
  });
  const pad = box(5.2, 0.25, 3.6, 0xffffff, { roughness: 0.45, emissive: color, emissiveIntensity: 0.18 });
  pad.position.set(0, 0.13, 0);
  g.add(pad);
  g.userData.ring = ring;
  return g;
}

/* --------------- scenery --------------- */
function addTrees(g, len, rnd) {
  for (let x = 4; x < len; x += 7 + rnd() * 7) {
    const z = -6 - rnd() * 7;
    const s = 0.7 + rnd() * 0.6;
    const trunk = new T.Mesh(new T.CylinderGeometry(0.22 * s, 0.34 * s, 2.2 * s, 7), mat(0x8a6144, { flat: true }));
    trunk.position.set(x, 1.1 * s, z);
    trunk.castShadow = true;
    g.add(trunk);
    for (let k = 0; k < 3; k++) {
      const cone = new T.Mesh(new T.ConeGeometry((1.55 - k * 0.36) * s, 1.8 * s, 8),
        mat(k === 1 ? 0x54b97e : 0x3fa86d, { flat: true }));
      cone.position.set(x, (2.5 + k * 0.95) * s, z);
      cone.castShadow = true;
      g.add(cone);
    }
  }
  for (let x = 9; x < len; x += 11 + rnd() * 9) {
    const bush = new T.Mesh(new T.SphereGeometry(0.55 + rnd() * 0.35, 10, 8), mat(0x63c187, { flat: true }));
    bush.scale.set(1.3, 0.7, 1.1);
    bush.position.set(x, 0.42, -2.6 - rnd() * 3.5);
    bush.castShadow = true;
    g.add(bush);
  }
}

function addCandy(g, len, rnd) {
  for (let x = 5; x < len; x += 7 + rnd() * 6) {
    const z = -3.4 - rnd() * 6;
    const s = 0.85 + rnd() * 0.6;
    const pole = new T.Mesh(new T.CylinderGeometry(0.2 * s, 0.2 * s, 3.2 * s, 10), mat(0xfff3f8, { roughness: 0.5 }));
    pole.position.set(x, 1.6 * s, z);
    pole.castShadow = true;
    g.add(pole);
    const ball = new T.Mesh(new T.SphereGeometry(0.85 * s, 18, 14), mat(0xff6b9a, { roughness: 0.3 }));
    ball.position.set(x, 3.5 * s, z);
    ball.castShadow = true;
    g.add(ball);
    const swirl = new T.Mesh(new T.TorusGeometry(0.6 * s, 0.12 * s, 6, 20), mat(0xffffff, { roughness: 0.35 }));
    swirl.position.set(x, 3.5 * s, z + 0.5 * s);
    g.add(swirl);
  }
  for (let x = 8; x < len; x += 9 + rnd() * 8) {
    const drop = new T.Mesh(new T.SphereGeometry(0.9 + rnd() * 0.5, 16, 12),
      mat([0xffd166, 0x8de7c1, 0xff9ec4][Math.floor(rnd() * 3)], { roughness: 0.28 }));
    drop.scale.set(1.1, 0.8, 1);
    drop.position.set(x, 0.6, -1.8 - rnd() * 3.8);
    drop.castShadow = true;
    g.add(drop);
  }
}

function addIce(g, len, rnd) {
  for (let x = 4; x < len; x += 6 + rnd() * 7) {
    const z = -3 - rnd() * 7;
    const s = 1 + rnd() * 1.6;
    const shard = new T.Mesh(new T.ConeGeometry(0.55 * s, 3.2 * s, 5), mat(0xd6f1ff, { flat: true, roughness: 0.22, metalness: 0.15 }));
    shard.position.set(x, 1.6 * s, z);
    shard.rotation.z = (rnd() - 0.5) * 0.35;
    shard.castShadow = true;
    g.add(shard);
  }
  for (let x = 10; x < len; x += 12 + rnd() * 10) {
    const mound = new T.Mesh(new T.SphereGeometry(1.6 + rnd(), 12, 8), mat(0xeaf7ff, { flat: true, roughness: 0.5 }));
    mound.scale.set(1.4, 0.5, 1.1);
    mound.position.set(x, 0.3, -2.6 - rnd() * 4);
    mound.receiveShadow = true;
    g.add(mound);
  }
}

function addLava(g, len, rnd) {
  for (let x = 4; x < len; x += 6 + rnd() * 7) {
    const z = -3.2 - rnd() * 6.5;
    const s = 0.8 + rnd() * 1.1;
    const rock = new T.Mesh(new T.DodecahedronGeometry(0.9 * s, 0), mat(0x3d2a26, { flat: true, roughness: 0.95 }));
    rock.position.set(x, 0.5 * s, z);
    rock.scale.set(1.2, 0.8, 1);
    rock.castShadow = true;
    g.add(rock);
  }
  for (let x = 8; x < len; x += 10 + rnd() * 9) {
    const pool = new T.Mesh(new T.BoxGeometry(2.6 + rnd() * 2, 0.12, 1.8),
      mat(0xff7a3c, { emissive: 0xff5a1f, emissiveIntensity: 1.3, roughness: 0.4 }));
    pool.position.set(x, 0.06, -2.2 - rnd() * 4);
    g.add(pool);
  }
}

function addSky(g, len, rnd) {
  for (let x = 6; x < len; x += 7 + rnd() * 8) {
    const z = -5 - rnd() * 12;
    const y = 3 + rnd() * 7;
    const cluster = new T.Group();
    for (let i = 0; i < 4; i++) {
      const puff = new T.Mesh(new T.SphereGeometry(0.9 + rnd() * 0.9, 14, 10),
        mat(0xffffff, { roughness: 0.6, emissive: 0xdfe6ff, emissiveIntensity: 0.25 }));
      puff.position.set((i - 1.5) * 1.2, rnd() * 0.7, rnd() * 0.7);
      cluster.add(puff);
    }
    cluster.position.set(x, y, z);
    g.add(cluster);
  }
  for (let x = 9; x < len; x += 13 + rnd() * 10) {
    const pillar = box(1.4, 3 + rnd() * 2, 1.4, 0xd2cdfa, { roughness: 0.5 });
    pillar.position.set(x, 1.6, -3 - rnd() * 5);
    g.add(pillar);
  }
}

function addBackdrop(g, len, W, rnd) {
  // big soft hills far behind the action
  for (let x = -6; x < len + 20; x += 16 + rnd() * 8) {
    const hill = new T.Mesh(new T.SphereGeometry(9 + rnd() * 6, 16, 12),
      mat(W.accent, { flat: true, roughness: 0.95 }));
    hill.scale.set(1.4, 0.55, 1);
    hill.position.set(x, -1.5 - rnd() * 2, -26 - rnd() * 8);
    g.add(hill);
  }
  // clouds
  for (let x = 0; x < len + 20; x += 11 + rnd() * 10) {
    const c = new T.Group();
    for (let i = 0; i < 3; i++) {
      const p = new T.Mesh(new T.SphereGeometry(1.6 + rnd(), 12, 9),
        mat(0xffffff, { roughness: 0.7, emissive: 0xffffff, emissiveIntensity: 0.12 }));
      p.position.set(i * 2.2 - 2.2, rnd() * 0.8, 0);
      c.add(p);
    }
    c.position.set(x, 15 + rnd() * 9, -34 - rnd() * 10);
    g.add(c);
  }
}

/* ------------------------------------------------------------------ *
 *  LEVEL BUILD
 * ------------------------------------------------------------------ */
function buildStage() {
  const W = WORLDS[currentWorld];
  const L = LEVELS[currentWorld];
  const rnd = mulberry32(9137 + currentWorld * 517);

  scene.background = new T.Color(W.sky);
  scene.fog = new T.Fog(W.fog, 48, 132);
  hemi.color.setHex(W.sky);
  hemi.groundColor.setHex(W.ground);

  addBackdrop(stage, L.length, W, rnd);

  // ground
  const gLen = L.length + 16;
  const soil = box(gLen, 3, 46, W.soil, { roughness: 0.95 });
  soil.position.set(L.length / 2, -1.5, 0);
  stage.add(soil);
  const turf = box(gLen, 0.4, 46, W.ground, { roughness: 0.85 });
  turf.position.set(L.length / 2, -0.2, 0);
  stage.add(turf);
  const lip = box(gLen, 0.16, 46, W.top, { roughness: 0.8 });
  lip.position.set(L.length / 2, 0.02, 0);
  stage.add(lip);

  // grass tufts along the lane
  for (let x = 3; x < L.length; x += 2.4 + rnd() * 3.4) {
    const tuft = new T.Mesh(new T.ConeGeometry(0.24 + rnd() * 0.16, 0.45 + rnd() * 0.4, 5),
      mat(W.top, { flat: true, roughness: 0.9 }));
    tuft.position.set(x, 0.24, -1.25 - rnd() * 1.2);
    tuft.castShadow = true;
    stage.add(tuft);
  }

  // platforms
  L.plats.forEach(function (p) {
    const x = p[0], y = p[1], w = p[2];
    const body = box(w, 0.8, 4.6, W.accent, { roughness: 0.75 });
    body.position.set(x + w / 2, y - 0.4, 0);
    stage.add(body);
    const plate = box(w + 0.2, 0.16, 4.9, W.top, { roughness: 0.7 });
    plate.position.set(x + w / 2, y - 0.08, 0);
    stage.add(plate);
    // hanging detail
    const stub = box(0.6, 0.5, 1.2, W.accent, { roughness: 0.85 });
    stub.position.set(x + w / 2, y - 1.05, 0);
    stage.add(stub);
  });

  // spikes
  L.hazards.forEach(function (h) {
    const hx = h[0], hw = h[1];
    const count = Math.max(2, Math.round(hw / 1.05));
    for (let i = 0; i < count; i++) {
      for (let row = -1; row <= 1; row++) {
        const spike = new T.Mesh(new T.ConeGeometry(0.4, 1.3, 6),
          currentWorld === 3
            ? mat(W.spike, { flat: true, emissive: 0xff5a1f, emissiveIntensity: 0.85, roughness: 0.4 })
            : mat(W.spike, { flat: true, roughness: 0.45, metalness: 0.25 }));
        spike.position.set(hx + 0.5 + i * (hw / count), 0.65, row * 1.05);
        spike.castShadow = true;
        stage.add(spike);
      }
    }
  });

  // crystals
  L.crystals.forEach(function (c) {
    const m = buildCrystal(0xffd45e);
    m.position.set(c[0], c[1], 0);
    stage.add(m);
    coins.push({ x: c[0], y: c[1], got: false, mesh: m, spin: Math.random() * 6 });
  });

  // enemies
  L.enemies.forEach(function (e) {
    const m = buildEnemy(0xfa7b9f);
    m.position.set(e[0], 0, 0);
    stage.add(m);
    enemies.push({ x: e[0], min: e[1], max: e[2], dir: 1, mesh: m, dead: false, phase: Math.random() * 6 });
  });

  // boss
  if (L.boss) {
    const m = buildBoss();
    m.position.set(L.boss, 0, 0);
    stage.add(m);
    boss = { x: L.boss, min: L.boss - 8, max: L.boss + 8, dir: -1, hp: 3, mesh: m, hit: 0, dead: false, phase: 0 };
    $("bossBar").classList.add("show");
    $("bossFill").style.width = "100%";
  } else {
    $("bossBar").classList.remove("show");
  }

  // goal gate
  const gate = buildGoal(W.accent);
  gate.position.set(L.goal, 0, 0);
  stage.add(gate);
  stage.userData.gate = gate;

  // scenery
  if (W.prop === "trees") addTrees(stage, L.length, rnd);
  else if (W.prop === "candy") addCandy(stage, L.length, rnd);
  else if (W.prop === "ice") addIce(stage, L.length, rnd);
  else if (W.prop === "lava") addLava(stage, L.length, rnd);
  else addSky(stage, L.length, rnd);

  // particles pool
  for (let i = 0; i < 90; i++) {
    const m = new T.Mesh(new T.SphereGeometry(0.13, 6, 5),
      mat(0xffffff, { emissive: 0xffffff, emissiveIntensity: 0.5, roughness: 0.4 }));
    m.visible = false;
    stage.add(m);
    particles.push({ mesh: m, vx: 0, vy: 0, vz: 0, life: 0, max: 1 });
  }

  // player
  pip = buildPip();
  pipInner = pip.userData.inner;
  pipRing = pip.userData.ring;
  pip.position.set(player.x, player.y + 1.0, 0);
  stage.add(pip);
}

function burst(x, y, color, n) {
  for (let i = 0; i < n; i++) {
    const p = particles[particlesCursor++ % particles.length];
    if (!p) continue;
    p.mesh.visible = true;
    p.mesh.position.set(x, y, (Math.random() - 0.5) * 1.2);
    p.mesh.material.color.setHex(color);
    p.mesh.material.emissive.setHex(color);
    p.mesh.scale.setScalar(1);
    p.vx = (Math.random() - 0.5) * 9;
    p.vy = 3 + Math.random() * 8;
    p.vz = (Math.random() - 0.5) * 5;
    p.life = 0.5 + Math.random() * 0.25;
    p.max = p.life;
  }
}

/* ------------------------------------------------------------------ *
 *  GAME FLOW
 * ------------------------------------------------------------------ */
function showScreen(id) {
  screens.forEach(function (s) { $(s).classList.toggle("active", s === id); });
  if (id === "gameScreen") resize();
}
function renderWorlds() {
  const grid = $("worldGrid");
  grid.innerHTML = "";
  WORLDS.forEach(function (w, i) {
    const card = document.createElement("div");
    card.className = "world-card" + (i > unlocked ? " locked" : "");
    const lv = LEVELS[i];
    card.innerHTML = '<div class="world-num">WORLD 0' + (i + 1) + '</div>' +
      '<div class="world-icon">' + w.icon + '</div>' +
      '<h3>' + w.short + '</h3><p>' + w.desc + '</p>' +
      '<div class="stars">' + (worldCrystals[i] || 0) + " / " + lv.crystals.length + " ✦</div>" +
      (i > unlocked ? '<div class="lock">🔒</div>' : '<div class="lock">↗</div>');
    if (i <= unlocked) card.addEventListener("click", function () { startLevel(i); });
    grid.appendChild(card);
  });
  $("crystalTotal").textContent = totalCrystals;
}
function resetPlayer() {
  player = { x: 5, y: 0, vx: 0, vy: 0, onGround: true, squish: 0, energy: 0, invuln: 0, stretch: 0, face: 1 };
  camLook.set(8, 2, 0);
  camera.position.set(9.5, 6.0, 17.5);
}
function startLevel(i) {
  currentWorld = i;
  loadLevel();
  showScreen("gameScreen");
  gameState = "playing";
  keys = {};
  $("pauseOverlay").classList.remove("show");
  $("winOverlay").classList.remove("show");
  $("gameOverOverlay").classList.remove("show");
}
function loadLevel() {
  levelData = LEVELS[currentWorld];
  levelLength = levelData.length;
  resetPlayer();
  collected = 0;
  lives = 3;
  levelWon = false;
  camShake = 0;
  clearStage();
  buildStage();
  $("hudWorld").textContent = WORLDS[currentWorld].name;
  $("hudCrystals").textContent = "0";
  $("hudLives").textContent = lives;
  $("hudProgress").style.width = "0%";
  $("toast").classList.remove("show");
}
function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { t.classList.remove("show"); }, 1300);
}
function restart() {
  loadLevel();
  gameState = "playing";
  $("gameOverOverlay").classList.remove("show");
  $("pauseOverlay").classList.remove("show");
  $("winOverlay").classList.remove("show");
}
function completeLevel() {
  if (levelWon) return;
  levelWon = true;
  gameState = "won";
  const old = worldCrystals[currentWorld] || 0;
  worldCrystals[currentWorld] = Math.max(old, collected);
  localStorage.setItem("squishWorldCrystals", JSON.stringify(worldCrystals));
  $("winTitle").textContent = currentWorld === 4 ? "YOU DID IT, PIP!" : "NICE BOUNCE!";
  $("winText").textContent = currentWorld === 4
    ? "The Crusher's power is gone. The kingdom is bouncing again!"
    : "You made it through " + WORLDS[currentWorld].short + "!";
  $("winCrystals").textContent = "✦ " + collected + " / " + levelData.crystals.length;
  $("nextBtn").textContent = currentWorld === 4 ? "FINISH ADVENTURE" : "NEXT WORLD →";
  $("winOverlay").classList.add("show");
  beep(660, 0.16);
  setTimeout(function () { beep(880, 0.2); }, 120);
}
function nextWorld() {
  if (currentWorld < 4) {
    unlocked = Math.max(unlocked, currentWorld + 1);
    localStorage.setItem("squishUnlocked", unlocked);
    renderWorlds();
    startLevel(currentWorld + 1);
  } else {
    $("winTitle").textContent = "KINGDOM SAVED!";
    $("winText").textContent = "You bounced back, Pip! The Great Bounce Crystal is home.";
    $("nextBtn").textContent = "PLAY AGAIN";
  }
}
function loseLife() {
  if (player.invuln > 0 || gameState !== "playing") return;
  lives--;
  player.invuln = 1.4;
  player.vy = 15;
  player.vx = -player.face * 7;
  player.energy = 0;
  camShake = 0.55;
  $("hudLives").textContent = lives;
  beep(130, 0.2, "sawtooth");
  burst(player.x, player.y + 1, 0x7cf0a6, 12);
  toast("SPLAT! BOUNCE BACK!");
  if (lives <= 0) {
    gameState = "over";
    $("gameOverOverlay").classList.add("show");
  }
}

/* ------------------------------------------------------------------ *
 *  UPDATE
 * ------------------------------------------------------------------ */
function update(dt, time) {
  if (gameState !== "playing") return;
  const L = levelData;
  const left = keys.ArrowLeft || keys.KeyA;
  const right = keys.ArrowRight || keys.KeyD;
  const jump = keys.Space || keys.ArrowUp || keys.KeyW;
  const down = keys.ArrowDown || keys.KeyS;
  const slippery = !!WORLDS[currentWorld].slippery;
  const accel = slippery ? 56 : 86;
  const friction = player.onGround ? (slippery ? 1.5 : 12) : 3;

  if (left) { player.vx -= accel * dt; player.face = -1; }
  if (right) { player.vx += accel * dt; player.face = 1; }
  if (!left && !right) player.vx *= Math.max(0, 1 - friction * dt);
  player.vx = CLAMP(player.vx, -MAX_SPEED, MAX_SPEED);

  // squish to charge a stronger bounce
  if (down && player.onGround) {
    player.squish = Math.min(1, player.squish + dt * 5);
    player.energy = Math.min(1, player.energy + dt * 0.85);
    player.vx *= 0.94;
  } else {
    player.squish = Math.max(0, player.squish - dt * 6);
  }

  if (jump && player.onGround) {
    player.vy = player.energy > 0.55 ? JUMP_CHARGED : JUMP;
    player.onGround = false;
    player.energy = 0;
    player.stretch = 0.24;
    beep(360, 0.09);
    burst(player.x, player.y + 0.2, 0xb4f18b, 5);
  }

  player.vy -= GRAV * dt;
  player.vy = Math.max(player.vy, -55);

  const prevFeet = player.y;
  player.x += player.vx * dt;
  player.x = CLAMP(player.x, PLAYER_R, levelLength - PLAYER_R);
  player.y += player.vy * dt;
  player.onGround = false;

  if (player.y <= 0 && prevFeet >= -0.02) {
    player.y = 0; player.vy = 0; player.onGround = true;
  }
  for (let i = 0; i < L.plats.length; i++) {
    const p = L.plats[i];
    if (player.vy <= 0 && prevFeet >= p[1] - 0.03 && player.y <= p[1] &&
        player.x + PLAYER_R > p[0] && player.x - PLAYER_R < p[0] + p[2]) {
      player.y = p[1]; player.vy = 0; player.onGround = true;
    }
  }
  if (player.y < -8) { player.y = 0; player.vy = 0; loseLife(); }

  if (player.invuln > 0) player.invuln -= dt;
  if (player.stretch > 0) player.stretch -= dt;

  // hazards
  for (let i = 0; i < L.hazards.length; i++) {
    const h = L.hazards[i];
    if (player.y < 1.15 && player.x + PLAYER_R * 0.8 > h[0] && player.x - PLAYER_R * 0.8 < h[0] + h[1]) {
      loseLife();
    }
  }

  // enemies
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    if (e.dead) continue;
    e.x += e.dir * 5.2 * dt;
    if (e.x < e.min || e.x > e.max) e.dir *= -1;
    e.mesh.position.x = e.x;
    e.mesh.position.y = Math.abs(Math.sin(time * 6 + e.phase)) * 0.12;
    e.mesh.rotation.y = e.dir > 0 ? 0 : Math.PI;
    e.mesh.userData.body.scale.y = 0.98 + Math.sin(time * 8 + e.phase) * 0.06;

    const dx = Math.abs(player.x - e.x);
    if (dx < 1.65 && player.y < 1.95) {
      if (player.vy < -1 && player.y > 1.15) {
        e.dead = true;
        e.mesh.visible = false;
        player.vy = 18;
        burst(e.x, 1.2, 0xffb6c9, 12);
        beep(520, 0.1);
      } else {
        loseLife();
      }
    }
  }

  // boss
  if (boss && !boss.dead) {
    boss.x += boss.dir * 2.6 * dt;
    if (boss.x < boss.min || boss.x > boss.max) boss.dir *= -1;
    boss.phase += dt;
    boss.mesh.position.x = boss.x;
    boss.mesh.position.y = Math.abs(Math.sin(boss.phase * 2.4)) * 0.35;
    boss.mesh.rotation.y = boss.dir > 0 ? 0 : Math.PI;
    if (boss.hit > 0) {
      boss.hit -= dt;
      boss.mesh.userData.body.material.emissive.setHex(boss.hit > 0 ? 0xffffff : 0x000000);
      boss.mesh.userData.body.material.emissiveIntensity = 0.7;
    }
    if (Math.abs(player.x - boss.x) < 2.5 && player.y < 4.4) {
      if (player.vy < -1 && player.y > 3.3) {
        boss.hp--;
        boss.hit = 0.35;
        player.vy = 26;
        camShake = 0.5;
        burst(boss.x, 4, 0xffdf75, 18);
        beep(220, 0.15, "square");
        $("bossFill").style.width = Math.max(0, (boss.hp / 3) * 100) + "%";
        if (boss.hp <= 0) {
          boss.dead = true;
          boss.mesh.visible = false;
          $("bossBar").classList.remove("show");
          toast("THE CRUSHER IS DEFEATED!");
          burst(boss.x, 3, 0xf9d4ea, 26);
        }
      } else {
        loseLife();
      }
    }
  }

  // crystals
  for (let i = 0; i < coins.length; i++) {
    const c = coins[i];
    if (c.got) continue;
    const dx = player.x - c.x, dy = player.y + 1.05 - c.y;
    if (dx * dx + dy * dy < 3.3) {
      c.got = true;
      c.mesh.visible = false;
      collected++;
      totalCrystals++;
      localStorage.setItem("squishCrystals", totalCrystals);
      $("hudCrystals").textContent = collected;
      beep(800, 0.07);
      burst(c.x, c.y, 0xffd45e, 8);
    }
  }

  // goal
  if (player.x > L.goal - 0.6 && (!boss || boss.dead)) completeLevel();
}

/* ------------------------------------------------------------------ *
 *  PRESENTATION / ANIMATION
 * ------------------------------------------------------------------ */
function animateScene(dt, time) {
  if (pip) {
    const s = player.squish;
    const stretch = player.stretch > 0 ? 0.2 : 0;
    pip.position.set(player.x, player.y + 1.0, 0);
    pipInner.scale.set(1 + s * 0.22, 1 - s * 0.34 + stretch, 1 + s * 0.22);
    pipInner.rotation.z = CLAMP(-player.vx * 0.012, -0.18, 0.18);
    pipInner.rotation.y = 0;
    // blink while invulnerable
    pip.visible = !(player.invuln > 0 && Math.floor(time * 14) % 2 === 0);
    if (pipRing) {
      const on = player.energy > 0.04;
      pipRing.visible = on && player.onGround;
      if (on) {
        pipRing.scale.setScalar(0.75 + player.energy * 0.35);
        pipRing.rotation.z = time * 2;
        pipRing.material.opacity = 0.45 + player.energy * 0.55;
        pipRing.material.transparent = true;
      }
    }
  }
  for (let i = 0; i < coins.length; i++) {
    const c = coins[i];
    if (c.got) continue;
    c.spin += dt * 1.8;
    c.mesh.rotation.y = c.spin;
    c.mesh.position.y = c.y + Math.sin(time * 2 + c.x) * 0.22;
  }
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    if (p.life <= 0) continue;
    p.life -= dt;
    if (p.life <= 0) { p.mesh.visible = false; continue; }
    p.vy -= 26 * dt;
    p.mesh.position.x += p.vx * dt;
    p.mesh.position.y += p.vy * dt;
    p.mesh.position.z += p.vz * dt;
    p.mesh.scale.setScalar(Math.max(0.1, p.life / p.max));
  }
  const gate = stage.userData.gate;
  if (gate && gate.userData.ring) gate.userData.ring.rotation.z = time * 0.6;

  // sun + shadow frustum follow the action
  sun.position.set(player.x + 16, 34, 22);
  sun.target.position.set(player.x + 4, 0, 0);
  sun.target.updateMatrixWorld();

  // camera
  const desiredX = player.x + 2.2;
  const desiredY = Math.max(4.2, player.y + 4.4);
  const k = 1 - Math.exp(-configCameraSmooth() * dt);
  camera.position.x += (desiredX - camera.position.x) * k;
  camera.position.y += (desiredY - camera.position.y) * k;
  camera.position.z += (16.5 - camera.position.z) * k;
  if (camShake > 0) {
    camShake = Math.max(0, camShake - dt * 1.6);
    camera.position.x += (Math.random() - 0.5) * camShake;
    camera.position.y += (Math.random() - 0.5) * camShake;
  }
  camLook.x += (player.x + 2.8 - camLook.x) * (1 - Math.exp(-7 * dt));
  camLook.y += (player.y + 1.6 - camLook.y) * (1 - Math.exp(-7 * dt));
  camLook.z = 0;
  camera.lookAt(camLook);

  $("hudProgress").style.width = Math.min(100, (player.x / (levelData.goal || 1)) * 100) + "%";
}
function configCameraSmooth() { return 5; }

/* ------------------------------------------------------------------ *
 *  LOOP + RESIZE
 * ------------------------------------------------------------------ */
function resize() {
  const wrap = canvas.parentElement;
  const w = wrap.clientWidth, h = wrap.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
function loop(t) {
  const dt = Math.min(0.033, (t - last) / 1000 || 0);
  last = t;
  if (gameState === "playing") update(dt, t / 1000);
  if (gameState === "playing" || gameState === "paused" || gameState === "won" || gameState === "over") {
    animateScene(dt, t / 1000);
    renderer.render(scene, camera);
  } else {
    // keep the last frame painted behind the menus, but don't burn cycles
  }
  requestAnimationFrame(loop);
}
window.addEventListener("resize", resize);
if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas.parentElement);

/* ------------------------------------------------------------------ *
 *  INPUT + UI
 * ------------------------------------------------------------------ */
function setKey(e, val) {
  const k = e.code;
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(k) !== -1) e.preventDefault();
  keys[k] = val;
}
window.addEventListener("keydown", function (e) {
  setKey(e, true);
  if (e.code === "KeyR" && (gameState === "playing" || gameState === "paused")) restart();
  if ((e.code === "KeyP" || e.code === "Escape") && gameState === "playing") {
    gameState = "paused";
    $("pauseOverlay").classList.add("show");
  } else if (e.code === "KeyP" && gameState === "paused") {
    gameState = "playing";
    $("pauseOverlay").classList.remove("show");
  } else if (e.code === "Enter" && gameState === "menu" && $("menu").classList.contains("active")) {
    showScreen("levels");
  }
});
window.addEventListener("keyup", function (e) { setKey(e, false); });
window.addEventListener("blur", function () { keys = {}; });

$("playBtn").onclick = function () { showScreen("story"); };
$("storyGoBtn").onclick = function () { renderWorlds(); showScreen("levels"); };
document.querySelectorAll("[data-screen]").forEach(function (b) {
  b.onclick = function () { showScreen(b.dataset.screen); };
});
$("exitBtn").onclick = function () {
  gameState = "menu";
  $("pauseOverlay").classList.remove("show");
  showScreen("levels");
  renderWorlds();
};
$("resumeBtn").onclick = function () {
  gameState = "playing";
  $("pauseOverlay").classList.remove("show");
};
$("restartBtn").onclick = restart;
$("retryBtn").onclick = restart;
$("gameOverWorldsBtn").onclick = function () {
  gameState = "menu";
  showScreen("levels");
  renderWorlds();
  $("gameOverOverlay").classList.remove("show");
};
$("worldsBtn").onclick = function () {
  gameState = "menu";
  showScreen("levels");
  renderWorlds();
  $("winOverlay").classList.remove("show");
};
$("nextBtn").onclick = function () {
  if (currentWorld < 4) nextWorld();
  else {
    gameState = "menu";
    showScreen("levels");
    $("winOverlay").classList.remove("show");
    renderWorlds();
  }
};
$("soundBtn").onclick = function () {
  soundOn = !soundOn;
  $("soundBtn").textContent = soundOn ? "♫ SOUND ON" : "♫ SOUND OFF";
};

// touch / pointer controls
document.querySelectorAll(".touch-control").forEach(function (btn) {
  const code = btn.dataset.key;
  const on = function (e) { e.preventDefault(); keys[code] = true; };
  const off = function (e) { e.preventDefault(); keys[code] = false; };
  btn.addEventListener("pointerdown", on);
  btn.addEventListener("pointerup", off);
  btn.addEventListener("pointerleave", off);
  btn.addEventListener("pointercancel", off);
});

/* ------------------------------------------------------------------ *
 *  BOOT
 * ------------------------------------------------------------------ */
renderWorlds();
resize();
requestAnimationFrame(loop);
})();
