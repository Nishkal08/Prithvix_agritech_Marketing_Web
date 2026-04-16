import { useEffect, useRef } from 'react';
import { createMapScene } from './dashboardScene';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function DashboardGraphic({ className = '' }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const sceneAPI = createMapScene(canvas);
      sceneRef.current = sceneAPI;

      // Scroll reaction — float up as user scrolls past hero
      const st = ScrollTrigger.create({
        trigger: canvas.parentElement,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        onUpdate: (self) => {
          const progress = self.progress;
          // Scale it down slightly and rotate it flat as they scroll down
          sceneAPI.mapGroup.position.z = -progress * 5;
          // Slowly tilt the map forward into an orthographic/flat view
          sceneAPI.mapGroup.rotation.x = progress * 0.4;
          // Slow rotation
          sceneAPI.mapGroup.rotation.y = Math.PI / 4 + progress * 0.5;
        },
      });

      return () => {
        st.kill();
        sceneAPI.dispose();
      };
    } catch (err) {
      console.warn('WebGL not supported, showing fallback', err);
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
      {/* Fallback if WebGL fails — shown via CSS if canvas is empty */}
      <noscript>
        <div className="w-full h-full bg-surface rounded-lg flex items-center justify-center">
          <p className="text-muted font-body">3D scene requires WebGL</p>
        </div>
      </noscript>
    </div>
  );
}
