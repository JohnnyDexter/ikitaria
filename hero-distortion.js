// WebGL image-distortion hero background, inspired by vlag.yokohama's
// simplex-noise displacement technique (independently implemented here,
// not their code/assets). Renders a 3-panel-look static image by default;
// this script progressively swaps in a Three.js canvas with a gentle
// noise-driven UV wobble, unless the visitor prefers reduced motion or
// WebGL fails.
//
// This is a vanilla-JS port of almanacco-src/src/components/HeroDistortion.astro
// (same shaders, same logic) — kept as a separate file because this site has
// no build step while Almanacco is bundled by Astro/Vite. Update both when
// changing the effect.
import * as THREE from "./vendor/three.module.min.js";

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// Fragment shader includes a 2D simplex noise implementation
// (Ashima Arts / Stefan Gustavson, MIT license — a standard, widely
// reused GLSL utility, not vlag.yokohama's specific shader code).
const FRAGMENT_SHADER = `
  uniform sampler2D uTexture;
  uniform float uTime;
  varying vec2 vUv;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
           + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    float n = snoise(uv * 2.5 + uTime * 0.04);
    uv.x += n * 0.012;
    uv.y += n * 0.008;
    gl_FragColor = texture2D(uTexture, uv);
  }
`;

function initDistortion(root) {
  const canvas = root.querySelector("[data-distortion-canvas]");
  const src = root.dataset.image;
  if (!canvas || !src) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
  } catch {
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    uniforms: { uTexture: { value: null }, uTime: { value: 0 } },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
  });
  scene.add(new THREE.Mesh(geometry, material));

  function resize() {
    const { clientWidth, clientHeight } = canvas;
    renderer.setSize(clientWidth, clientHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  new THREE.TextureLoader().load(
    src,
    (texture) => {
      texture.minFilter = THREE.LinearFilter;
      material.uniforms.uTexture.value = texture;

      // Show the canvas (and hide the fallback) BEFORE measuring it —
      // clientWidth/clientHeight read 0 while display:none is still set,
      // which would size the WebGL drawing buffer to 0x0.
      root.querySelectorAll("[data-distortion-fallback]").forEach((el) => {
        el.style.display = "none";
      });
      canvas.classList.remove("is-hidden");

      resize();
      window.addEventListener("resize", resize);

      let raf = 0;
      function tick(time) {
        material.uniforms.uTime.value = time * 0.001;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          cancelAnimationFrame(raf);
        } else {
          raf = requestAnimationFrame(tick);
        }
      });
    },
    undefined,
    () => {
      // Texture failed to load — leave the static fallback panels in place.
    },
  );
}

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (!prefersReducedMotion) {
  document.querySelectorAll("[data-hero-distortion]").forEach((el) => {
    try {
      initDistortion(el);
    } catch {
      // WebGL threw — the static fallback panels stay visible.
    }
  });
}
