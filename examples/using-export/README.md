# Using an exported animation in another page

This folder is a **runnable example**: `demo.am.js` is an animation exported from the editor
(MV3 port 0.4.1) and `index.html` plays it with GSAP in a plain page — no editor, no build.

## Run it

Any static server works:

```powershell
# from this folder
python -m http.server 8080
# open http://localhost:8080/
```

Click **play / pause / rewind / loop**. The animation moves and rotates the `#box-1` element.

## How it works

1. **Load GSAP 1.x first.** The bundle uses the global `TimelineMax` / `TweenMax`.
2. **Load the exported file.** It is a self-contained UMD bundle: project data + the runtime that
   rebuilds the timeline. It registers:
   - `window.__animachine['<project>']` — the stable registry (0.4.1+);
   - `window['<project>']` — the original global, kept for compatibility;
   - `module.exports` — when loaded by a bundler (`require('./demo.am.js')`).
3. **Call the timeline with a root element.** `animations['<timeline>'](rootElement)` returns a GSAP
   `TimelineMax`; then use the normal GSAP controls (`play`, `pause`, `time`, `timeScale`,
   `repeat`, `seek`…).

```js
var animations = window.__animachine['new project']
var tl = animations['new timeline'](document.body)
tl.play()
```

## The important limitation: selectors

The animation is **bound to CSS selectors** captured in the editor, not to a project or a file.
The runtime runs `rootElement.querySelectorAll(selector)` for every track, so:

* the same markup must exist inside `rootElement` (`document.body` here);
* on a different page, only elements matching those selectors are animated; if none match, the
  timeline runs and does nothing (check the console for `error on using css selector`);
* the picker can generate long `:nth-child(…)` paths (fragile). For reusable animations, create the
  track with **menu → add track (css selector)** and use a stable selector (`.hero h2`, `#card`).

## Reopening in the editor

The same file can be loaded back: editor menu (timeline circle) → **open animation (.am.js)**.
The editor reads the `__ANIMACHINE_BUNDLE__` marker (it does not execute the file) and restores the
project, tracks, keys and eases. `.am.json` remains the plain, editable project file.
