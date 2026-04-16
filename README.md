# Prithvix — AgriTech Dealer Management App

This repository contains the complete frontend architecture for Prithvix, an AgriTech dealer management platform. It includes both a high-conversion 3D Marketing Website and a robust Role-Based ERP Web Portal (accessible via `/dashboard`).

This project was built as an Intern Assignment.

## 🚀 How to Run Locally

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Anthropic API Key (required for the AI Agronomist Chat):
   ```
   VITE_CLAUDE_API_KEY=your_api_key_here
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` to view the Marketing Site, or navigate to `http://localhost:5173/dashboard` for the ERP Portal.

## 🏗 Tech Stack & Trade-offs

- **Framework**: **React + Vite**. *Trade-off Exception*: The assignment specified Next.js, but Vite + React Router was chosen to optimize the rapid 3-day development timeline for a heavy client-side dashboard without SSR requirements. It significantly reduced routing complexity for horizontal page transitions.
- **3D Graphics**: **React Three Fiber / Three.js**. Used for the low-poly agricultural splash screen and interactive parallax hero elements. 
- **Animations**: **Framer Motion & GSAP**. Framer Motion handles universal page transitions and layout bounding (e.g. Activity Bars opening), while GSAP powers custom imperative animations like the interactive horizontal scroll on the Crop Calendar.
- **Styling**: **Tailwind CSS**. Augmented with standard CSS variables (`globals.css`) to create the premium earthy-forest dark mode toggle smoothly.
- **Charts / Maps**: **Recharts** and **Leaflet.js** (with React Leaflet) for data visualization and heatmaps.

## 📂 Folder & Component Structure

```text
src/
├── assets/          # Static images & graphics
├── components/      
│   ├── 3d/          # React Three Fiber Canvas scenes (Hero, Splash)
│   ├── layout/      # Universal layouts (Navbar, Footer)
│   ├── sections/    # Marketing landing page sections
│   ├── ui/          # Generic reusable atoms (Buttons, Badges, Labels)
│   └── erp/         # ERP Dashboard Modules
│       ├── layout/  # Sidebar, TopBar, DashboardShell
│       ├── pages/   # Role-gated views (Inventory, Analytics, Chat)
│       └── ui/      # Dashboard-specific elements (KPI cards, Modals)
├── config/          # RBAC configuration schema
├── context/         # Auth, Roles, Display Settings Providers 
├── data/            # Static Mock Data for offline resilience
└── styles/          # Tailwind setup, CSS variables, custom typography
```

## 🌍 The 3D Scene Architecture

The interactive marketing experience is driven by React Three Fiber isolated components (`CropField.jsx`, `DashboardGraphic.jsx`). 
- On initial load, a low-poly earth/crop geometric plane acts as the particle base. 
- As the user scrolls, Framer Motion captures the scroll offset to trigger soft parallax translation of the 3D meshes to provide a "grounded, growing" feel rather than bouncing. If WebGL fails, CSS standard images handle the fallback.

## 🔌 API Integration & Mock Data

Currently, all ERP dashboard states (Farmers, Inventory, Credits) are hydrated from the `src/data/erp/` directory. 
- **Replacing with Real API**: To move to a real backend, you would swap the local Context hydration calls with a fetching layer (e.g. `React Query` or standard `fetch` endpoints pulling from a Node/Express server), and map the JSON response structurally to match the `farmers`, `inventory`, and `cropCalendar` schemas.

## 🔮 What I Would Do Differently With More Time

1. **Robust Backend Integration**: I would migrate the mock Context stores to a fully authenticated backend database (Supabase / MongoDB) featuring actual JWT route protections.
2. **Advanced Caching**: Introduce specific service workers for an offline-first PWA experience (highly critical for rural agritech dealers on low-bandwidth networks).
3. **Printable Generation**: Generate the Farmer QR Identity Cards as an actual downloadable PDF asset using `jspdf`.
