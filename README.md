# Prithvix AgriTech Dealer Management Platform

Prithvix is a visually stunning, responsive, and performance-optimized marketing website built for an agricultural dealer management platform. It leverages a modern frontend stack to deliver a premium, mobile-first experience featuring interactive 3D elements, smooth localized navigation, and comprehensive dealer features.

---

## How to run it locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v22.2.0 or compatible)
- npm (Node Package Manager)

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Nishkal08/Prithvix_agritech_Marketing_Web.git
   cd Prithvix_agritech_Marketing_Web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview the production build locally:**
   ```bash
   npm run preview
   ```

---

## Tech stack and why you chose each

- **React (v18) & Vite (v5)**: 
  - *React* enables a highly componentized and declarative approach to building complex interactive UIs. 
  - *Vite* is inherently designed to be extremely fast. It provides instantaneous Hot Module Replacement (HMR) and optimized rollup production builds, resulting in lightning-fast development iterations.
  
- **Tailwind CSS (v3)**: 
  - Tailwind provides utility-first CSS classes, allowing for rapid and flexible styling without leaving the component code. It perfectly supports consistent themes, complex grid layouts, and fully responsive adjustments directly within React components.

- **GSAP (GreenSock Animation Platform) + ScrollTrigger**: 
  - Chosen for its unmatched robustness in executing complex sequence animations and scroll-linked interactivity. It provides far more control over staggering elements and pinpoint scroll pinning (e.g., sticky Features layout) compared to standard CSS animations.

- **Three.js**: 
  - Used for the bespoke Hero 3D interactive "Seed Growth" rendering scene. Three.js is the industry standard for lightweight, performant WebGL in-browser 3D capabilities.

- **Framer Motion**: 
  - Handles the lighter UI micro-animations and smooth page transitions (like the Contact Modal entry/exit and the dynamic Testimonials carousel).

- **Lucide-React**: 
  - An excellent, clean SVG icon library that fits seamlessly with the premium agricultural aesthetic of the website.

---

## Folder and component structure

The project is structured around standard component-based architecture logic:

```bash
/src
 ├── assets/          # Static files (images, icons, vectors, SVGs)
 ├── components/      # Reusable React components
 │   ├── 3d/          # Encapsulated Three.js models/scenes (CropField.jsx, cropFieldScene.js)
 │   ├── layout/      # Sitewide structure blocks (Navbar, Footer)
 │   ├── sections/    # Major page-level blocks (Hero, FeaturesSticky, Pricing, Testimonials, CTABanner, SplashScreen)
 │   └── ui/          # Granular primitive components (Button, Badge, SectionLabel, Logo)
 ├── context/         # React Context Providers
 │   └── LanguageContext.jsx # Global localization (i18n) data and state management (EN/HI)
 ├── data/            # Mocked platform data (features, stats, pricing, testimonials)
 ├── index.css        # Global CSS imports, Tailwind directives, custom font allocations
 ├── main.jsx         # App Entry Point
 └── App.jsx          # Component aggregator, layout routing, Lazy Loading implementations
```

---

## How the 3D scene is built and what triggers what

The 3D Hero scene features a procedural "Seed Growth" animation depicting agricultural prosperity.

1. **Rendering Logic (`cropFieldScene.js`)**: 
   - A vanilla Three.js class initializes a `WebGLRenderer`. 
   - The scene features a central geometric mesh representing a golden seed or central energy source, surrounded by particle rings ("spores", "water", "light") that represent crop vitality.
   - Ground plates provide a dynamic stylized field foundation.
   - The instance continuously redraws via `requestAnimationFrame` implementing an active, smooth idle animation loop.

2. **React Integration (`CropField.jsx`)**: 
   - The Three.js class is instantiated within a `useEffect` inside a React component binding to a `<canvas>` element ref.
   - Mouse tracking (`mousemove` listener) is captured to tilt the entire group (parallax effect), allowing users to physically interact with the 3D object dynamically.
   - Fallback graphics (`crop-field-fallback.svg`) deploy when WebGL availability fails.

3. **GSAP Scroll Control**: 
   - A ScrollTrigger timeline scales and translates the 3D container in `Hero.jsx` seamlessly off-screen as the user naturally scrolls downward into the Features section.

---

## What the mock data looks like and how you would replace it with a real API

Currently, data for language variants, pricing, and features live statically within `/context/LanguageContext.jsx` and the `/data/` namespace. 

**Example of Mock Data (Testimonials):**
```javascript
{
  quote: "AI ne ekdum sahi product suggest kiya... Farmer was very happy.",
  role: "Seed & Pesticide Dealer",
  location: "Nashik, Maharashtra",
  tag: "AI Agronomist"
}
```

**Replacing with a Real API:**
1. **API Endpoints:** Create dedicated, localized headless CMS endpoints (e.g., `GET /api/v1/content?lang=hi&section=pricing`).
2. **Data Fetching Hook:** Utilize a data fetching library like `TanStack React Query` or `SWR` inside the application layer.
3. **Refactoring Context:** The `LanguageContext.jsx` would be transformed to `fetch` standard dictionary mappings asynchronously from the server on load or locale toggle, caching the results instead of holding static arrays.

---

## What you would do differently with more time

- **React-Three-Fiber Integration**: I would port the vanilla Three.js scene (`cropFieldScene.js`) directly into entirely declarative React components using `@react-three/fiber` for tighter state management, easier responsive scaling, and superior unmounting lifecycle cleanup.
- **E2E Testing:** Implement Playwright or Cypress tests to rigorously ensure UI animations, GSAP sticky scrolling layouts, and locale switches don't break across distinct browsers (Safari, Firefox, Android Chrome).
- **Advanced State/SEO Pipeline**: Transition the site completely into **Next.js**. It provides out-of-the-box SSR (Server-Side Rendering) rendering for significantly augmented SEO and zero-layout shift, which is highly beneficial for pure marketing sites compared to a Vite standard SPA.
- **Accessibility (A11y)**: Expand `aria-labels`, focus-trap handlers (inside the demo modal), and screen-reader specific tags extensively to achieve WCAG AAA compliance.
