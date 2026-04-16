import * as THREE from 'three';

export function createMapScene(canvas) {
  // 1. Setup Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 2. Setup Scene & Camera
  const scene = new THREE.Scene();
  // Isotropic isometric camera look
  const camera = new THREE.PerspectiveCamera(
    35,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 8, 12);
  camera.lookAt(0, 0, 0);

  // 3. Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(5, 10, 5);
  dirLight.castShadow = false; // Keep it clean and performant
  scene.add(dirLight);

  const goldAccentLight = new THREE.PointLight(0xd4a853, 2, 10);
  goldAccentLight.position.set(0, 2, 0);
  scene.add(goldAccentLight);

  // 4. Materials
  // Premium forest green base
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x1a3c2b,
    roughness: 0.9,
    metalness: 0.1,
  });

  // Soft offwhite for grid/roads
  const gridMat = new THREE.LineBasicMaterial({
    color: 0xf5f0e8,
    transparent: true,
    opacity: 0.15,
  });

  // Solid gold for pins
  const pinMat = new THREE.MeshStandardMaterial({
    color: 0xd4a853,
    roughness: 0.3,
    metalness: 0.6,
    emissive: 0xd4a853,
    emissiveIntensity: 0.2,
  });

  // Pulsing rings material
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xd4a853,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide,
  });

  // 5. Build the Scene Hierarchy
  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  const mapGroup = new THREE.Group();
  rootGroup.add(mapGroup);

  // The Land Tile
  const baseGeo = new THREE.BoxGeometry(6, 0.4, 6);
  // Add a subtle bevel effect manually or just use a box
  const baseTile = new THREE.Mesh(baseGeo, baseMat);
  baseTile.position.y = -0.2;
  mapGroup.add(baseTile);

  // The Grid Lines
  const gridGroup = new THREE.Group();
  const gridSize = 6;
  const gridDivisions = 6;
  const step = gridSize / gridDivisions;
  
  for (let i = 0; i <= gridDivisions; i++) {
    const pos = -gridSize / 2 + i * step;
    
    // Horizontal lines
    const hGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(pos, 0.01, -gridSize/2),
      new THREE.Vector3(pos, 0.01, gridSize/2)
    ]);
    const hLine = new THREE.Line(hGeo, gridMat);
    gridGroup.add(hLine);

    // Vertical lines
    const vGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-gridSize/2, 0.01, pos),
      new THREE.Vector3(gridSize/2, 0.01, pos)
    ]);
    const vLine = new THREE.Line(vGeo, gridMat);
    gridGroup.add(vLine);
  }
  mapGroup.add(gridGroup);

  // Create a Pin Geometry (Cone + Sphere)
  const createPinGeometry = () => {
    const pinGeo = new THREE.BufferGeometry();
    const coneGeo = new THREE.ConeGeometry(0.12, 0.4, 16);
    coneGeo.translate(0, 0.2, 0); // Base at 0
    const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16);
    sphereGeo.translate(0, 0.45, 0);
    
    // Extremely lightweight merge alternative (just use a group)
    return { coneGeo, sphereGeo };
  };
  const geometries = createPinGeometry();

  // Add Pins to Map
  const pinData = [
    { x: -1.5, z: -1.0, delay: 0 },
    { x: 1.2, z: -1.8, delay: 1.2 },
    { x: 0.5, z: 1.5, delay: 0.5 },
    { x: -1.8, z: 1.8, delay: 2.1 },
    { x: 2.0, z: 0.2, delay: 1.8 },
  ];

  const pins = [];
  const rings = [];

  const ringGeo = new THREE.RingGeometry(0.2, 0.25, 32);

  pinData.forEach(data => {
    const pinGroup = new THREE.Group();
    
    const cone = new THREE.Mesh(geometries.coneGeo, pinMat);
    const sphere = new THREE.Mesh(geometries.sphereGeo, pinMat);
    
    // Point the cone tip down
    cone.rotation.x = Math.PI;
    cone.position.y = 0.6; // Shift up because we inverted it
    sphere.position.y = 0.6; // Shift sphere up above cone
    
    pinGroup.add(cone);
    pinGroup.add(sphere);
    
    pinGroup.position.set(data.x, 0, data.z);
    
    // Save metadata for animation
    pinGroup.userData = { 
      delay: data.delay,
      initialY: 0,
      active: false
    };
    
    mapGroup.add(pinGroup);
    pins.push(pinGroup);

    // Pulse Ring
    const ring = new THREE.Mesh(ringGeo, ringMat.clone());
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(data.x, 0.02, data.z);
    ring.userData = { delay: data.delay };
    mapGroup.add(ring);
    rings.push(ring);
  });

  // Initial map rotation
  mapGroup.rotation.y = Math.PI / 4;
  
  // 6. Interaction & Animation State
  let mouse = { x: 0, y: 0 };
  let targetRotation = { x: 0, y: 0 };

  const onMouseMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    mouse.x = x * 0.1;
    mouse.y = -y * 0.1;
  };

  const handleResize = () => {
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (parent) {
      renderer.setSize(parent.clientWidth, parent.clientHeight, false);
      camera.aspect = parent.clientWidth / parent.clientHeight;
      camera.updateProjectionMatrix();
    }
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', handleResize);
  setTimeout(handleResize, 50);

  // 7. Render Loop
  let raf;
  const loop = () => {
    raf = requestAnimationFrame(loop);
    const time = Date.now() * 0.001;

    // Smooth mouse parallax
    targetRotation.x += (mouse.y - targetRotation.x) * 0.05;
    targetRotation.y += (mouse.x - targetRotation.y) * 0.05;
    rootGroup.rotation.x = targetRotation.x;
    rootGroup.rotation.y = targetRotation.y;

    // Gentle floating of the entire map
    mapGroup.position.y = Math.sin(time * 1.5) * 0.1;

    // Animate pins and rings
    pins.forEach((pin, i) => {
      const ring = rings[i];
      const t = (time + pin.userData.delay) % 3.0; // 3 second cycle

      if (t < 0.5) {
        // Drop animation
        const dropProgress = t / 0.5;
        // Ease out bounce math approximation
        let ease = 1 - Math.pow(1 - dropProgress, 3);
        pin.position.y = 2 - (ease * 2);
        
        ring.scale.set(0.1, 0.1, 0.1);
        ring.material.opacity = 0;
      } else {
        // Resting / Floating slightly
        pin.position.y = Math.sin((time + pin.userData.delay) * 3) * 0.05;
        
        // Ring pulsing out
        const ringProgress = (t - 0.5) / 2.5; // remaining 2.5 seconds
        ring.scale.setScalar(0.1 + ringProgress * 3);
        ring.material.opacity = 0.8 * (1 - ringProgress);
      }
    });

    renderer.render(scene, camera);
  };
  loop();

  return {
    camera,
    rootGroup,
    mapGroup,
    dispose: () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
      baseGeo.dispose();
      baseMat.dispose();
      gridMat.dispose();
      pinMat.dispose();
      ringMat.dispose();
      ringGeo.dispose();
      geometries.coneGeo.dispose();
      geometries.sphereGeo.dispose();
    },
  };
}
