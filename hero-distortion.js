// WebGL image-slideshow hero background, inspired by vlag.yokohama's
// transition technique (independently implemented here, not their
// code/assets). Each panel cross-fades through a rotating set of
// images, distorting only DURING each transition (~1s) via simplex
// noise, then settling back to a sharp static frame — unless the
// visitor prefers reduced motion or WebGL fails, in which case each
// panel just shows its first image, static.
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
// Distortion is scaled by uProgress via sin(progress * PI): zero at
// the start and end of a transition, peaking in the middle.
// coverUv reproduces CSS `background-size: cover` — without it the
// image is stretched to fill the plane's aspect ratio instead of
// being cropped, which is what made photos look stretched tall.
const FRAGMENT_SHADER = `
  uniform sampler2D uTextureA;
  uniform sampler2D uTextureB;
  uniform float uProgress;
  uniform float uPlaneAspect;
  uniform float uImageAspectA;
  uniform float uImageAspectB;
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

  vec2 coverUv(vec2 uv, float imageAspect, float planeAspect) {
    vec2 ratio = imageAspect > planeAspect
      ? vec2(planeAspect / imageAspect, 1.0)
      : vec2(1.0, imageAspect / planeAspect);
    return (uv - 0.5) * ratio + 0.5;
  }

  void main() {
    float intensity = sin(uProgress * 3.14159265);
    float n = snoise(vUv * 3.0) * intensity * 0.09;
    // Apply the noise offset BEFORE the cover-crop transform (in plane-UV
    // space), so it scales down along with the same crop factor instead of
    // being amplified when a panel is much narrower than the image.
    vec2 uvA = coverUv(vUv + vec2(n, n * 0.7), uImageAspectA, uPlaneAspect);
    vec2 uvB = coverUv(vUv - vec2(n, n * 0.7), uImageAspectB, uPlaneAspect);
    vec4 colorA = texture2D(uTextureA, uvA);
    vec4 colorB = texture2D(uTextureB, uvB);
    gl_FragColor = mix(colorA, colorB, smoothstep(0.0, 1.0, uProgress));
  }
`;

const SLIDE_INTERVAL_MS = 3000;
const TRANSITION_MS = 1000;

function loadTexture(loader, src) {
  return new Promise((resolve, reject) => {
    loader.load(
      src,
      (texture) => {
        texture.minFilter = THREE.LinearFilter;
        resolve(texture);
      },
      undefined,
      reject,
    );
  });
}

function imageAspect(texture) {
  const img = texture.image;
  return img.width / img.height;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function initPanel(panel) {
  const canvas = panel.querySelector("[data-distortion-canvas]");
  const images = panel.dataset.images?.split("|") ?? [];
  const delay = Number(panel.dataset.delay ?? 0);
  if (!canvas || images.length === 0) return;

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

  const loader = new THREE.TextureLoader();
  const firstTexture = await loadTexture(loader, images[0]);
  const firstAspect = imageAspect(firstTexture);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTextureA: { value: firstTexture },
      uTextureB: { value: firstTexture },
      uProgress: { value: 0 },
      uPlaneAspect: { value: 1 },
      uImageAspectA: { value: firstAspect },
      uImageAspectB: { value: firstAspect },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
  });
  scene.add(new THREE.Mesh(geometry, material));

  function resize() {
    const { clientWidth, clientHeight } = canvas;
    renderer.setSize(clientWidth, clientHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    material.uniforms.uPlaneAspect.value = clientWidth / clientHeight;
  }

  // Show the canvas (and hide the fallback) BEFORE measuring it —
  // clientWidth/clientHeight read 0 while display:none is still set,
  // which would size the WebGL drawing buffer to 0x0.
  panel.querySelectorAll("[data-distortion-fallback]").forEach((el) => {
    el.style.display = "none";
  });
  canvas.classList.remove("is-hidden");
  resize();
  window.addEventListener("resize", resize);
  renderer.render(scene, camera);

  if (images.length < 2) return; // nothing to slide to

  await sleep(delay);

  let index = 0;
  for (;;) {
    await sleep(SLIDE_INTERVAL_MS);
    const nextIndex = (index + 1) % images.length;

    let nextTexture;
    try {
      nextTexture = await loadTexture(loader, images[nextIndex]);
    } catch {
      // Broken/unreachable image: skip it instead of retrying it forever.
      index = nextIndex;
      continue;
    }

    const outgoingTexture = material.uniforms.uTextureA.value;
    material.uniforms.uTextureB.value = nextTexture;
    material.uniforms.uImageAspectB.value = imageAspect(nextTexture);

    await new Promise((resolve) => {
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / TRANSITION_MS, 1);
        material.uniforms.uProgress.value = t;
        renderer.render(scene, camera);
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(step);
    });

    material.uniforms.uTextureA.value = nextTexture;
    material.uniforms.uImageAspectA.value =
      material.uniforms.uImageAspectB.value;
    material.uniforms.uProgress.value = 0;
    renderer.render(scene, camera);
    // Three.js doesn't free GPU texture memory on GC — without this, an
    // hour-long kiosk/tab session would accumulate one orphaned texture
    // per transition indefinitely.
    outgoingTexture.dispose();
    index = nextIndex;
  }
}

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (!prefersReducedMotion) {
  document.querySelectorAll("[data-hero-distortion]").forEach((panel) => {
    initPanel(panel).catch(() => {
      // WebGL/texture loading failed — the static fallback image stays visible.
    });
  });
}
