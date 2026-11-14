(function () {
    "use strict";

    const $ = (id) => document.getElementById(id);
    const canvas = $("game");
    const ctx = canvas.getContext("2d");
    let c = ctx;

    const WORLDS = [
        {
            name: "SLIME FOREST",
            short: "Slime Forest",
            desc: "Bouncy branches and friendly forest critters.",
            grass: "#67d16f",
            lip: "#9bec72",
            soil: "#b27840",
            pebble: "#8f5a2c",
            plat: "#c98b4b",
            spike: "#6b7788",
            hillFar: "#8fe3a6",
            hillNear: "#52c47c",
            skyDay: "#6ec8ff",
            skyEve: "#ff9a6e",
            skyNight: "#27307a",
            prop: "trees"
        },
        {
            name: "CANDY KINGDOM",
            short: "Candy Kingdom",
            desc: "Sticky sweets, gumdrop hills and sugary surprises.",
            grass: "#ff9ec8",
            lip: "#ffd1e6",
            soil: "#d86aa0",
            pebble: "#b24d84",
            plat: "#7fe3bd",
            spike: "#ffffff",
            hillFar: "#ffc4dd",
            hillNear: "#ff8fbd",
            skyDay: "#ffc4e1",
            skyEve: "#ff9ab4",
            skyNight: "#3a2575",
            prop: "candy"
        },
        {
            name: "FROZEN MOUNTAINS",
            short: "Frozen Mountains",
            desc: "Slippery slopes and icy platforms.",
            grass: "#bfeaff",
            lip: "#effaff",
            soil: "#6fb2d8",
            pebble: "#4f93bb",
            plat: "#8fd0f0",
            spike: "#e8f8ff",
            hillFar: "#d4f0ff",
            hillNear: "#9bd7f5",
            skyDay: "#a8dcff",
            skyEve: "#ffb592",
            skyNight: "#1f3a85",
            prop: "ice",
            slippery: true
        },
        {
            name: "LAVA LAND",
            short: "Lava Land",
            desc: "Hot jumps, fireballs and brave bounces.",
            grass: "#9a4a3a",
            lip: "#c9694a",
            soil: "#4a211c",
            pebble: "#331512",
            plat: "#c2603a",
            spike: "#ff7a3c",
            hillFar: "#e2825a",
            hillNear: "#b34d33",
            skyDay: "#ffb38a",
            skyEve: "#ff6a4a",
            skyNight: "#3b1752",
            prop: "lava"
        },
        {
            name: "SKY KINGDOM",
            short: "Sky Kingdom",
            desc: "Cloud platforms and one final showdown.",
            grass: "#b3acf5",
            lip: "#dcd8ff",
            soil: "#7f77d6",
            pebble: "#6058b8",
            plat: "#9a8ff0",
            spike: "#e8e5ff",
            hillFar: "#cfd8ff",
            hillNear: "#a9b6ff",
            skyDay: "#8fb0ff",
            skyEve: "#ff9fc4",
            skyNight: "#2a2d8a",
            prop: "sky"
        }
    ];

    const LEVELS = [
        {
            name: "First Bounce",
            length: 150,
            goal: 142,
            plats: [
                [11, 3.0, 6],
                [23, 4.2, 6],
                [35, 3.0, 7],
                [50, 4.4, 6],
                [64, 3.2, 6],
                [79, 4.2, 7],
                [95, 3.0, 6],
                [110, 4.2, 6],
                [124, 3.2, 6]
            ],
            hazards: [
                [17, 3],
                [43, 3],
                [70, 3.2],
                [90, 3.6],
                [118, 3]
            ],
            crystals: [
                [11, 4.8],
                [23, 6.0],
                [35, 4.8],
                [50, 6.2],
                [64, 5.0],
                [79, 6.0],
                [95, 4.8],
                [110, 6.0],
                [124, 5.0]
            ],
            enemies: [
                [30, 26, 40],
                [60, 52, 75],
                [100, 92, 112]
            ]
        },
        {
            name: "Gummy Gap",
            length: 166,
            goal: 157,
            plats: [
                [12, 3.4, 6],
                [24, 5.4, 5],
                [38, 3.4, 7],
                [52, 5.0, 6],
                [66, 3.2, 6],
                [80, 5.6, 5],
                [94, 3.6, 6],
                [108, 4.8, 6],
                [122, 3.2, 6],
                [136, 5.2, 5]
            ],
            hazards: [
                [19, 3.4],
                [46, 3.4],
                [74, 3.4],
                [102, 3.4],
                [130, 3]
            ],
            crystals: [
                [12, 5.2],
                [24, 7.2],
                [38, 5.2],
                [52, 6.8],
                [66, 5.0],
                [80, 7.4],
                [94, 5.4],
                [108, 6.6],
                [122, 5.0],
                [136, 7.0]
            ],
            enemies: [
                [33, 28, 44],
                [70, 60, 86],
                [116, 108, 128]
            ]
        },
        {
            name: "Ice, Ice, Baby",
            length: 180,
            goal: 170,
            plats: [
                [12, 3.2, 6],
                [26, 4.6, 5],
                [40, 3.4, 6],
                [54, 5.2, 5],
                [68, 3.6, 6],
                [82, 4.8, 5],
                [96, 3.4, 6],
                [110, 5.4, 5],
                [124, 3.6, 6],
                [138, 4.6, 5]
            ],
            hazards: [
                [20, 3],
                [48, 3],
                [76, 3.2],
                [104, 3.2],
                [132, 3]
            ],
            crystals: [
                [12, 5.0],
                [26, 6.4],
                [40, 5.2],
                [54, 7.0],
                [68, 5.4],
                [82, 6.6],
                [96, 5.2],
                [110, 7.2],
                [124, 5.4],
                [138, 6.4]
            ],
            enemies: [
                [33, 28, 46],
                [90, 84, 104],
                [150, 142, 162]
            ]
        },
        {
            name: "Hot Stuff",
            length: 194,
            goal: 184,
            plats: [
                [12, 3.4, 6],
                [26, 5.0, 5],
                [40, 3.4, 6],
                [54, 5.4, 5],
                [68, 3.6, 6],
                [82, 5.0, 5],
                [96, 3.4, 6],
                [110, 5.6, 5],
                [124, 3.6, 6],
                [138, 5.0, 5],
                [152, 3.4, 6]
            ],
            hazards: [
                [19, 4],
                [47, 4],
                [75, 4],
                [103, 4],
                [131, 4],
                [160, 3]
            ],
            crystals: [
                [12, 5.2],
                [26, 6.8],
                [40, 5.2],
                [54, 7.2],
                [68, 5.4],
                [82, 6.8],
                [96, 5.2],
                [110, 7.4],
                [124, 5.4],
                [138, 6.8]
            ],
            enemies: [
                [33, 28, 44],
                [62, 56, 72],
                [90, 84, 100],
                [145, 140, 158]
            ]
        },
        {
            name: "Crusher's Castle",
            length: 178,
            goal: 166,
            plats: [
                [13, 3.2, 6],
                [27, 4.8, 5],
                [41, 3.4, 7],
                [56, 5.2, 5],
                [70, 3.6, 6],
                [85, 4.8, 5],
                [100, 3.4, 6],
                [115, 5.0, 5],
                [130, 3.6, 6]
            ],
            hazards: [
                [21, 3],
                [50, 3],
                [78, 3],
                [107, 3],
                [136, 3]
            ],
            crystals: [
                [13, 5.0],
                [27, 6.6],
                [41, 5.2],
                [56, 7.0],
                [70, 5.4],
                [85, 6.6],
                [100, 5.2],
                [115, 6.8],
                [130, 5.4]
            ],
            enemies: [
                [35, 30, 46],
                [94, 88, 104]
            ],
            boss: 150
        }
    ];

    const screens = ["menu", "levels", "gameScreen", "story"];
    let currentWorld = 0,
        menuWorld = 0,
        gameState = "menu",
        keys = {},
        last = 0,
        toastTimer = 0;
    let jumpBuffer = 0,
        coyote = 0,
        airJumps = 1;
    const pad = {};
    const touches = new Map();
    const trail = ["menu"];
    let totalCrystals = Number(localStorage.getItem("squishCrystals") || 0);
    let unlocked = Number(localStorage.getItem("squishUnlocked") || 0);
    let worldCrystals = JSON.parse(localStorage.getItem("squishWorldCrystals") || "{}");

    const PLAYER_R = 0.95;
    const GRAV = 72,
        JUMP = 24.5,
        JUMP_CHARGED = 31.5,
        MAX_SPEED = 14;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const lerp = (a, b, t) => a + (b - a) * t;

    function freshPlayer() {
        return {
            x: 5,
            y: 0,
            vx: 0,
            vy: 0,
            onGround: true,
            squish: 0,
            energy: 0,
            invuln: 0,
            stretch: 0,
            face: 1,
            air: 0,
            land: 0,
            hold: 0,
            cut: false
        };
    }
    let player = freshPlayer();
    let coins = [],
        enemies = [],
        particles = [],
        boss = null,
        scenery = null;
    let levelData = null,
        levelLength = 0,
        collected = 0,
        lives = 3,
        levelWon = false;
    let camX = 16,
        camY = 0,
        camShake = 0;
    let clock = 0;
    const DAY_LEN = 90;

    const rgbCache = {};
    function rgb(h) {
        let v = rgbCache[h];
        if (!v) {
            v = [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
            rgbCache[h] = v;
        }
        return v;
    }
    function rgbStr(a) {
        return "rgb(" + Math.round(a[0]) + "," + Math.round(a[1]) + "," + Math.round(a[2]) + ")";
    }
    function lighten(a, t) {
        return [a[0] + (255 - a[0]) * t, a[1] + (255 - a[1]) * t, a[2] + (255 - a[2]) * t];
    }
    function hex2(n) {
        n = Math.max(0, Math.min(255, Math.round(n)));
        return (n < 16 ? "0" : "") + n.toString(16);
    }
    const shCache = {};
    function shade(h, amt) {
        const key = h + amt;
        if (shCache[key]) return shCache[key];
        const a = rgb(h),
            t = Math.abs(amt),
            target = amt > 0 ? 255 : 0;
        const out =
            "#" +
            hex2(a[0] + (target - a[0]) * t) +
            hex2(a[1] + (target - a[1]) * t) +
            hex2(a[2] + (target - a[2]) * t);
        shCache[key] = out;
        return out;
    }

    const DAY_KEYS = [
        [0, 1, 0, 0],
        [0.3, 1, 0, 0],
        [0.46, 0, 1, 0],
        [0.6, 0, 0, 1],
        [0.85, 0, 0, 1],
        [0.93, 0, 1, 0],
        [1, 1, 0, 0]
    ];
    const wt = { d: 1, e: 0, n: 0 };
    let phase = 0.03;
    function updateDayWeights() {
        phase = (0.03 + clock / DAY_LEN) % 1;
        for (let i = 0; i < DAY_KEYS.length - 1; i++) {
            const a = DAY_KEYS[i],
                b = DAY_KEYS[i + 1];
            if (phase >= a[0] && phase <= b[0]) {
                let t = (phase - a[0]) / (b[0] - a[0]);
                t = t * t * (3 - 2 * t);
                wt.d = lerp(a[1], b[1], t);
                wt.e = lerp(a[2], b[2], t);
                wt.n = lerp(a[3], b[3], t);
                return;
            }
        }
    }
    const EVE_TINT = [255, 122, 61],
        NIGHT_TINT = [35, 42, 133];
    let tintCache = {};
    function tinted(h) {
        const a = rgb(h);
        let r = a[0],
            g = a[1],
            b = a[2];
        if (wt.e > 0) {
            const k = 0.22 * wt.e;
            r += (EVE_TINT[0] - r) * k;
            g += (EVE_TINT[1] - g) * k;
            b += (EVE_TINT[2] - b) * k;
        }
        if (wt.n > 0) {
            const k = 0.5 * wt.n;
            r += (NIGHT_TINT[0] - r) * k;
            g += (NIGHT_TINT[1] - g) * k;
            b += (NIGHT_TINT[2] - b) * k;
        }
        return "rgb(" + Math.round(r) + "," + Math.round(g) + "," + Math.round(b) + ")";
    }
    function tintColor(h) {
        return tintCache[h] || (tintCache[h] = tinted(h));
    }
    let tintFn = tintColor;
    const plain = (h) => h;

    let W = 0,
        H = 0,
        dpr = 1,
        ppu = 30,
        OUT = 5,
        groundY = 0;
    function resize() {
        dpr = Math.min(2, window.devicePixelRatio || 1);
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ppu = Math.min(H / 18, W / 20);
        OUT = clamp(ppu * 0.095, 2.5, 6);
        groundY = H * 0.76;
    }
    const sx = (wx) => (wx - camX) * ppu + W / 2;
    const sy = (wy) => groundY - (wy - camY) * ppu;

    function hash(i) {
        const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
        return x - Math.floor(x);
    }
    function mulberry32(a) {
        return function () {
            a |= 0;
            a = (a + 0x6d2b79f5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }
    function roundedRect(x, y, w, h, r) {
        r = Math.min(r, w / 2, h / 2);
        c.moveTo(x + r, y);
        c.arcTo(x + w, y, x + w, y + h, r);
        c.arcTo(x + w, y + h, x, y + h, r);
        c.arcTo(x, y + h, x, y, r);
        c.arcTo(x, y, x + w, y, r);
        c.closePath();
    }
    function paint(fill, lw) {
        c.fillStyle = fill;
        c.fill();
        c.lineWidth = lw || OUT;
        c.strokeStyle = "#000";
        c.lineJoin = "round";
        c.lineCap = "round";
        c.stroke();
    }
    function ellipsePath(x, y, rx, ry, rot) {
        c.beginPath();
        c.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), rot || 0, 0, Math.PI * 2);
    }

    function buildScenery(wi, len) {
        const world = WORLDS[wi],
            rnd = mulberry32(9137 + wi * 517);
        const props = [],
            tufts = [];
        const add = (k, x, s, v) => props.push({ k: k, x: x, s: s, v: v || 0 });
        if (world.prop === "trees") {
            for (let x = 4; x < len; x += 7 + rnd() * 7) add("tree", x, 0.8 + rnd() * 0.7);
            for (let x = 9; x < len; x += 11 + rnd() * 9) add("bush", x, 0.8 + rnd() * 0.6);
        } else if (world.prop === "candy") {
            for (let x = 5; x < len; x += 7 + rnd() * 6)
                add("lolly", x, 0.85 + rnd() * 0.5, Math.floor(rnd() * 3));
            for (let x = 8; x < len; x += 9 + rnd() * 8)
                add("drop", x, 0.8 + rnd() * 0.5, Math.floor(rnd() * 3));
        } else if (world.prop === "ice") {
            for (let x = 4; x < len; x += 6 + rnd() * 7) add("shard", x, 0.8 + rnd() * 1.1, rnd());
            for (let x = 10; x < len; x += 12 + rnd() * 10) add("mound", x, 0.9 + rnd() * 0.7);
        } else if (world.prop === "lava") {
            for (let x = 4; x < len; x += 6 + rnd() * 7) add("rock", x, 0.8 + rnd() * 0.9);
            for (let x = 8; x < len; x += 10 + rnd() * 9) add("pool", x, 0.9 + rnd() * 0.8);
        } else {
            for (let x = 6; x < len; x += 7 + rnd() * 8) add("puff", x, 0.8 + rnd() * 0.6);
            for (let x = 9; x < len; x += 13 + rnd() * 10) add("pillar", x, 0.8 + rnd() * 0.6);
        }
        props.sort((a, b) => a.x - b.x);
        for (let x = 3; x < len; x += 2.4 + rnd() * 3.4) tufts.push({ x: x, h: 0.5 + rnd() * 0.45 });
        return { props: props, tufts: tufts, len: len };
    }
    const hillCache = {},
        menuScenery = {};
    function hillsFor(wi) {
        if (hillCache[wi]) return hillCache[wi];
        const rnd = mulberry32(777 + wi * 31),
            far = [],
            near = [];
        for (let i = 0; i < 7; i++)
            far.push({ x: i * (100 / 7) + rnd() * 5, w: 8 + rnd() * 7, h: 6 + rnd() * 4 });
        for (let i = 0; i < 9; i++)
            near.push({ x: i * (100 / 9) + rnd() * 4, w: 6 + rnd() * 5, h: 3.2 + rnd() * 2.6 });
        hillCache[wi] = { far: far, near: near };
        return hillCache[wi];
    }
    const clouds = [],
        stars = [];
    (function () {
        const r = mulberry32(42);
        for (let i = 0; i < 9; i++)
            clouds.push({ x: r(), y: 0.07 + r() * 0.36, s: 0.65 + r() * 0.9, v: 6 + r() * 16 });
        for (let i = 0; i < 70; i++) stars.push({ x: r(), y: r() * 0.55, s: 0.6 + r() * 0.8, p: r() * 10 });
    })();

    function drawProp(kind, x, g, s, v, u, col) {
        const lw = OUT * 0.9;
        switch (kind) {
            case "tree": {
                c.beginPath();
                roundedRect(x - 0.3 * s * u, g - 2.4 * s * u, 0.6 * s * u, 2.4 * s * u, 3);
                paint(col("#a8693a"), lw);
                for (let k = 0; k < 3; k++) {
                    const w = (1.9 - k * 0.42) * s * u,
                        y0 = g - (1.5 + k * 1.05) * s * u;
                    c.beginPath();
                    c.moveTo(x - w, y0);
                    c.lineTo(x, y0 - 1.95 * s * u);
                    c.lineTo(x + w, y0);
                    c.closePath();
                    paint(col(k === 1 ? "#4fcf7d" : "#37b062"), lw);
                }
                break;
            }
            case "bush": {
                c.beginPath();
                c.moveTo(x - 1.1 * s * u, g);
                c.bezierCurveTo(
                    x - 1.2 * s * u,
                    g - 1.4 * s * u,
                    x + 1.2 * s * u,
                    g - 1.4 * s * u,
                    x + 1.1 * s * u,
                    g
                );
                c.closePath();
                paint(col("#4fcf7d"), lw);
                c.beginPath();
                c.moveTo(x - 0.35 * s * u, g - 0.55 * s * u);
                c.lineTo(x - 0.1 * s * u, g - 0.85 * s * u);
                c.moveTo(x + 0.3 * s * u, g - 0.4 * s * u);
                c.lineTo(x + 0.55 * s * u, g - 0.7 * s * u);
                c.lineWidth = lw * 0.8;
                c.stroke();
                break;
            }
            case "lolly": {
                c.beginPath();
                roundedRect(x - 0.17 * s * u, g - 3.3 * s * u, 0.34 * s * u, 3.3 * s * u, 3);
                paint(col("#ffffff"), lw);
                const cy = g - 3.75 * s * u,
                    r = 0.95 * s * u;
                c.beginPath();
                c.arc(x, cy, r, 0, 7);
                paint(col(["#ff6b9a", "#7fe3bd", "#ffd23f"][v % 3]), lw);
                c.beginPath();
                c.arc(x, cy, r * 0.62, 0.3, 4.6);
                c.lineWidth = lw * 1.6;
                c.strokeStyle = "#000";
                c.stroke();
                c.lineWidth = lw * 0.7;
                c.strokeStyle = "#fff";
                c.stroke();
                break;
            }
            case "drop": {
                c.beginPath();
                c.moveTo(x - 1.15 * s * u, g);
                c.bezierCurveTo(
                    x - 1.15 * s * u,
                    g - 1.9 * s * u,
                    x + 1.15 * s * u,
                    g - 1.9 * s * u,
                    x + 1.15 * s * u,
                    g
                );
                c.closePath();
                paint(col(["#ffd23f", "#7fe3bd", "#ff9ec4"][v % 3]), lw);
                c.beginPath();
                c.arc(x - 0.4 * s * u, g - 0.95 * s * u, 0.14 * s * u, 0, 7);
                c.fillStyle = "#fff";
                c.fill();
                break;
            }
            case "shard": {
                const h = 3.3 * s * u,
                    w = 0.8 * s * u,
                    lean = (v - 0.5) * 0.9 * s * u;
                c.beginPath();
                c.moveTo(x - w, g);
                c.lineTo(x + lean, g - h);
                c.lineTo(x + w, g);
                c.closePath();
                paint(col("#bfe9ff"), lw);
                c.beginPath();
                c.moveTo(x - w * 0.8, g - 0.1 * u);
                c.lineTo(x + lean, g - h + 0.2 * u);
                c.lineTo(x - w * 0.1, g - 0.1 * u);
                c.closePath();
                c.fillStyle = col("#effaff");
                c.fill();
                c.beginPath();
                c.moveTo(x - w, g);
                c.lineTo(x + lean, g - h);
                c.lineTo(x + w, g);
                c.closePath();
                c.lineWidth = lw;
                c.strokeStyle = "#000";
                c.stroke();
                break;
            }
            case "mound": {
                c.beginPath();
                c.moveTo(x - 2.2 * s * u, g);
                c.bezierCurveTo(
                    x - 1.8 * s * u,
                    g - 2 * s * u,
                    x + 1.8 * s * u,
                    g - 2 * s * u,
                    x + 2.2 * s * u,
                    g
                );
                c.closePath();
                paint(col("#f3fbff"), lw);
                break;
            }
            case "rock": {
                c.beginPath();
                c.moveTo(x - 1.2 * s * u, g);
                c.lineTo(x - 0.9 * s * u, g - 1.2 * s * u);
                c.lineTo(x - 0.1 * s * u, g - 1.7 * s * u);
                c.lineTo(x + 0.8 * s * u, g - 1.1 * s * u);
                c.lineTo(x + 1.2 * s * u, g);
                c.closePath();
                paint(col("#5a3731"), lw);
                c.beginPath();
                c.moveTo(x - 0.9 * s * u, g - 1.2 * s * u);
                c.lineTo(x - 0.1 * s * u, g - 1.7 * s * u);
                c.lineTo(x + 0.1 * s * u, g - 0.7 * s * u);
                c.closePath();
                c.fillStyle = col("#7a4b43");
                c.fill();
                c.lineWidth = lw * 0.7;
                c.stroke();
                break;
            }
            case "pool": {
                ellipsePath(x, g - 0.05 * u, 1.8 * s * u, 0.34 * s * u);
                paint(col("#ff8c3c"), lw);
                ellipsePath(x, g - 0.05 * u, 1.1 * s * u, 0.16 * s * u);
                c.fillStyle = col("#ffd23f");
                c.fill();
                c.beginPath();
                c.arc(
                    x - 0.5 * s * u,
                    g - 0.5 * s * u - Math.abs(Math.sin(clock * 3 + x)) * 0.3 * u,
                    0.2 * s * u,
                    0,
                    7
                );
                paint(col("#ff8c3c"), lw * 0.7);
                break;
            }
            case "puff": {
                cloudShape(x, g - 0.7 * s * u, 0.8 * s * u, col("#ffffff"));
                break;
            }
            case "pillar": {
                const w = 0.8 * s * u,
                    h = 3.6 * s * u;
                c.beginPath();
                roundedRect(x - w, g - h, w * 2, h, 4);
                paint(col("#d9d4ff"), lw);
                c.beginPath();
                roundedRect(x - w * 1.25, g - h - 0.45 * u, w * 2.5, 0.55 * u, 4);
                paint(col("#b9b1ff"), lw);
                c.beginPath();
                c.moveTo(x - w * 0.3, g - h + 0.3 * u);
                c.lineTo(x - w * 0.3, g - 0.3 * u);
                c.lineWidth = lw * 0.7;
                c.stroke();
                break;
            }
        }
    }

    function cloudShape(cx, cy, s, col) {
        const circ = [
            [-1.05, 0.0, 0.62],
            [-0.35, -0.5, 0.86],
            [0.6, -0.35, 0.8],
            [1.3, 0.05, 0.55]
        ];
        for (let pass = 0; pass < 2; pass++) {
            const e = pass === 0 ? OUT * 0.95 : 0;
            c.fillStyle = pass === 0 ? "#000" : col;
            c.beginPath();
            for (let i = 0; i < circ.length; i++) {
                const q = circ[i],
                    r = q[2] * s + e;
                c.moveTo(cx + q[0] * s + r, cy + q[1] * s);
                c.arc(cx + q[0] * s, cy + q[1] * s, r, 0, Math.PI * 2);
            }
            roundedRect(cx - 1.65 * s - e, cy - 0.15 * s - e, 3.4 * s + e * 2, 0.7 * s + e * 2, 0.35 * s + e);
            c.fill();
        }
    }

    function starPath(x, y, r) {
        c.beginPath();
        for (let i = 0; i < 8; i++) {
            const a = (i * Math.PI) / 4 - Math.PI / 2,
                rr = i % 2 ? r * 0.42 : r;
            c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
        }
        c.closePath();
    }
    function drawSky(Wd) {
        const a = rgb(Wd.skyDay),
            b = rgb(Wd.skyEve),
            n = rgb(Wd.skyNight);
        const base = [
            a[0] * wt.d + b[0] * wt.e + n[0] * wt.n,
            a[1] * wt.d + b[1] * wt.e + n[1] * wt.n,
            a[2] * wt.d + b[2] * wt.e + n[2] * wt.n
        ];
        c.fillStyle = rgbStr(base);
        c.fillRect(0, 0, W, H);
        c.fillStyle = rgbStr(lighten(base, 0.13));
        c.fillRect(0, H * 0.36, W, H);
        c.fillStyle = rgbStr(lighten(base, 0.25));
        c.fillRect(0, H * 0.56, W, H);

        if (wt.n > 0.02) {
            c.globalAlpha = Math.min(1, wt.n * 1.4);
            for (let i = 0; i < stars.length; i++) {
                const s = stars[i],
                    tw = 0.75 + 0.25 * Math.sin(clock * 3 + s.p * 7);
                starPath(s.x * W, s.y * H, ppu * 0.28 * s.s * tw);
                paint("#fff7a8", Math.max(1.5, OUT * 0.4));
            }
            c.globalAlpha = 1;
        }
        const horizon = groundY + ppu * 0.5;
        const sa = (phase + 0.04) / 0.58;
        if (sa > -0.08 && sa < 1.08) {
            const px = W * (0.08 + 0.84 * sa),
                py = horizon - Math.sin(Math.PI * sa) * H * 0.52,
                r = ppu * 2.1;
            const col =
                wt.e > 0 ? rgbStr([255, 210 - 70 * Math.min(1, wt.e * 1.4), 63 - 20 * wt.e]) : "#ffd23f";
            c.fillStyle = col;
            c.beginPath();
            for (let i = 0; i < 12; i++) {
                const ang = (i * Math.PI) / 6 + clock * 0.25;
                c.moveTo(px + Math.cos(ang - 0.17) * r * 1.2, py + Math.sin(ang - 0.17) * r * 1.2);
                c.lineTo(px + Math.cos(ang) * r * 1.65, py + Math.sin(ang) * r * 1.65);
                c.lineTo(px + Math.cos(ang + 0.17) * r * 1.2, py + Math.sin(ang + 0.17) * r * 1.2);
                c.closePath();
            }
            c.lineWidth = OUT;
            c.strokeStyle = "#000";
            c.lineJoin = "round";
            c.fill();
            c.stroke();
            c.beginPath();
            c.arc(px, py, r, 0, 7);
            paint(col);
            c.beginPath();
            c.arc(px - r * 0.35, py - r * 0.35, r * 0.2, 0, 7);
            c.fillStyle = "rgba(255,255,255,.7)";
            c.fill();
        }
        const ma = ((((phase - 0.46) % 1) + 1) % 1) / 0.58,
            mAlpha = Math.min(1, wt.n * 1.3 + wt.e * 0.25);
        if (ma < 1.08 && mAlpha > 0.02) {
            const px = W * (0.08 + 0.84 * ma),
                py = horizon - Math.sin(Math.PI * Math.min(1, ma)) * H * 0.5,
                r = ppu * 1.8;
            c.globalAlpha = mAlpha;
            c.beginPath();
            c.arc(px, py, r, 0, 7);
            paint("#fff3b0");
            [
                [-0.35, -0.3, 0.3],
                [0.38, 0.1, 0.22],
                [-0.1, 0.45, 0.17]
            ].forEach(function (q) {
                c.beginPath();
                c.arc(px + q[0] * r, py + q[1] * r, q[2] * r, 0, 7);
                paint("#ecdc8a", OUT * 0.55);
            });
            c.globalAlpha = 1;
        }
        const span = W + 520,
            col = tintFn("#ffffff");
        for (let i = 0; i < clouds.length; i++) {
            const k = clouds[i],
                s = ppu * 1.25 * k.s;
            const x =
                ((((k.x * span + (clock * k.v * ppu) / 30 - camX * ppu * 0.05) % span) + span) % span) - 260;
            cloudShape(x, H * k.y + Math.sin(clock * 0.5 + i) * 4, s, col);
        }
    }
    function drawHills(Wd, wi) {
        const hs = hillsFor(wi),
            P = 100;
        const layers = [
            [hs.far, 0.12, Wd.hillFar, 0.8],
            [hs.near, 0.32, Wd.hillNear, 0.9]
        ];
        for (let L = 0; L < 2; L++) {
            const arr = layers[L][0],
                par = layers[L][1],
                color = tintFn(layers[L][2]);
            for (let i = 0; i < arr.length; i++) {
                const h = arr[i];
                let u = ((((h.x - camX * par) % P) + P) % P) - P / 2;
                const x = W / 2 + u * ppu,
                    base = groundY + ppu * 1.5,
                    w = h.w * ppu,
                    hh = h.h * ppu;
                if (x + w < -20 || x - w > W + 20) continue;
                c.beginPath();
                c.moveTo(x - w, base);
                c.bezierCurveTo(x - w * 0.6, base - hh * 1.33, x + w * 0.6, base - hh * 1.33, x + w, base);
                c.closePath();
                paint(color, OUT * layers[L][3]);
            }
        }
    }

    function drawGround(Wd, len) {
        const y0 = sy(0);
        if (y0 > H + 4) return;
        const gl = Math.max(camX - W / 2 / ppu - 3, -8),
            gr = Math.min(camX + W / 2 / ppu + 3, len + 12);
        const x0 = sx(gl),
            x1 = sx(gr);
        c.fillStyle = tintFn(Wd.soil);
        c.fillRect(x0, y0, x1 - x0, H - y0 + 6);
        const i0 = Math.floor(gl / 3.1),
            i1 = Math.ceil(gr / 3.1);
        for (let i = i0; i <= i1; i++) {
            const px = sx(i * 3.1 + hash(i) * 2),
                py = y0 + (1.8 + hash(i + 50) * 1.8) * ppu;
            if (py > H) continue;
            ellipsePath(px, py, (0.28 + hash(i + 9) * 0.3) * ppu, (0.18 + hash(i + 3) * 0.14) * ppu);
            paint(tintFn(Wd.pebble), OUT * 0.6);
        }
        const step = 1.4,
            th = 0.95,
            yb = y0 + th * ppu,
            rp = (step / 2) * ppu;
        const a0 = Math.floor(gl / step),
            a1 = Math.ceil(gr / step);
        c.beginPath();
        c.moveTo(sx(a1 * step), y0);
        c.lineTo(sx(a1 * step), yb);
        for (let i = a1 - 1; i >= a0; i--) c.arc(sx(i * step + step / 2), yb, rp, 0, Math.PI, false);
        c.lineTo(sx(a0 * step), y0);
        c.closePath();
        c.fillStyle = tintFn(Wd.grass);
        c.fill();
        c.save();
        c.clip();
        c.fillStyle = tintFn(Wd.lip);
        c.fillRect(x0 - 10, y0, x1 - x0 + 20, 0.3 * ppu);
        c.restore();
        c.lineWidth = OUT * 1.15;
        c.strokeStyle = "#000";
        c.lineJoin = "round";
        c.stroke();
        if (gl <= -7.9) {
            c.beginPath();
            c.moveTo(x0, y0);
            c.lineTo(x0, H);
            c.stroke();
        }
    }
    function tuftsDraw(Wd, tufts) {
        const y0 = sy(0);
        for (let i = 0; i < tufts.length; i++) {
            const t = tufts[i],
                x = sx(t.x);
            if (x < -30 || x > W + 30) continue;
            const h = t.h * ppu,
                w = 0.22 * ppu;
            c.beginPath();
            c.moveTo(x - w * 1.5, y0 + 1);
            c.lineTo(x - w * 0.5, y0 - h);
            c.lineTo(x, y0 - h * 0.45);
            c.lineTo(x + w * 0.5, y0 - h * 0.85);
            c.lineTo(x + w * 1.5, y0 + 1);
            c.closePath();
            paint(tintFn(Wd.lip), OUT * 0.7);
        }
    }
    function drawPlat(p, Wd) {
        const left = sx(p[0]) - 0.1 * ppu,
            wpx = p[2] * ppu + 0.2 * ppu,
            top = sy(p[1]);
        if (left > W + 20 || left + wpx < -20) return;
        const th = 0.42 * ppu,
            bh = 1.05 * ppu;
        c.beginPath();
        roundedRect(left + wpx / 2 - 0.35 * ppu, top + bh - 4, 0.7 * ppu, 0.55 * ppu, 4);
        paint(tintFn(Wd.plat), OUT * 0.9);
        c.beginPath();
        roundedRect(left, top, wpx, bh, 0.3 * ppu);
        c.fillStyle = tintFn(Wd.plat);
        c.fill();
        c.save();
        c.clip();
        c.fillStyle = tintFn(Wd.lip);
        c.fillRect(left - 2, top - 2, wpx + 4, th + 2);
        c.restore();
        c.beginPath();
        c.moveTo(left, top + th);
        c.lineTo(left + wpx, top + th);
        c.lineWidth = OUT * 0.8;
        c.strokeStyle = "#000";
        c.stroke();
        c.beginPath();
        roundedRect(left, top, wpx, bh, 0.3 * ppu);
        c.lineWidth = OUT;
        c.lineJoin = "round";
        c.stroke();
    }
    function drawSpikes(h, Wd) {
        const hx = h[0],
            hw = h[1];
        const count = Math.max(2, Math.round(hw / 1.05)),
            gap = hw / count;
        if (sx(hx) > W + 40 || sx(hx + hw) < -40) return;
        const y0 = sy(0),
            bw = Math.min(1.1, gap * 1.08) * ppu,
            bh = 1.35 * ppu;
        for (let i = 0; i < count; i++) {
            const x = sx(hx + 0.5 + i * gap);
            c.beginPath();
            c.moveTo(x - bw / 2, y0 + 1);
            c.lineTo(x, y0 - bh);
            c.lineTo(x + bw / 2, y0 + 1);
            c.closePath();
            paint(tintFn(Wd.spike));
            c.beginPath();
            c.moveTo(x - bw / 2 + OUT * 0.5, y0 - 1);
            c.lineTo(x, y0 - bh + OUT * 0.9);
            c.lineTo(x, y0 - 1);
            c.closePath();
            c.fillStyle = tintFn(shade(Wd.spike, 0.35));
            c.fill();
            c.beginPath();
            c.moveTo(x - bw / 2, y0 + 1);
            c.lineTo(x, y0 - bh);
            c.lineTo(x + bw / 2, y0 + 1);
            c.closePath();
            c.lineWidth = OUT;
            c.strokeStyle = "#000";
            c.stroke();
        }
    }
    function drawCrystal(cr, time) {
        const x = sx(cr.x),
            y = sy(cr.y) + Math.sin(time * 2 + cr.x) * 0.22 * -ppu;
        if (x < -40 || x > W + 40) return;
        const k = 0.4 + 0.6 * Math.abs(Math.cos(cr.spin)),
            w = 0.62 * ppu * k,
            h = 0.8 * ppu;
        c.beginPath();
        c.moveTo(x, y - h);
        c.lineTo(x + w, y);
        c.lineTo(x, y + h);
        c.lineTo(x - w, y);
        c.closePath();
        paint(tintFn("#ffd23f"));
        c.beginPath();
        c.moveTo(x, y - h * 0.62);
        c.lineTo(x + w * 0.45, y - h * 0.05);
        c.lineTo(x, y + h * 0.1);
        c.lineTo(x - w * 0.45, y - h * 0.05);
        c.closePath();
        c.fillStyle = "#fff6b0";
        c.fill();
        c.beginPath();
        c.moveTo(x, y - h);
        c.lineTo(x + w, y);
        c.lineTo(x, y + h);
        c.lineTo(x - w, y);
        c.closePath();
        c.lineWidth = OUT;
        c.strokeStyle = "#000";
        c.stroke();
    }
    function drawGate(L, Wd, time) {
        const x = sx(L.goal),
            g = sy(0);
        if (x < -200 || x > W + 200) return;
        const u = ppu,
            cy = g - 2.7 * u,
            r = 2.05 * u;
        [-1, 1].forEach(function (s) {
            c.beginPath();
            roundedRect(x + s * 2.2 * u - 0.25 * u, g - 2.6 * u, 0.5 * u, 2.6 * u, 4);
            paint(tintFn("#ffffff"));
        });
        c.beginPath();
        c.arc(x, cy, r, 0, 7);
        c.fillStyle = tintFn(shade(Wd.plat, 0.45));
        c.fill();
        c.beginPath();
        c.arc(x, cy, r, 0, 7);
        c.lineWidth = 0.46 * u + OUT * 2;
        c.strokeStyle = "#000";
        c.stroke();
        c.lineWidth = 0.46 * u;
        c.strokeStyle = tintFn(Wd.plat);
        c.stroke();
        for (let i = 0; i < 8; i++) {
            const a = (i * Math.PI) / 4 + time * 0.8;
            c.beginPath();
            c.arc(x + Math.cos(a) * r, cy + Math.sin(a) * r, 0.17 * u, 0, 7);
            paint(tintFn("#ffd23f"), OUT * 0.7);
        }
        c.beginPath();
        roundedRect(x - 2.6 * u, g - 0.28 * u, 5.2 * u, 0.3 * u, 5);
        paint(tintFn("#ffffff"));
    }

    function blobPath(cx, feet, hw, h, bulge, topPow) {
        const base = feet - bulge,
            N = 56;
        c.beginPath();
        for (let i = 0; i <= N; i++) {
            const a = (Math.PI * i) / N;
            c.lineTo(cx + Math.cos(a) * hw, base - Math.pow(Math.sin(a), topPow) * h);
        }
        for (let i = 1; i < N; i++) {
            const a = Math.PI + (Math.PI * i) / N;
            c.lineTo(cx + Math.cos(a) * hw, base + Math.pow(-Math.sin(a), 0.9) * bulge);
        }
        c.closePath();
    }
    function eyeBall(x, y, rx, ry, dx, dy, lid) {
        ellipsePath(x, y, rx, ry * lid);
        paint("#ffffff", OUT * 0.75);
        const px = x + dx * rx * 0.5,
            py = y + dy * ry * 0.4 * lid,
            pr = rx * 0.52;
        c.beginPath();
        c.ellipse(px, py, pr, Math.max(0.1, pr * Math.min(1, lid * 1.15)), 0, 0, Math.PI * 2);
        c.fillStyle = "#000";
        c.fill();
        if (lid > 0.5) {
            c.beginPath();
            c.arc(px - pr * 0.3, py - pr * 0.35, pr * 0.3, 0, 7);
            c.fillStyle = "#fff";
            c.fill();
        }
    }
    function drawWing(x, y, d, flap, u) {
        c.save();
        c.translate(x, y);
        c.scale(d, 1);
        c.beginPath();
        c.moveTo(0, 0.1 * u);
        c.bezierCurveTo(0.3 * u, (-0.9 + flap) * u, 1.0 * u, (-1.3 + flap) * u, 1.75 * u, (-1.0 + flap) * u);
        c.bezierCurveTo(
            1.4 * u,
            (-0.85 + flap) * u,
            1.35 * u,
            (-0.62 + flap * 0.8) * u,
            1.5 * u,
            (-0.42 + flap * 0.6) * u
        );
        c.bezierCurveTo(
            1.15 * u,
            (-0.42 + flap * 0.5) * u,
            1.05 * u,
            (-0.2 + flap * 0.4) * u,
            1.2 * u,
            (0.0 + flap * 0.3) * u
        );
        c.bezierCurveTo(0.85 * u, -0.02 * u, 0.7 * u, 0.15 * u, 0.5 * u, 0.3 * u);
        c.closePath();
        paint(tintFn("#3fb6f5"), OUT * 0.85);
        c.restore();
    }
    function groundBelow(x, feet) {
        let g = 0;
        const P = levelData ? levelData.plats : [];
        for (let i = 0; i < P.length; i++) {
            const p = P[i];
            if (
                p[1] <= feet + 0.05 &&
                p[1] > g &&
                x + PLAYER_R * 0.5 > p[0] &&
                x - PLAYER_R * 0.5 < p[0] + p[2]
            )
                g = p[1];
        }
        return g;
    }
    function drawSlime(p, time, shadowOn) {
        const x = sx(p.x),
            feet = sy(p.y);
        if (shadowOn) {
            const gh = groundBelow(p.x, p.y),
                d = Math.max(0, p.y - gh);
            c.fillStyle = "rgba(0,0,0,.26)";
            ellipsePath(
                x,
                sy(gh) + 2,
                1.05 * ppu * (1 - Math.min(0.55, d * 0.05)),
                0.2 * ppu * (1 - Math.min(0.5, d * 0.05))
            );
            c.fill();
        }
        if (p.energy > 0.04 && p.onGround) {
            const charged = p.energy > 0.55,
                rr = (1.2 + p.energy * 0.6) * ppu;
            ellipsePath(x, feet + 2, rr, rr * 0.2);
            c.lineWidth = OUT * 1.8;
            c.strokeStyle = "#000";
            c.stroke();
            c.lineWidth = OUT * 0.8;
            c.strokeStyle = charged ? "#ff9d2e" : "#ffe066";
            c.stroke();
        }
        const sq = clamp(p.squish + p.land * 2.4, 0, 1);
        const air = p.air;
        const st = clamp(p.vy / 38, -0.3, 0.38) * air;
        let hw = 1.2 * ppu * (1 + sq * 0.32 - st * 0.55 + (p.stretch > 0 ? -0.05 : 0));
        let h = 1.85 * ppu * (1 - sq * 0.42 + st + (p.stretch > 0 ? 0.12 : 0));
        const bulge = h * (0.07 + air * 0.38);
        const topPow = 0.82 + air * 0.1;

        if (air > 0.5) {
            const flap = Math.sin(time * 34) * 0.32 * (p.vy > 0 ? 1 : 0.5);
            const wy = feet - bulge - h * 0.45;
            drawWing(x - hw * 0.8, wy, -1, flap, ppu);
            drawWing(x + hw * 0.8, wy, 1, flap, ppu);
        }
        const body = "#1b96dc",
            dark = "#0e6fb4";
        blobPath(x, feet, hw, h, bulge, topPow);
        c.fillStyle = tintFn(dark);
        c.fill();
        c.save();
        blobPath(x, feet, hw, h, bulge, topPow);
        c.clip();
        c.fillStyle = tintFn(body);
        c.beginPath();
        c.ellipse(x - hw * 0.14, feet - bulge - h * 0.5, hw * 1.02, (h + bulge) * 0.78, 0, 0, Math.PI * 2);
        c.fill();
        c.restore();
        blobPath(x, feet, hw, h, bulge, topPow);
        c.lineWidth = OUT * 1.15;
        c.strokeStyle = "#000";
        c.lineJoin = "round";
        c.stroke();
        c.save();
        c.translate(x - hw * 0.46, feet - bulge - h * 0.8);
        c.rotate(-0.55);
        c.beginPath();
        c.ellipse(0, 0, hw * 0.28, h * 0.1, 0, 0, Math.PI * 2);
        c.fillStyle = "#8fdcff";
        c.fill();
        c.restore();
        c.beginPath();
        c.arc(x - hw * 0.72, feet - bulge - h * 0.55, h * 0.04, 0, 7);
        c.fillStyle = "#8fdcff";
        c.fill();
        const blink = (time * 0.9) % 3.7 > 3.58 ? 0.12 : 1;
        const lid = Math.max(0.28, 1 - sq * 0.55) * blink;
        const ey = feet - bulge - h * 0.56,
            ex = hw * 0.4,
            er = hw * 0.3;
        const look = clamp(p.face * 0.7 + p.vx * 0.04, -1, 1),
            lookY = p.vy > 3 ? -0.5 : p.vy < -3 ? 0.6 : 0;
        eyeBall(x - ex, ey, er, er * 1.15, look, lookY, lid);
        eyeBall(x + ex, ey, er, er * 1.15, look, lookY, lid);
    }
    function drawEnemy(e, time) {
        const x = sx(e.x),
            feet = sy(0) - Math.abs(Math.sin(time * 6 + e.phase)) * 0.12 * ppu;
        if (x < -120 || x > W + 120) return;
        const wob = Math.sin(time * 8 + e.phase) * 0.06;
        const hw = 1.12 * ppu * (1 - wob),
            h = 1.7 * ppu * (1 + wob);
        blobPath(x, feet, hw, h, 0.1 * ppu, 0.8);
        c.fillStyle = tintFn("#e0457a");
        c.fill();
        c.save();
        blobPath(x, feet, hw, h, 0.1 * ppu, 0.8);
        c.clip();
        c.fillStyle = tintFn("#ff6f9c");
        c.beginPath();
        c.ellipse(x - hw * 0.12, feet - h * 0.5, hw * 1.02, h * 0.78, 0, 0, 7);
        c.fill();
        c.restore();
        blobPath(x, feet, hw, h, 0.1 * ppu, 0.8);
        c.lineWidth = OUT * 1.1;
        c.strokeStyle = "#000";
        c.lineJoin = "round";
        c.stroke();
        c.beginPath();
        c.ellipse(x - hw * 0.45, feet - h * 0.8, hw * 0.24, h * 0.08, -0.5, 0, 7);
        c.fillStyle = "#ffb6cf";
        c.fill();
        const ey = feet - h * 0.52,
            ex = hw * 0.4,
            er = hw * 0.27;
        eyeBall(x - ex, ey, er, er * 1.1, e.dir, 0.3, 1);
        eyeBall(x + ex, ey, er, er * 1.1, e.dir, 0.3, 1);
        c.lineWidth = OUT * 1.1;
        c.strokeStyle = "#000";
        c.lineCap = "round";
        c.beginPath();
        c.moveTo(x - ex - er * 1.2, ey - er * 1.6);
        c.lineTo(x - ex + er * 1.1, ey - er * 0.95);
        c.moveTo(x + ex + er * 1.2, ey - er * 1.6);
        c.lineTo(x + ex - er * 1.1, ey - er * 0.95);
        c.stroke();
        c.beginPath();
        c.moveTo(x - hw * 0.25, feet - h * 0.2);
        c.lineTo(x - hw * 0.08, feet - h * 0.27);
        c.lineTo(x + hw * 0.08, feet - h * 0.2);
        c.lineTo(x + hw * 0.25, feet - h * 0.27);
        c.stroke();
    }
    function drawBoss(b, time) {
        const x = sx(b.x),
            feet = sy(Math.abs(Math.sin(b.phase * 2.4)) * 0.35);
        if (x < -300 || x > W + 300) return;
        const hw = 2.7 * ppu,
            h = 4.5 * ppu,
            flash = b.hit > 0;
        for (let i = 0; i < 5; i++) {
            const a = -0.7 + i * 0.35,
                bx = x + Math.sin(a) * hw * 0.78,
                by = feet - h * (0.86 + Math.cos(a) * 0.1);
            c.beginPath();
            c.moveTo(bx - 0.5 * ppu, by + 0.3 * ppu);
            c.lineTo(bx + Math.sin(a) * 0.4 * ppu, by - 1.2 * ppu);
            c.lineTo(bx + 0.5 * ppu, by + 0.3 * ppu);
            c.closePath();
            paint(tintFn("#4b3d55"));
        }
        blobPath(x, feet, hw, h, 0.12 * ppu, 0.8);
        c.fillStyle = flash ? "#fff" : tintFn("#5d4a6e");
        c.fill();
        c.save();
        blobPath(x, feet, hw, h, 0.12 * ppu, 0.8);
        c.clip();
        c.fillStyle = flash ? "#fff" : tintFn("#8a68a6");
        c.beginPath();
        c.ellipse(x - hw * 0.12, feet - h * 0.5, hw * 1.02, h * 0.78, 0, 0, 7);
        c.fill();
        c.restore();
        blobPath(x, feet, hw, h, 0.12 * ppu, 0.8);
        c.lineWidth = OUT * 1.2;
        c.strokeStyle = "#000";
        c.lineJoin = "round";
        c.stroke();
        const ey = feet - h * 0.55,
            ex = hw * 0.36,
            er = hw * 0.2,
            dir = b.dir;
        eyeBall(x - ex, ey, er, er * 1.15, dir, 0.2, 1);
        eyeBall(x + ex, ey, er, er * 1.15, dir, 0.2, 1);
        c.lineWidth = OUT * 1.6;
        c.strokeStyle = "#000";
        c.lineCap = "round";
        c.beginPath();
        c.moveTo(x - ex - er * 1.4, ey - er * 2.1);
        c.lineTo(x - ex + er * 1.2, ey - er * 1.3);
        c.moveTo(x + ex + er * 1.4, ey - er * 2.1);
        c.lineTo(x + ex - er * 1.2, ey - er * 1.3);
        c.stroke();
        const my = feet - h * 0.25,
            mw = hw * 0.5;
        c.beginPath();
        c.moveTo(x - mw, my);
        for (let i = 1; i <= 6; i++) c.lineTo(x - mw + (mw * 2 * i) / 6, my + (i % 2 ? 0.45 : 0) * ppu);
        c.lineTo(x + mw, my - 0.1 * ppu);
        c.closePath();
        paint("#fff", OUT * 0.9);
    }
    function drawParticles() {
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            if (p.life <= 0) continue;
            const r = Math.max(1.5, ppu * 0.2 * (p.life / p.max));
            c.beginPath();
            c.arc(sx(p.x), sy(p.y), r, 0, 7);
            paint(p.color, OUT * 0.55);
        }
    }

    function drawIcon(cv, wi) {
        const Wd = WORLDS[wi],
            x = cv.getContext("2d"),
            w = cv.width,
            h = cv.height;
        const sc = c,
            so = OUT,
            sC = tintFn;
        c = x;
        OUT = 3;
        tintFn = plain;
        const sky = rgb(Wd.skyDay);
        c.fillStyle = rgbStr(sky);
        c.fillRect(0, 0, w, h);
        c.fillStyle = rgbStr(lighten(sky, 0.2));
        c.fillRect(0, h * 0.45, w, h);
        c.beginPath();
        c.arc(w * 0.82, h * 0.26, h * 0.12, 0, 7);
        paint("#ffd23f", 3);
        cloudShape(w * 0.26, h * 0.24, h * 0.085, "#ffffff");
        const gy = h * 0.8;
        c.beginPath();
        c.moveTo(-20, gy + 4);
        c.bezierCurveTo(w * 0.1, gy - h * 0.6, w * 0.5, gy - h * 0.6, w * 0.62, gy + 4);
        c.closePath();
        paint(Wd.hillNear, 3);
        c.fillStyle = Wd.soil;
        c.fillRect(0, gy, w, h);
        c.fillStyle = Wd.grass;
        c.fillRect(0, gy, w, h * 0.09);
        c.beginPath();
        c.moveTo(0, gy);
        c.lineTo(w, gy);
        c.lineWidth = 3.5;
        c.strokeStyle = "#000";
        c.stroke();
        drawProp(
            { trees: "tree", candy: "lolly", ice: "shard", lava: "rock", sky: "pillar" }[Wd.prop],
            w * 0.78,
            gy,
            0.8,
            0.3,
            h * 0.17,
            plain
        );
        const px = w * 0.34,
            hw = h * 0.15,
            hh = h * 0.23;
        blobPath(px, gy, hw, hh, 2, 0.82);
        paint("#1b96dc", 3);
        c.beginPath();
        c.ellipse(px - hw * 0.45, gy - hh * 0.8, hw * 0.28, hh * 0.09, -0.5, 0, 7);
        c.fillStyle = "#8fdcff";
        c.fill();
        eyeBall(px - hw * 0.4, gy - hh * 0.56, hw * 0.3, hw * 0.34, 0.7, 0, 1);
        eyeBall(px + hw * 0.4, gy - hh * 0.56, hw * 0.3, hw * 0.34, 0.7, 0, 1);
        c = sc;
        OUT = so;
        tintFn = sC;
    }

    function showScreen(id) {
        const at = trail.indexOf(id);
        if (at === -1) trail.push(id);
        else trail.length = at + 1;
        screens.forEach(function (s) {
            $(s).classList.toggle("active", s === id);
        });
        if (id === "menu" || id === "story") menuWorld = 0;
    }
    function currentScreen() {
        return trail[trail.length - 1];
    }
    function goBack() {
        if (trail.length < 2) return;
        if (currentScreen() === "gameScreen") {
            toWorlds();
            return;
        }
        const prev = trail[trail.length - 2];
        if (prev === "levels") renderWorlds();
        showScreen(prev);
    }
    function renderWorlds() {
        const grid = $("worldGrid");
        grid.innerHTML = "";
        WORLDS.forEach(function (w, i) {
            const card = document.createElement("div");
            card.className = "world-card" + (i > unlocked ? " locked" : "");
            const lv = LEVELS[i];
            card.innerHTML =
                '<canvas width="200" height="112"></canvas>' +
                '<div class="num">WORLD ' +
                (i + 1) +
                "</div><h3>" +
                w.short +
                "</h3><p>" +
                w.desc +
                "</p>" +
                '<div class="score">' +
                (worldCrystals[i] || 0) +
                " / " +
                lv.crystals.length +
                " crystals</div>" +
                (i > unlocked ? '<div class="lock">LOCKED</div>' : "");
            drawIcon(card.querySelector("canvas"), i);
            card.addEventListener("mouseenter", function () {
                menuWorld = i;
            });
            if (i <= unlocked)
                card.addEventListener("click", function () {
                    startLevel(i);
                });
            grid.appendChild(card);
        });
        $("crystalTotal").textContent = totalCrystals;
    }
    function resetPlayer() {
        player = freshPlayer();
        camX = 8;
        camY = 0;
        jumpBuffer = 0;
        coyote = 0;
        airJumps = 1;
    }
    function startLevel(i) {
        currentWorld = i;
        clock = 0;
        loadLevel();
        showScreen("gameScreen");
        gameState = "playing";
        clearInput();
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
        scenery = buildScenery(currentWorld, levelLength);
        coins = levelData.crystals.map(function (q) {
            return { x: q[0], y: q[1], got: false, spin: Math.random() * 6 };
        });
        enemies = levelData.enemies.map(function (e) {
            return { x: e[0], min: e[1], max: e[2], dir: 1, dead: false, phase: Math.random() * 6 };
        });
        particles = [];
        for (let i = 0; i < 90; i++)
            particles.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 1, color: "#fff" });
        boss = null;
        if (levelData.boss) {
            boss = {
                x: levelData.boss,
                min: levelData.boss - 8,
                max: levelData.boss + 8,
                dir: -1,
                hp: 3,
                hit: 0,
                dead: false,
                phase: 0
            };
            $("bossBar").classList.add("show");
            $("bossFill").style.width = "100%";
        } else {
            $("bossBar").classList.remove("show");
        }
        $("hudWorld").textContent = WORLDS[currentWorld].name;
        $("hudCrystals").textContent = "0";
        $("hudLives").textContent = lives;
        $("hudProgress").style.width = "0%";
        $("toast").classList.remove("show");
        const halfW = W / 2 / ppu;
        camX = clamp(player.x + 3, halfW - 1, levelLength + 4 - halfW);
    }
    let pCursor = 0;
    function burst(x, y, color, n) {
        for (let i = 0; i < n; i++) {
            const p = particles[pCursor++ % particles.length];
            if (!p) continue;
            p.x = x;
            p.y = y;
            p.color = color;
            p.vx = (Math.random() - 0.5) * 9;
            p.vy = 3 + Math.random() * 8;
            p.life = 0.5 + Math.random() * 0.25;
            p.max = p.life;
        }
    }
    function toast(msg) {
        const t = $("toast");
        t.textContent = msg;
        t.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            t.classList.remove("show");
        }, 1300);
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
        $("winText").textContent =
            currentWorld === 4
                ? "The Crusher's power is gone. The kingdom is bouncing again!"
                : "You made it through " + WORLDS[currentWorld].short + "!";
        $("winCrystals").textContent = collected + " / " + levelData.crystals.length + " crystals";
        $("nextBtn").textContent = currentWorld === 4 ? "FINISH ADVENTURE" : "NEXT WORLD";
        $("winOverlay").classList.add("show");
    }
    function nextWorld() {
        if (currentWorld < 4) {
            unlocked = Math.max(unlocked, currentWorld + 1);
            localStorage.setItem("squishUnlocked", unlocked);
            renderWorlds();
            startLevel(currentWorld + 1);
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
        burst(player.x, player.y + 1, "#5cc4ff", 12);
        toast("SPLAT! BOUNCE BACK!");
        if (lives <= 0) {
            gameState = "over";
            $("gameOverOverlay").classList.add("show");
        }
    }

    function update(dt, time) {
        if (gameState !== "playing") return;
        const L = levelData;
        const left = held("ArrowLeft", "KeyA");
        const right = held("ArrowRight", "KeyD");
        const jump = held("Space", "ArrowUp", "KeyW");
        const down = held("ArrowDown", "KeyS");
        const slippery = !!WORLDS[currentWorld].slippery;
        const accel = slippery ? 56 : 86;
        const friction = player.onGround ? (slippery ? 1.5 : 12) : 3;
        const dir = (right ? 1 : 0) - (left ? 1 : 0);

        if (dir !== 0) {
            const turning = Math.abs(player.vx) > 0.5 && Math.sign(player.vx) !== dir;
            player.vx += dir * accel * (turning && !slippery ? 1.6 : 1) * dt;
            player.face = dir;
        } else {
            player.vx *= Math.max(0, 1 - friction * dt);
            if (Math.abs(player.vx) < 0.05) player.vx = 0;
        }
        player.vx = clamp(player.vx, -MAX_SPEED, MAX_SPEED);

        if (down && player.onGround) {
            player.squish = Math.min(1, player.squish + dt * 5);
            player.energy = Math.min(1, player.energy + dt * 0.85);
            player.vx *= 0.94;
        } else {
            player.squish = Math.max(0, player.squish - dt * 6);
            player.energy = Math.max(0, player.energy - dt * 1.2);
        }

        if (player.onGround) {
            coyote = 0.1;
            airJumps = 1;
        } else coyote = Math.max(0, coyote - dt);
        if (jumpBuffer > 0) jumpBuffer -= dt;

        const canJump = player.onGround || (coyote > 0 && player.vy <= 0);
        if (canJump && (jumpBuffer > 0 || (jump && player.onGround))) {
            const charged = player.energy > 0.55;
            player.vy = charged ? JUMP_CHARGED : JUMP;
            player.onGround = false;
            player.energy = 0;
            player.stretch = 0.24;
            player.cut = !charged;
            player.hold = 0.09;
            jumpBuffer = 0;
            coyote = 0;
            burst(player.x, player.y + 0.2, "#9be8ff", 5);
        } else if (jumpBuffer > 0 && !player.onGround && airJumps > 0) {
            airJumps--;
            player.vy = JUMP;
            player.stretch = 0.24;
            player.cut = false;
            player.hold = 0.09;
            jumpBuffer = 0;
            burst(player.x, player.y + 0.2, "#ffffff", 8);
        }

        if (player.hold > 0) player.hold -= dt;
        if (player.cut) {
            if (player.vy <= 0) player.cut = false;
            else if (!jump && player.hold <= 0 && player.vy > JUMP * 0.45) {
                player.vy *= 0.55;
                player.cut = false;
            }
        }

        player.vy -= GRAV * dt;
        player.vy = Math.max(player.vy, -55);

        const wasAir = !player.onGround,
            vyBefore = player.vy;
        const prevFeet = player.y;
        player.x += player.vx * dt;
        player.x = clamp(player.x, PLAYER_R, levelLength - PLAYER_R);
        player.y += player.vy * dt;
        player.onGround = false;

        if (player.y <= 0 && prevFeet >= -0.02) {
            player.y = 0;
            player.vy = 0;
            player.onGround = true;
        }
        for (let i = 0; i < L.plats.length; i++) {
            const p = L.plats[i];
            if (
                player.vy <= 0 &&
                prevFeet >= p[1] - 0.03 &&
                player.y <= p[1] &&
                player.x + PLAYER_R > p[0] &&
                player.x - PLAYER_R < p[0] + p[2]
            ) {
                player.y = p[1];
                player.vy = 0;
                player.onGround = true;
            }
        }
        if (wasAir && player.onGround && vyBefore < -8) {
            player.land = 0.16;
            burst(player.x, player.y + 0.1, "#9be8ff", 4);
        }
        if (player.y < -8) {
            player.y = 0;
            player.vy = 0;
            loseLife();
        }

        if (player.invuln > 0) player.invuln -= dt;
        if (player.stretch > 0) player.stretch -= dt;

        for (let i = 0; i < L.hazards.length; i++) {
            const h = L.hazards[i];
            if (
                player.y < 1.15 &&
                player.x + PLAYER_R * 0.8 > h[0] &&
                player.x - PLAYER_R * 0.8 < h[0] + h[1]
            )
                loseLife();
        }

        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];
            if (e.dead) continue;
            e.x += e.dir * 5.2 * dt;
            if (e.x < e.min || e.x > e.max) e.dir *= -1;
            const dx = Math.abs(player.x - e.x);
            if (dx < 1.65 && player.y < 1.95) {
                if (player.vy < -1 && player.y > 1.15) {
                    e.dead = true;
                    player.vy = 18;
                    player.cut = false;
                    burst(e.x, 1.2, "#ffb6c9", 12);
                } else {
                    loseLife();
                }
            }
        }

        if (boss && !boss.dead) {
            boss.x += boss.dir * 2.6 * dt;
            if (boss.x < boss.min || boss.x > boss.max) boss.dir *= -1;
            boss.phase += dt;
            if (boss.hit > 0) boss.hit -= dt;
            if (Math.abs(player.x - boss.x) < 2.5 && player.y < 4.4) {
                if (player.vy < -1 && player.y > 3.3) {
                    boss.hp--;
                    boss.hit = 0.35;
                    player.vy = 26;
                    player.cut = false;
                    camShake = 0.5;
                    burst(boss.x, 4, "#ffdf75", 18);
                    $("bossFill").style.width = Math.max(0, (boss.hp / 3) * 100) + "%";
                    if (boss.hp <= 0) {
                        boss.dead = true;
                        $("bossBar").classList.remove("show");
                        toast("THE CRUSHER IS DEFEATED!");
                        burst(boss.x, 3, "#f9d4ea", 26);
                    }
                } else {
                    loseLife();
                }
            }
        }

        for (let i = 0; i < coins.length; i++) {
            const cr = coins[i];
            if (cr.got) continue;
            const dx = player.x - cr.x,
                dy = player.y + 1.05 - cr.y;
            if (dx * dx + dy * dy < 3.3) {
                cr.got = true;
                collected++;
                totalCrystals++;
                localStorage.setItem("squishCrystals", totalCrystals);
                $("hudCrystals").textContent = collected;
                burst(cr.x, cr.y, "#ffd23f", 8);
            }
        }

        if (player.x > L.goal - 0.6 && (!boss || boss.dead)) completeLevel();
    }

    function animate(p, dt) {
        p.air += ((p.onGround ? 0 : 1) - p.air) * Math.min(1, dt * 16);
        if (p.land > 0) p.land = Math.max(0, p.land - dt);
    }
    function animateGame(dt) {
        animate(player, dt);
        for (let i = 0; i < coins.length; i++) coins[i].spin += dt * 1.8;
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            if (p.life <= 0) continue;
            p.life -= dt;
            p.vy -= 26 * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
        }
        const halfW = W / 2 / ppu;
        const tx = clamp(player.x + 3, halfW - 1, Math.max(halfW - 1, levelLength + 4 - halfW));
        const k = 1 - Math.exp(-6 * dt);
        camX += (tx - camX) * k;
        camY += (Math.max(0, (player.y - 7) * 0.8) - camY) * k;
        if (camShake > 0) camShake = Math.max(0, camShake - dt * 1.6);
        $("hudProgress").style.width = Math.min(100, (player.x / (levelData.goal || 1)) * 100) + "%";
    }

    const demo = freshPlayer();
    function render(time) {
        tintCache = {};
        c = ctx;
        tintFn = tintColor;
        updateDayWeights();
        const inGame =
            gameState === "playing" || gameState === "paused" || gameState === "won" || gameState === "over";
        const wi = inGame ? currentWorld : menuWorld,
            Wd = WORLDS[wi];
        let sc, len;
        if (inGame) {
            sc = scenery;
            len = levelLength;
        } else {
            len = 1200;
            sc = menuScenery[wi] || (menuScenery[wi] = buildScenery(wi, len));
            camX = 18 + ((clock * 2.4) % 1100);
            camY = 0;
        }
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawSky(Wd);
        c.save();
        if (inGame && camShake > 0)
            c.translate(
                (Math.random() - 0.5) * camShake * ppu * 0.6,
                (Math.random() - 0.5) * camShake * ppu * 0.6
            );
        drawHills(Wd, wi);
        const g = sy(0);
        for (let i = 0; i < sc.props.length; i++) {
            const p = sc.props[i],
                x = sx(p.x);
            if (x < -320 || x > W + 320) continue;
            drawProp(p.k, x, g, p.s, p.v, ppu, tintFn);
        }
        drawGround(Wd, len);
        tuftsDraw(Wd, sc.tufts);

        if (inGame) {
            const L = levelData;
            L.hazards.forEach(function (h) {
                drawSpikes(h, Wd);
            });
            L.plats.forEach(function (p) {
                drawPlat(p, Wd);
            });
            drawGate(L, Wd, clock);
            coins.forEach(function (cr) {
                if (!cr.got) drawCrystal(cr, clock);
            });
            enemies.forEach(function (e) {
                if (!e.dead) drawEnemy(e, clock);
            });
            if (boss && !boss.dead) drawBoss(boss, clock);
            if (!(player.invuln > 0 && Math.floor(clock * 14) % 2 === 0)) drawSlime(player, clock, true);
            drawParticles();
        } else {
            const T = 1.7,
                u = (clock % T) / T;
            demo.x = camX + (W / 2 / ppu) * (W > 800 ? 0.42 : 0);
            demo.squish = 0;
            demo.stretch = 0;
            demo.energy = 0;
            demo.face = 1;
            demo.vx = 0;
            if (u < 0.24) {
                demo.y = 0;
                demo.squish = u / 0.24;
                demo.onGround = true;
                demo.vy = 0;
                demo.energy = demo.squish * 0.3;
            } else {
                const t2 = (u - 0.24) / 0.76;
                demo.y = 4 * t2 * (1 - t2) * 6.2;
                demo.vy = (1 - 2 * t2) * 26;
                demo.onGround = false;
                if (t2 > 0.97) demo.land = 0.1;
            }
            animate(demo, 0.016);
            drawSlime(demo, clock, false);
        }
        c.restore();
    }

    function loop(t) {
        const dt = Math.min(0.033, (t - last) / 1000 || 0);
        last = t;
        if (gameState !== "paused") clock += dt;
        if (gameState === "playing") update(dt, t / 1000);
        if (gameState === "playing" || gameState === "won" || gameState === "over") animateGame(dt);
        render(t / 1000);
        requestAnimationFrame(loop);
    }
    window.addEventListener("resize", resize);

    const JUMP_KEYS = ["Space", "ArrowUp", "KeyW"];
    const BLOCKED_KEYS = ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    const touchButtons = document.querySelectorAll(".touch-control");
    const touchRow = document.querySelector(".touch-row");

    function held() {
        for (let i = 0; i < arguments.length; i++) {
            if (keys[arguments[i]] || pad[arguments[i]]) return true;
        }
        return false;
    }
    function pressJump() {
        if (gameState === "playing") jumpBuffer = 0.12;
    }
    function syncPad() {
        const active = new Set(touches.values());
        touchButtons.forEach(function (btn) {
            const code = btn.dataset.key;
            pad[code] = active.has(code);
            btn.classList.toggle("down", pad[code]);
        });
    }
    function clearInput() {
        keys = {};
        touches.clear();
        syncPad();
        jumpBuffer = 0;
    }
    function pauseGame() {
        if (gameState !== "playing") return;
        gameState = "paused";
        clearInput();
        $("pauseOverlay").classList.add("show");
    }
    function resumeGame() {
        if (gameState !== "paused") return;
        gameState = "playing";
        $("pauseOverlay").classList.remove("show");
    }
    function setKey(e, val) {
        if (BLOCKED_KEYS.indexOf(e.code) !== -1) e.preventDefault();
        keys[e.code] = val;
    }

    window.addEventListener("keydown", function (e) {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        setKey(e, true);
        if (e.repeat) return;
        if (JUMP_KEYS.indexOf(e.code) !== -1) pressJump();
        if (e.code === "KeyR" && (gameState === "playing" || gameState === "paused")) restart();
        if (e.code === "KeyP" || e.code === "Escape") {
            if (gameState === "playing") pauseGame();
            else if (gameState === "paused") resumeGame();
            else if (e.code === "Escape") goBack();
        } else if (e.code === "Enter" && gameState === "menu") {
            if (currentScreen() === "menu") {
                e.preventDefault();
                showScreen("story");
            } else if (currentScreen() === "story") {
                e.preventDefault();
                renderWorlds();
                showScreen("levels");
            }
        }
    });
    window.addEventListener("keyup", function (e) {
        setKey(e, false);
    });
    window.addEventListener("blur", clearInput);
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) pauseGame();
    });
    document.addEventListener("click", function (e) {
        const btn = e.target.closest("button");
        if (btn) btn.blur();
    });

    $("playBtn").onclick = function () {
        showScreen("story");
    };
    $("storyGoBtn").onclick = function () {
        renderWorlds();
        showScreen("levels");
    };
    document.querySelectorAll("[data-back]").forEach(function (b) {
        b.onclick = goBack;
    });
    function toWorlds() {
        gameState = "menu";
        clearInput();
        ["pauseOverlay", "winOverlay", "gameOverOverlay"].forEach(function (id) {
            $(id).classList.remove("show");
        });
        showScreen("levels");
        renderWorlds();
    }
    $("pauseBtn").onclick = pauseGame;
    $("pauseWorldsBtn").onclick = toWorlds;
    $("gameOverWorldsBtn").onclick = toWorlds;
    $("worldsBtn").onclick = toWorlds;
    $("resumeBtn").onclick = resumeGame;
    $("restartBtn").onclick = restart;
    $("retryBtn").onclick = restart;
    $("nextBtn").onclick = function () {
        if (currentWorld < 4) nextWorld();
        else toWorlds();
    };

    function controlAt(e) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const btn = el && el.closest(".touch-control");
        return btn ? btn.dataset.key : null;
    }
    touchRow.addEventListener("pointerdown", function (e) {
        const code = controlAt(e);
        if (!code) return;
        e.preventDefault();
        touches.set(e.pointerId, code);
        if (code === "Space") pressJump();
        syncPad();
    });
    touchRow.addEventListener("pointermove", function (e) {
        if (!touches.has(e.pointerId)) return;
        const code = controlAt(e);
        if (code === touches.get(e.pointerId)) return;
        touches.set(e.pointerId, code);
        if (code === "Space") pressJump();
        syncPad();
    });
    function releaseTouch(e) {
        if (touches.delete(e.pointerId)) syncPad();
    }
    window.addEventListener("pointerup", releaseTouch);
    window.addEventListener("pointercancel", releaseTouch);
    touchRow.addEventListener("mousedown", function (e) {
        e.preventDefault();
    });
    touchRow.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    });

    resize();
    renderWorlds();
    requestAnimationFrame(loop);
})();
