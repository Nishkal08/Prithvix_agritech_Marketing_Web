import { useEffect, useRef } from 'react';
import { createCropFieldScene } from './cropFieldScene';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CropField({ className = '' }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const sceneAPI = createCropFieldScene(canvas);
      sceneRef.current = sceneAPI;

      // Scroll reaction — zoom in as user scrolls past hero
      const st = ScrollTrigger.create({
        trigger: canvas.parentElement,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        onUpdate: (self) => {
          const progress = self.progress;
          sceneAPI.camera.position.z = 10 - progress * 4;
          sceneAPI.fieldGroup.rotation.y += progress * 0.001;
        },
      });

      return () => {
        st.kill();
        sceneAPI.dispose();
      };
    } catch (err) {
      console.warn('WebGL not supported, showing fallback');
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
