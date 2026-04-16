# Prithvix — AI Agent Prompt: Embed 3D Seed Scene into Hero Section
# ─────────────────────────────────────────────────────────────────────────────
# PURPOSE: Give this entire prompt to an AI coding agent (Cursor, GitHub Copilot
# Workspace, Claude Code, etc.) to wire the 3D scene into the Prithvix website.
# ─────────────────────────────────────────────────────────────────────────────

## TASK OVERVIEW

You are working on the Prithvix AgriTech marketing website (React + Vite +
Tailwind CSS v3 + GSAP + Three.js). Two files have already been created and
placed in the project:

  1. /src/components/3d/cropFieldScene.js   ← pure Three.js scene logic
  2. /src/components/3d/CropField.jsx       ← React wrapper component

Your job is to:
  A) Verify the files are correctly placed
  B) Integrate CropField.jsx into Hero.jsx (right panel)
  C) Wire GSAP scroll parallax from Hero.jsx → CropField
  D) Ensure Three.js is installed and imported correctly
  E) Verify mobile responsiveness
  F) Add the WebGL static fallback SVG

Do NOT rewrite cropFieldScene.js or CropField.jsx — only integrate them.

─────────────────────────────────────────────────────────────────────────────
## STEP 1 — VERIFY DEPENDENCIES

Check package.json. These must be present. If missing, install them:

  npm install three gsap @gsap/react

Confirm Three.js version is r128 or higher (r140+ preferred for CapsuleGeometry).

─────────────────────────────────────────────────────────────────────────────
## STEP 2 — FILE PLACEMENT

Confirm these files exist at exactly these paths:
  /src/components/3d/cropFieldScene.js
  /src/components/3d/CropField.jsx

If they don't exist, create the /src/components/3d/ directory and add them.

─────────────────────────────────────────────────────────────────────────────
## STEP 3 — UPDATE Hero.jsx

Open /src/components/sections/Hero.jsx and make these changes:

### 3a — Add import at top of file

  import CropField from '../3d/CropField';

### 3b — Replace the right panel placeholder

Find the right panel div (the 45% canvas area). It will look something like:
  <div className="... canvas-placeholder ..."> ... </div>
  OR
  <div className="w-full md:w-[45%] ..."> {/* 3D canvas goes here */} </div>

Replace the entire right panel div with:

  <div className="relative w-full md:w-[45%] h-[280px] md:h-[560px]">
    <CropField className="w-full h-full" />
  </div>

### 3c — Hero layout must be a flex row

Ensure the hero section uses this structure:

  <section
    id="hero"
    className="min-h-screen flex flex-col md:flex-row items-center
               max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-16 gap-12"
  >
    {/* LEFT — Text content (55%) */}
    <div className="w-full md:w-[55%] ...">
      {/* headline, subtext, CTAs, trust row */}
    </div>

    {/* RIGHT — Three.js Scene (45%) */}
    <div className="relative w-full md:w-[45%] h-[280px] md:h-[560px]">
      <CropField className="w-full h-full" />
    </div>
  </section>

─────────────────────────────────────────────────────────────────────────────
## STEP 4 — ADD STATIC SVG FALLBACK

Create the file /public/assets/crop-field-fallback.svg with this content
(used when WebGL is not supported):

  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"
       fill="none">
    <!-- Dark soil base -->
    <ellipse cx="200" cy="420" rx="180" ry="40" fill="#2C1810"/>
    <!-- Crack lines -->
    <line x1="140" y1="395" x2="200" y2="410" stroke="#B8860B" stroke-width="2"/>
    <line x1="260" y1="395" x2="200" y2="410" stroke="#B8860B" stroke-width="2"/>
    <!-- Seed shell lower -->
    <ellipse cx="200" cy="380" rx="45" ry="28" fill="#1A3C2B"/>
    <!-- Gold glow -->
    <ellipse cx="200" cy="365" rx="18" ry="12" fill="#D4A853" opacity="0.8"/>
    <!-- Stem -->
    <path d="M200 360 Q210 300 200 200" stroke="#8B9D4F"
          stroke-width="10" stroke-linecap="round" fill="none"/>
    <!-- Left leaf -->
    <path d="M205 310 Q155 280 145 240 Q175 260 205 310Z"
          fill="#3A6B2E"/>
    <!-- Right leaf -->
    <path d="M198 280 Q248 250 258 210 Q228 230 198 280Z"
          fill="#4A8040"/>
    <!-- Top leaves -->
    <path d="M200 210 Q165 180 160 145 Q185 165 200 210Z"
          fill="#3A6B2E"/>
    <path d="M200 210 Q235 175 242 138 Q218 160 200 210Z"
          fill="#4A8040"/>
    <!-- Data pills -->
    <rect x="100" y="290" width="36" height="14" rx="7" fill="#D4A853"
          opacity="0.85"/>
    <rect x="264" y="260" width="30" height="12" rx="6" fill="#D4A853"
          opacity="0.85"/>
    <rect x="88"  y="215" width="28" height="12" rx="6" fill="#D4A853"
          opacity="0.75"/>
    <rect x="276" y="195" width="32" height="12" rx="6" fill="#D4A853"
          opacity="0.75"/>
    <!-- Roots -->
    <path d="M185 395 Q155 430 130 460" stroke="#5C3A1E" stroke-width="4"
          stroke-linecap="round" fill="none"/>
    <path d="M215 395 Q245 435 270 465" stroke="#5C3A1E" stroke-width="4"
          stroke-linecap="round" fill="none"/>
    <path d="M200 398 Q195 445 192 475" stroke="#5C3A1E" stroke-width="3"
          stroke-linecap="round" fill="none"/>
    <!-- Root gold dots -->
    <circle cx="148" cy="440" r="4" fill="#D4A853"/>
    <circle cx="252" cy="445" r="4" fill="#D4A853"/>
    <circle cx="193" cy="450" r="3" fill="#D4A853"/>
  </svg>

─────────────────────────────────────────────────────────────────────────────
## STEP 5 — GSAP SCROLL TRIGGER IN Hero.jsx

The CropField component handles its own ScrollTrigger internally.
In Hero.jsx, just make sure the section has id="hero":

  <section id="hero" ...>

No additional GSAP code is needed in Hero.jsx for the 3D scene.
The GSAP entrance animations for text elements are separate and should remain
as already coded in Hero.jsx.

─────────────────────────────────────────────────────────────────────────────
## STEP 6 — MOBILE RESPONSIVENESS CHECK

In CropField.jsx the canvas is sized by its parent div. Ensure:

  Mobile  (< 768px):  parent height = 280px  → canvas fills it
  Desktop (≥ 768px):  parent height = 560px  → canvas fills it

The canvas in CropField.jsx has className="w-full h-full block" which
fills its parent. So just control the parent height in Hero.jsx:

  <div className="relative w-full md:w-[45%] h-[280px] md:h-[560px]">
    <CropField className="w-full h-full" />
  </div>

─────────────────────────────────────────────────────────────────────────────
## STEP 7 — VITE CONFIG (if Three.js import errors appear)

If you see "Cannot find module 'three/examples/jsm/loaders/GLTFLoader'" errors
(we don't use GLTFLoader but just in case), add to vite.config.js:

  export default defineConfig({
    resolve: {
      alias: {
        'three/examples/jsm': '/node_modules/three/examples/jsm',
      },
    },
    ...
  });

─────────────────────────────────────────────────────────────────────────────
## STEP 8 — LAZY LOADING (Performance)

In App.jsx, ensure CropField / Hero are lazy loaded:

  const Hero = React.lazy(() => import('./components/sections/Hero'));

  <Suspense fallback={<div className="min-h-screen bg-offwhite" />}>
    <Hero />
  </Suspense>

─────────────────────────────────────────────────────────────────────────────
## STEP 9 — VERIFY IT WORKS

Run: npm run dev

Check:
  ✅ 3D scene renders on the right side of hero (not a blank white box)
  ✅ Scene is transparent (no black/white box background)
  ✅ Pills are floating and animating
  ✅ Mouse parallax works (move cursor over canvas, camera shifts)
  ✅ Scroll down hero → scene zooms in slightly (camera z changes)
  ✅ On mobile (375px) → canvas stacks below text, height 280px
  ✅ No console errors about Three.js or WebGL
  ✅ If you force webglOk = false in CropField.jsx → fallback SVG shows

─────────────────────────────────────────────────────────────────────────────
## WHAT NOT TO CHANGE

  ❌ Do NOT modify cropFieldScene.js animation logic
  ❌ Do NOT change the color constants in cropFieldScene.js
  ❌ Do NOT add a background color to the canvas element
  ❌ Do NOT wrap the canvas in a card or box with border
  ❌ Do NOT use R3F (React Three Fiber) — this is vanilla Three.js intentionally

─────────────────────────────────────────────────────────────────────────────
## EXPECTED VISUAL OUTPUT

A transparent 3D scene showing:
  - Dark soil disc at base with gold crack lines
  - Forest green seed shell split open, gold glow at break point
  - Green sprout stem rising up with slight curve
  - 5 low-poly leaves swaying gently
  - 6 branching roots below with amber pulsing dots
  - 6 gold data pills floating and bobbing at different heights
  - Tiny gold particle spores slowly rising
  - Whole scene doing a lazy turntable Y rotation
  - Camera responds to mouse movement (subtle parallax)
  - On scroll: camera gently zooms in

─────────────────────────────────────────────────────────────────────────────
## FILES SUMMARY

Files you should NOT touch (already complete):
  /src/components/3d/cropFieldScene.js    ← Three.js scene (complete)
  /src/components/3d/CropField.jsx        ← React wrapper (complete)

Files you WILL modify:
  /src/components/sections/Hero.jsx       ← add CropField import + right panel
  /public/assets/crop-field-fallback.svg  ← create this file (SVG code above)

Files you MAY need to modify:
  /package.json          ← ensure three + gsap installed
  /vite.config.js        ← only if Three.js import errors appear
  /src/App.jsx           ← only to add React.lazy wrapping for Hero
