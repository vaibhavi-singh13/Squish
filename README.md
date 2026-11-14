# SQUISH 3D! — Bounce Back Adventure

A 3D remake of SQUISH, built with plain HTML, CSS and JavaScript using [three.js](https://threejs.org/).

## Run the game
1. Open `index.html` in Chrome, Firefox, Edge or another modern browser.
2. Click **LET'S PLAY** → **I'M READY!** → pick a world.

No build step, server or installation is required. Three.js is vendored in `vendor/three.min.js`, so the
game works offline. An internet connection is only used for the optional Google Fonts import.

## Controls
- Left / Right arrows or A / D: move
- Space / Up arrow / W: jump
- Down arrow / S: squish and charge a stronger bounce while on the ground
- P or Escape: pause · R: restart level
- On touch devices, on-screen buttons appear below the game.

## What's included
- Five themed 3D worlds (Slime Forest, Candy Kingdom, Frozen Mountains, Lava Land, Sky Kingdom)
- Platform jumping with squish-charged bounces, and slippery ice physics
- Collectible crystals, spike hazards and patrolling slime enemies you can stomp
- Final boss encounter in the Sky Kingdom
- Level unlock progression and saved crystal totals in browser localStorage
- Sound toggle, pause/win/game-over overlays and responsive menus

## Files
- `index.html` — game shell and menus
- `style.css` — UI styling
- `game3d.js` — the whole 3D game: scene, physics, worlds, rendering
- `vendor/three.min.js` — three.js r160 (MIT)

Original 2D game lives in the `Squish-main/` folder (unchanged).
