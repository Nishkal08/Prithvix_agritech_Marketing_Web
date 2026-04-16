import * as THREE from 'three';

export function createCropFieldScene(canvas, options = {}) {
  const { width = 600, height = 560 } = options;

  // 1. Renderer System
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 2. Scene Configuration
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xF5F0E8, 0.05); // Smooth background blending

  // 3. Grounded Camera
  // Using a grounded, human-scale perspective instead of top-down
  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
  camera.position.set(2, 2.5, 9);
  camera.lookAt(0, -0.5, 0);

  // 4. Earthy Lighting Rig
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Warm Sunrise directional light cast over the field
  const sunLight = new THREE.DirectionalLight(0xffdca8, 1.2);
  sunLight.position.set(-6, 8, 4);
  scene.add(sunLight);

  // Cool sky fill light to balance shadows
  const skyLight = new THREE.DirectionalLight(0x8bc0ff, 0.5);
  skyLight.position.set(5, 5, -5);
  scene.add(skyLight);

  const fieldGroup = new THREE.Group();
  scene.add(fieldGroup);

  // Array to collect dynamic geometries for flawless diposing
  const disposables = [];

  // 5. Structure: Soil Rows & Water Trenches
  const rowCount = 7;
  const rowLength = 16;
  const rowSpacing = 1.3;

  const soilMat = new THREE.MeshStandardMaterial({
    color: 0x3E2723, // Deep brown
    roughness: 0.9,
    flatShading: true,
  });
  disposables.push(soilMat);

  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x29B6F6, // Vibrant clean water
    roughness: 0.1,
    metalness: 0.2,
    transparent: true,
    opacity: 0.85,
    flatShading: true,
  });
  disposables.push(waterMat);

  for (let i = 0; i < rowCount; i++) {
    const offsetX = (i - Math.floor(rowCount / 2)) * rowSpacing;

    // A. Create Low-Poly Soil Ridges
    const soilGeo = new THREE.BoxGeometry(0.8, 0.5, rowLength, 4, 1, 12);
    const posAttr = soilGeo.getAttribute('position');
    for (let j = 0; j < posAttr.count; j++) {
      const y = posAttr.getY(j);
      if (y > 0) { // Perturb only top vertices for rocky/uneven soil
        posAttr.setY(j, y + (Math.random() - 0.5) * 0.15);
        posAttr.setX(j, posAttr.getX(j) + (Math.random() - 0.5) * 0.1);
      }
    }
    soilGeo.computeVertexNormals();
    disposables.push(soilGeo);

    const soilMesh = new THREE.Mesh(soilGeo, soilMat);
    soilMesh.position.set(offsetX, -0.25, 0);
    fieldGroup.add(soilMesh);

    // B. Create Irrigation Trenches (between rows)
    if (i < rowCount - 1) {
      const waterGeo = new THREE.PlaneGeometry(0.5, rowLength, 2, 8);
      const wPos = waterGeo.getAttribute('position');
      for (let j = 0; j < wPos.count; j++) {
        wPos.setZ(j, wPos.getZ(j) + (Math.random() - 0.5) * 0.05); // low poly ripples
      }
      waterGeo.computeVertexNormals();
      disposables.push(waterGeo);

      const waterMesh = new THREE.Mesh(waterGeo, waterMat);
      waterMesh.rotation.x = -Math.PI / 2;
      waterMesh.position.set(offsetX + rowSpacing / 2, -0.35, 0);
      fieldGroup.add(waterMesh);
    }
  }

  // 6. Foliage Elements (Instanced Mesh)
  // Low-poly 'Sprout' represented by a stylized cone
  const cropGeo = new THREE.ConeGeometry(0.18, 0.7, 4);
  cropGeo.translate(0, 0.35, 0); // Shift pivot to base so scaling grows upward
  disposables.push(cropGeo);

  const cropMat = new THREE.MeshStandardMaterial({
    color: 0x4CAF50, // Vibrant healthy green
    roughness: 0.7,
    flatShading: true,
  });
  disposables.push(cropMat);

  const plantsPerRow = 14;
  const totalPlants = rowCount * plantsPerRow;
  const cropInstanced = new THREE.InstancedMesh(cropGeo, cropMat, totalPlants);

  const dummy = new THREE.Object3D();
  const plantData = []; // Store organic growth metrics

  let instanceIdx = 0;
  for (let i = 0; i < rowCount; i++) {
    const rowX = (i - Math.floor(rowCount / 2)) * rowSpacing;

    for (let j = 0; j < plantsPerRow; j++) {
      // Linear placement along the row length
      const rowZ = (j - Math.floor(plantsPerRow / 2)) * (rowLength / plantsPerRow);

      // Random organic scattering
      const x = rowX + (Math.random() - 0.5) * 0.25;
      const z = rowZ + (Math.random() - 0.5) * 0.25;

      // Determine Growth Map Component
      // Plants in the back (negative Z) are fully grown, front are small
      const distanceMapped = (z + rowLength / 2) / rowLength; // 0 (back) to 1 (front)
      const maxScale = 0.4 + (1 - distanceMapped) * 1.0 + (Math.random() * 0.3); // Organic height variance

      const rotY = Math.random() * Math.PI * 2;

      plantData.push({
        x,
        z,
        targetScale: maxScale,
        currentScale: 0.05, // Starts as a tiny seed, grows gracefully
        rotY,
        phase: Math.random() * Math.PI * 2, // Wind phase offset
      });

      dummy.position.set(x, 0, z);
      dummy.scale.set(0, 0, 0);
      dummy.rotation.set(0, rotY, 0);
      dummy.updateMatrix();
      cropInstanced.setMatrixAt(instanceIdx, dummy.matrix);

      instanceIdx++;
    }
  }

  fieldGroup.add(cropInstanced);

  // 7. Interaction & Motion State
  let mouseX = 0;
  let mouseY = 0;
  let targetCamX = 2;
  let targetCamY = 2.5;
  let animating = true;
  const clock = new THREE.Clock();

  const handleMouseMove = (e) => {
    // Tamed, subtle mouse range (-1 to 1) Let's reduce bounds greatly
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  const handleResize = () => {
    const container = canvas.parentElement;
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };

  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  window.addEventListener('resize', handleResize, { passive: true });

  // 8. Animation Loop
  function animate() {
    if (!animating) return;
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Iterate Foliage - Trigger "Growth" interpolation and wind physics
    for (let i = 0; i < totalPlants; i++) {
      const d = plantData[i];

      // Extremely smooth, organic growth curve easing towards TargetScale dynamically
      d.currentScale += (d.targetScale - d.currentScale) * 0.015;

      // Soft wind simulation mapping time & local coordinates so neighbors share gusts
      // The larger the scale, the more affected by wind geometry it is.
      const windX = Math.sin(time * 1.2 + d.x * 2.0 + d.z * 1.5 + d.phase) * 0.06 * d.currentScale;
      const windZ = Math.cos(time * 0.8 + d.x * 1.0 + d.z * 2.0 + d.phase) * 0.06 * d.currentScale;

      dummy.position.set(d.x, 0.05, d.z);

      // Apply unified organic scaling to form crops
      dummy.scale.set(d.currentScale, d.currentScale, d.currentScale);

      // Rustle
      dummy.rotation.set(windX, d.rotY, windZ);
      dummy.updateMatrix();

      cropInstanced.setMatrixAt(i, dummy.matrix);
    }
    cropInstanced.instanceMatrix.needsUpdate = true;

    // Very grounded parallax camera - User observes rather than rides a ride.
    targetCamX = 1 + mouseX * 0.8;
    targetCamY = 2.5 - mouseY * 0.4; // inverted mapping slightly for realistic tilt

    camera.position.x += (targetCamX - camera.position.x) * 0.03;
    camera.position.y += (targetCamY - camera.position.y) * 0.03;

    // Organic breathing zoom
    camera.position.z = 8 + Math.sin(time * 0.4) * 0.2;

    camera.lookAt(0, -0.5, 0);

    renderer.render(scene, camera);
  }

  animate();
  handleResize();

  // Public API Disposer
  return {
    camera,
    fieldGroup,
    renderer,
    scene,
    dispose() {
      animating = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      disposables.forEach((item) => {
        if (item.dispose) item.dispose();
      });
    },
  };
}
