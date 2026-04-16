# AI Usage Log

## Master Prompts Used For Execution

### 1. Marketing Website (Part 1) Master Prompt
**Goal**: Build a responsive marketing homepage with a WebGL 3D splash screen and dynamic interactive sections.

**Prompt used**:
> give me master prompt to develop 1st task with all the mentioned features and details.
> Marketing Website
> — a premium landing page for Prithvix targeting agricultural dealersacross rural India
> 
> prompt should contain all the design and development principles.
> the website should be minimal and user friendly. It should contain smooth animations and transitions.
> 
> use mern stack , tailwind css, javascript ,gsap , framer motion and any other library to develop this.
> ask me wherever you need my opinion
> work like a senior developer and exprience ui ux designer
> 
> # PRITHVIX — Premium AgriTech Marketing Website
> ## Master Development Prompt
> 
> ---
> 
> ## ROLE & MINDSET
> 
> You are a senior full-stack developer and experienced UI/UX designer building a
> premium marketing website for Prithvix — an AgriTech dealer management platform.
> Think Linear.app meets Indian agriculture. Every decision must balance modern,
> minimal aesthetics with rural India trustworthiness. The site targets agricultural
> input dealers (fertilizer, pesticide, seed shops) across rural India — they are
> practical, busy people. The design must feel premium but never cold or corporate.
> 
> ---
> 
> ## WHAT IS PRITHVIX
> 
> Prithvix is an AgriTech dealer management app that helps agricultural input dealers:
> - Manage farmers and their profiles
> - Track field visits and log sales
> - Handle credit/Udhaar (Khata system)
> - Manage inventory and stock alerts
> - Generate QR-based farmer ID cards
> - Get AI-powered crop advice in 5 languages (English, Hindi, Marathi, Gujarati, Rajasthani)
> 
> The mobile app is already live. This website is the marketing front for it.
> 
> ---
> 
> ## TECH STACK
> 
> Framework:       React (Vite) — NOT Next.js, use React Router v6 for routing
> 3D Engine:       Three.js (vanilla, not R3F — for precise control)
> Animations:      GSAP + ScrollTrigger (primary), Framer Motion (micro-interactions)
> Styling:         Tailwind CSS v3 with custom theme config
> Charts (stats):  CountUp.js for animated number counters
> Icons:           Lucide React
> Fonts:           Google Fonts — Syne (display headings) + Plus Jakarta Sans (body)
> Build:           Vite
> Deploy:          Vercel
> 
> Package installs:
>   npm install gsap @gsap/react framer-motion three lucide-react
>   npm install countup.js react-countup
>   npm install -D tailwindcss postcss autoprefixer
> 
> ---
> 
> ## BRAND & DESIGN SYSTEM
> 
> ### Color Palette
>   --color-forest:     #1A3C2B   (primary — deep forest green)
>   --color-gold:       #D4A853   (accent — warm harvest gold)
>   --color-offwhite:   #F5F0E8   (background — warm paper)
>   --color-dark:       #0E1A14   (near-black for dark sections)
>   --color-muted:      #6B7C6E   (secondary text — sage)
>   --color-surface:    #EDE8DF   (card surface — slightly darker offwhite)
>   --color-border:     #D6CFC3   (subtle borders)
>   --color-gold-light: #F0D898   (gold tint for hover states)
> 
> Tailwind custom config (tailwind.config.js):
>   theme: {
>     extend: {
>       colors: {
>         forest:   '#1A3C2B',
>         gold:     '#D4A853',
>         offwhite: '#F5F0E8',
>         dark:     '#0E1A14',
>         muted:    '#6B7C6E',
>         surface:  '#EDE8DF',
>       },
>       fontFamily: {
>         display: ['Syne', 'sans-serif'],
>         body:    ['Plus Jakarta Sans', 'sans-serif'],
>       },
>     }
>   }
> 
> ### Typography
>   Display headings:  Syne — 700 weight, tight tracking (-0.02em)
>   Section headings:  Syne — 600 weight
>   Body text:         Plus Jakarta Sans — 400/500 weight, 1.7 line-height
>   Labels/tags:       Plus Jakarta Sans — 500, 0.08em letter-spacing, uppercase
>   Numbers/stats:     Syne — 700, large size
> 
>   Font size scale:
>     Hero H1:    clamp(52px, 7vw, 96px)
>     Section H2: clamp(36px, 4vw, 56px)
>     Sub H3:     clamp(22px, 2.5vw, 32px)
>     Body:       16px / 18px
>     Small:      13px / 14px
> 
> ### UI Principles — STRICTLY FOLLOW
>   1. Minimal — maximum 3 visual elements per section. White space is a design element.
>   2. No purple gradients, no neon, no typical startup aesthetics.
>   3. Earthy textures > flat color blocks. Use subtle grain/noise on section backgrounds.
>   4. Animations feel like growth — slow, smooth, intentional. Never bounce or spring.
>   5. Every animation has a purpose. No decorative motion just for show.
>   6. Mobile-first. Every component tested at 375px, 768px, 1280px, 1440px.
>   7. GSAP is the primary animation engine — Framer Motion only for hover/tap states.
>   8. Transitions between sections: 0.6s ease, never instant cuts.

**What AI gave you**: 
Boilerplate scaffolding using Vite, standard Tailwind configuration, and an initial `CropField.jsx` 3D canvas mesh implementation using Three.js basics along with GSAP configurations.

**What you changed**:
Tuned the Tailwind global configuration for the exact requested color palette (`#1A3C2B`, etc.). Adjusted the 3D WebGL element's rotation speed and lighting materials to feel more organic and grounded rather than erratic, aligning with the "kisan meets enterprise" objective.

**Final call**: 
Shipped the optimized React Three Fiber implementation as the core Splash sequence and robust landing page framework.

---

### 2. ERP Web Portal (Part 2) Master Prompt
**Goal**: Create a distinct, heavily structured application dashboard separate from the marketing site, protected by distinct roles (Dealer vs. Staff).

**Prompt used**:
> now 1st part of the website is developed completely with deployment.
> go through the technicalities and functionaltiy of 2nd part and give me a master prompt to develop it with seamless intergration with current website , like its mentioned in the pdf.
> 
> the design should be relavant to current theme of the website with fundamental design principles mentioned in the guide.
> 
> the final output product should be according the guide and its design shouldn't feel ai developed , it should must feel like developed by a exprienced uiux designer and developer.
> 
> all the rules , description and steps mentioned in the pdf should be followed for developing 2nd part.
> 
> ask me whererver you need my opnion dont go with any assumptions
> 
> # PRITHVIX ERP Web Portal — Part 2 Master Prompt
> ## Seamless integration with existing Prithvix marketing website
> 
> ---
> 
> ## ROLE & MINDSET
> 
> You are a senior full-stack developer and experienced UI/UX designer continuing
> work on the Prithvix product. Part 1 (marketing website) is already live. You are
> now building Part 2 — the ERP Web Portal — inside the same Vite + React codebase,
> accessible at /dashboard.
> 
> The ERP must feel like a natural continuation of the marketing site. Same fonts,
> same color tokens, same component language. A dealer who clicks "Request Demo"
> on the marketing site and lands on the ERP dashboard should feel zero visual
> discontinuity. One product, two surfaces.
> 
> Design standard: Linear.app quality for the UX, earthy Prithvix brand for the
> aesthetics. Every screen must look like it was designed by an experienced product
> designer, not assembled from a component library. Spacing, hierarchy, and empty
> states all receive the same care as the primary flows.
> 
> ---
> 
> ## INTEGRATION WITH PART 1
> 
> Existing codebase already has:
>   - Vite + React with React Router v6
>   - Tailwind CSS with Prithvix custom theme
>   - GSAP + Framer Motion installed
>   - /src/data/ folder pattern established
>   - Design tokens: forest, gold, offwhite, dark, muted, surface
> 
> Part 2 additions to the SAME repo:
>   - New routes under /dashboard/* (protected, require auth)
>   - New /src/components/erp/ folder
>   - New /src/components/shared/ additions (reuse existing Button, Badge etc.)
>   - New /src/data/erp/ subfolder for all ERP mock data
>   - New /src/context/AuthContext.jsx and DashboardContext.jsx
>   - New /src/hooks/erp/ subfolder
> 
> DO NOT modify any existing marketing site components.
> DO NOT change tailwind.config.js — extend only if needed.
> The /dashboard route must be completely isolated from marketing routes.

**What AI gave you**: 
A standard layout wrapper (`DashboardShell`) along with `AuthContext` and `RoleContext` which conditionally rendered components like the `Analytics` charts. Mock Data layers mapped to state interfaces and Recharts implementations for the analytics pages.

**What you changed**:
Re-wrote the internal conditional rendering to implement a UI-friendly strategy instead of blanking out entire pages. Specifically, added "Restricted for Staff" lockscreen views within the `Settings` page and removed only the destructive buttons inside Udhaar, preserving read-only dues visibility. Overhauled the global `globals.css` variable injections to support the custom Earthy Dark mode toggle natively matching `.dark` attributes organically across every single metric card and widget boundary.

**Final call**: 
Shipped a unified Sidebar/TopBar dashboard layout with hardened Context-layer access controls, fluid AI Chat error fallbacks, and GSAP lateral interpolations for the interactive Crop Calendar timeline.

---

## Technical Details Tweaks

### Feature: Earthy Forest Dark Mode
**Prompt used**: "Refactor the existing ERP page logic to support a custom dark mode that uses an 'Earthy Forest Palette'. Switch out all hardcoded colors for semantic Tailwind variables like bg-panel and text-dark."
**What AI gave you**: A global CSS file mapping variables under `.dark` and bulk edits extending semantic utility classes across the `DashboardHome`, `Analytics`, and `Settings` blocks.
**What you changed**: Tweaked specific opacity values (`#F5E6C8` vs `bg-gold/15`) to ensure components like `StatusBadge` and `SkeletonRow` had standard accessible contrast ratios in *both* light and dark variants.
**Final call**: Shipped full global SCSS/CSS variables applied dynamically across 100% of the UI.

### Feature: GSAP Interactive Crop Calendar
**Prompt used**: "The crop calendar is currently a static grid. Use GSAP to execute a smooth scrolling sequence so that when I click a specific month header, the timeline auto-pans to that date. Wrap the timeline blocks in Framer Motion for hover bounds."
**What AI gave you**: A comprehensive JS ref-scroll implementation mapping DOM nodes for GSAP's `scrollLeft` tween, mixed with `layoutId` logic from `framer-motion` to handle tooltip expansion.
**What you changed**: Adjusted the GSAP easing to `power2.out` for a significantly smoother snapping feel, and modified the width padding offsets so the active month centered perfectly in the viewport.
**Final call**: Shipped the advanced GSAP calendar interpolation.

### Feature: AI Agronomist Chat API
**Prompt used**: "Implement a chat UI with an Anthropic SDK backend. Include a robust try/catch fallback so if the API returns a 400 Billing Error (zero credits), the UI doesn't crash but displays a friendly demo indicator."
**What AI gave you**: Complete chat interface (`AIChat.jsx`) with message mapping, typing indicators, and async API logic intercepting the error code.
**What you changed**: Added localized language hints based on the active tab so Claude explicitly responds in the correct Indian dialect framework before returning the text to state.
**Final call**: Shipped the chat UI featuring live SDK queries and a resilient offline visual fallback mode.
