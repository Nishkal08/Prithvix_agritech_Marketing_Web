import * as THREE from 'three';

export function createCropFieldScene(canvas, options = {}) {
  const { width = 600, height = 560 } = options;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 4, 10);
  camera.lookAt(0, 0, 0);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xF5F0E8, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xD4A853, 1.2);
  dirLight.position.set(5, 8, 5);
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0x1A3C2B, 0.4);
  pointLight.position.set(-3, 2, 3);
  scene.add(pointLight);

  // Field group
  const fieldGroup = new THREE.Group();
  scene.add(fieldGroup);

  // Ground Plane
  const groundGeo = new THREE.PlaneGeometry(12, 12, 20, 20);
  const posAttr = groundGeo.getAttribute('position');
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    posAttr.setZ(i, (Math.sin(x * 0.5) * Math.cos(y * 0.5)) * 0.15);
  }
  groundGeo.computeVertexNormals();

  const groundMat = new THREE.MeshLambertMaterial({ color: 0x2D5A3D });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.5;
  fieldGroup.add(ground);

  // Grid lines overlay
  const edgesGeo = new THREE.EdgesGeometry(groundGeo);
  const edgesMat = new THREE.LineBasicMaterial({ color: 0x1A3C2B, transparent: true, opacity: 0.3 });
  const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
  edgesMesh.rotation.x = -Math.PI / 2;
  edgesMesh.position.y = -0.49;
  fieldGroup.add(edgesMesh);

  // Wheat stalks
  const stalkCount = 70;
  const stalkGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.8, 4);
  const headGeo = new THREE.SphereGeometry(0.06, 4, 4);

  const greenColor = new THREE.Color(0x8B9D4F);
  const goldColor = new THREE.Color(0xD4A853);

  // InstancedMesh for stalks
  const stalkMat = new THREE.MeshLambertMaterial({ color: greenColor });
  const stalkInstanced = new THREE.InstancedMesh(stalkGeo, stalkMat, stalkCount);

  const headMat = new THREE.MeshLambertMaterial({ color: goldColor });
  const headInstanced = new THREE.InstancedMesh(headGeo, headMat, stalkCount);

  const dummy = new THREE.Object3D();
  const stalkData = [];
  const gridSize = Math.ceil(Math.sqrt(stalkCount));
  const spacing = 8 / gridSize;

  for (let i = 0; i < stalkCount; i++) {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    const x = (col - gridSize / 2) * spacing + (Math.random() - 0.5) * 0.6;
    const z = (row - gridSize / 2) * spacing + (Math.random() - 0.5) * 0.6;
    const scale = 0.85 + Math.random() * 0.3;
    const rotY = Math.random() * Math.PI * 2;

    // Stalk
    dummy.position.set(x, scale * 0.4 - 0.5, z);
    dummy.scale.set(1, scale, 1);
    dummy.rotation.set(0, rotY, 0);
    dummy.updateMatrix();
    stalkInstanced.setMatrixAt(i, dummy.matrix);

    // Color variation: mix green and gold
    const mixFactor = Math.random() * 0.5;
    const stalkColor = new THREE.Color().copy(greenColor).lerp(goldColor, mixFactor);
    stalkInstanced.setColorAt(i, stalkColor);

    // Head
    dummy.position.set(x, scale * 0.8 - 0.5, z);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    headInstanced.setMatrixAt(i, dummy.matrix);

    stalkData.push({ x, z, scale, rotY, index: i });
  }

  stalkInstanced.instanceMatrix.needsUpdate = true;
  if (stalkInstanced.instanceColor) stalkInstanced.instanceColor.needsUpdate = true;
  headInstanced.instanceMatrix.needsUpdate = true;

  fieldGroup.add(stalkInstanced);
  fieldGroup.add(headInstanced);

  // State
  let mouseX = 0;
  let mouseY = 0;
  let targetCamX = 0;
  let targetCamY = 4;
  let animating = true;
  const clock = new THREE.Clock();

  // Mouse move handler
  const handleMouseMove = (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  // Resize handler
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

  // Animation loop
  function animate() {
    if (!animating) return;
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Lazy turntable
    fieldGroup.rotation.y += 0.002;

    // Wind sway on stalks
    for (let i = 0; i < stalkCount; i++) {
      const d = stalkData[i];
      dummy.position.set(d.x, d.scale * 0.4 - 0.5, d.z);
      dummy.scale.set(1, d.scale, 1);
      dummy.rotation.set(0, d.rotY, Math.sin(time * 0.8 + i * 0.3) * 0.06);
      dummy.updateMatrix();
      stalkInstanced.setMatrixAt(i, dummy.matrix);

      // Head follows stalk
      const headY = d.scale * 0.8 - 0.5 + Math.sin(time * 0.8 + i * 0.3) * 0.02;
      const headX = d.x + Math.sin(time * 0.8 + i * 0.3) * 0.03;
      dummy.position.set(headX, headY, d.z);
      dummy.scale.set(1, 1, 1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      headInstanced.setMatrixAt(i, dummy.matrix);
    }
    stalkInstanced.instanceMatrix.needsUpdate = true;
    headInstanced.instanceMatrix.needsUpdate = true;

    // Camera parallax (lerp)
    targetCamX = mouseX * 1.5;
    targetCamY = 4 + mouseY * 0.8;
    camera.position.x += (targetCamX - camera.position.x) * 0.04;
    camera.position.y += (targetCamY - camera.position.y) * 0.04;

    // Subtle camera bob
    camera.position.y += Math.sin(time * 0.3) * 0.003;

    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  animate();
  handleResize();

  // Public API
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
      groundGeo.dispose();
      groundMat.dispose();
      stalkGeo.dispose();
      stalkMat.dispose();
      headGeo.dispose();
      headMat.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
    },
  };
}
