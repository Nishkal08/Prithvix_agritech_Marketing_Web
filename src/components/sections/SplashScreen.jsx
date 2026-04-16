import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { useLanguage } from '../../context/LanguageContext';

export default function SplashScreen({ onComplete }) {
  const { t } = useLanguage();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const wordmarkRef = useRef(null);
  const taglineRef = useRef(null);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    // Check if splash already seen this session
    if (sessionStorage.getItem('splashSeen')) {
      setSkip(true);
      onComplete?.();
      return;
    }

    // Wait for refs to be ready
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !container) return;

    // Three.js Leaf
    let animating = true;
    let renderer;

    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(200, 200);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (e) {
      console.warn('WebGL not supported for splash leaf');
      // Continue without 3D leaf
    }

    let leafGeo, leafMat;

    if (renderer) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, 4);

      const ambient = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambient);
      const pointLight = new THREE.PointLight(0xD4A853, 1.2, 20);
      pointLight.position.set(2, 2, 3);
      scene.add(pointLight);

      // Low-poly leaf
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, -1);
      leafShape.quadraticCurveTo(0.8, -0.3, 0.5, 0.5);
      leafShape.quadraticCurveTo(0.2, 1, 0, 1.2);
      leafShape.quadraticCurveTo(-0.2, 1, -0.5, 0.5);
      leafShape.quadraticCurveTo(-0.8, -0.3, 0, -1);

      leafGeo = new THREE.ExtrudeGeometry(leafShape, {
        steps: 1,
        depth: 0.08,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 1,
      });

      leafMat = new THREE.MeshStandardMaterial({
        color: 0x1A3C2B,
        emissive: 0xD4A853,
        emissiveIntensity: 0.1,
        roughness: 0.8,
      });

      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.scale.set(0.7, 0.7, 0.7);
      scene.add(leaf);

      function renderLoop() {
        if (!animating) return;
        requestAnimationFrame(renderLoop);
        leaf.rotation.y += 0.008;
        renderer.render(scene, camera);
      }
      renderLoop();
    }

    // GSAP Animation Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('splashSeen', 'true');
        onComplete?.();
      },
    });

    const logoEl = container.querySelector('.splash-logo');
    const wordLetters = wordmarkRef.current?.querySelectorAll('.letter');
    const tagline = taglineRef.current;

    // t=0.0s - Canvas fades in
    if (canvas) tl.from(canvas, { opacity: 0, duration: 0.4, ease: 'power2.out' }, 0);
    // t=0.3s - Logo fades in
    if (logoEl) tl.from(logoEl, { opacity: 0, scale: 0.85, duration: 0.6, ease: 'power2.out' }, 0.3);
    // t=0.9s - Letters stagger
    if (wordLetters && wordLetters.length > 0) {
      tl.from(wordLetters, { opacity: 0, y: 10, stagger: 0.05, duration: 0.4, ease: 'power2.out' }, 0.9);
    }
    // t=1.6s - Tagline
    if (tagline) tl.from(tagline, { opacity: 0, y: 10, duration: 0.5, ease: 'power2.out' }, 1.6);
    // Pause
    tl.to({}, { duration: 0.4 }, 2.2);
    // Fade out + slide up
    tl.to(container, { y: '-100vh', opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 2.6);

    return () => {
      animating = false;
      tl.kill();
      if (renderer) renderer.dispose();
      if (leafGeo) leafGeo.dispose();
      if (leafMat) leafMat.dispose();
    };
  }, []); // Empty deps — only run once

  if (skip) return null;

  const wordmark = 'PRITHVIX'.split('');

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-dark flex flex-col items-center justify-center"
    >
      <canvas ref={canvasRef} width={200} height={200} className="mb-6" />

      <div className="splash-logo mb-4">
        <svg width="50" height="50" viewBox="0 0 40 40" fill="none">
          <path
            d="M20 4C20 4 8 12 8 24C8 30.627 13.373 36 20 36C26.627 36 32 30.627 32 24C32 12 20 4 20 4Z"
            fill="#F5F0E8"
          />
          <path d="M20 10V32" stroke="#D4A853" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M20 16L14 20M20 22L13 25M20 28L15 30" stroke="#D4A853" strokeWidth="1" strokeLinecap="round" />
          <path d="M20 16L26 20M20 22L27 25M20 28L25 30" stroke="#D4A853" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </div>

      <div ref={wordmarkRef} className="flex">
        {wordmark.map((letter, i) => (
          <span
            key={i}
            className="letter font-display font-bold text-3xl md:text-4xl text-offwhite tracking-[0.15em]"
          >
            {letter}
          </span>
        ))}
      </div>

      <p
        ref={taglineRef}
        className="mt-4 font-body text-base text-muted tracking-[0.1em]"
      >
        {t.footer.tagline}
      </p>
    </div>
  );
}
