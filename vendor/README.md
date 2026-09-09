# vendor/

Manually-copied third-party JS for the static main site (no bundler here).

- `three.module.min.js` / `three.core.min.js` — Three.js, used by
  `../hero-distortion.js` for the hero WebGL distortion effect.
  Copied from `almanacco-src/node_modules/three/build/`.

**Keep in sync with `almanacco-src/package.json`'s `three` version.**
If that dependency is upgraded, re-copy both files here:

```bash
cp almanacco-src/node_modules/three/build/three.module.min.js vendor/
cp almanacco-src/node_modules/three/build/three.core.min.js vendor/
```

Both files are required — `three.module.min.js` imports `three.core.min.js`.
