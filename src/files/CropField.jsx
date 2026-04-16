/**
 * CropField.jsx
 * React wrapper for the Three.js CropFieldScene
 * Handles mount/unmount lifecycle, GSAP scroll integration
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CropFieldScene } from './cropFieldScene';

gsap.registerPlugin(ScrollTrigger);

// WebGL support check
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export default function CropField({ className = '' }) {
  const canvasRef   = useRef(null);
  const sceneRef    = useRef(null);
  const wrapperRef  = useRef(null);
  const webglOk     = isWebGLAvailable();

  useEffect(() => {
    if (!webglOk || !canvasRef.current) return;

    // Small delay so the canvas has final dimensions
    const timer = setTimeout(() => {
      sceneRef.current = new CropFieldScene(canvasRef.current);

      // GSAP ScrollTrigger — pass scroll progress into scene
      const st = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        onUpdate: (self) => {
          sceneRef.current?.setScrollProgress(self.progress);
        },
      });

      // Entrance animation — canvas fades + scales in
      gsap.from(canvasRef.current, {
        opacity: 0,
        scale: 0.94,
        duration: 1.2,
        delay: 0.4,
        ease: 'power2.out',
      });

      return () => st.kill();
    }, 100);

    return () => {
      clearTimeout(timer);
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [webglOk]);

  if (!webglOk) {
    // Static SVG fallback
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <img
          src="/assets/crop-field-fallback.svg"
          alt="Prithvix crop field illustration"
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ touchAction: 'none' }}
        aria-hidden="true"
      />
    </div>
  );
}
