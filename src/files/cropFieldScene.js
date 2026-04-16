/**
 * cropFieldScene.js
 * Prithvix — Procedural Three.js Seed Growth Scene
 * 
 * Brand Colors:
 *   Forest:   #1A3C2B  (deep green)
 *   Gold:     #D4A853  (harvest gold)
 *   Offwhite: #F5F0E8  (warm paper)
 *   Dark:     #0E1A14  (near-black)
 *   Muted:    #6B7C6E  (sage)
 *   Soil:     #2C1810  (dark earth)
 *   Sprout:   #8B9D4F  (lime green)
 */

import * as THREE from 'three';

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = {
  forest:     0x1A3C2B,
  gold:       0xD4A853,
  goldLight:  0xF0D898,
  offwhite:   0xF5F0E8,
  dark:       0x0E1A14,
  soil:       0x2C1810,
  soilLight:  0x3D2415,
  sprout:     0x8B9D4F,
  sproutDark: 0x4A6B2A,
  leafTop:    0x3A6B2E,
  leafUnder:  0xA8C46E,
  rootBrown:  0x5C3A1E,
  crackLine:  0xB8860B,
};

// ─── Main Scene Class ──────────────────────────────────────────────────────────

export class CropFieldScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;
    this.animationId = null;
    this.clock = new THREE.Clock();
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.pills = [];
    this.leaves = [];
    this.roots = [];
    this.stalks = [];

    this._init();
    this._buildScene();
    this._bindEvents();
    this._animate();
  }

  // ── Renderer & Camera ────────────────────────────────────────────────────────

  _init() {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 3, 10);
    this.camera.lookAt(0, 1, 0);

    // Master group — everything rotates together
    this.masterGroup = new THREE.Group();
    this.scene.add(this.masterGroup);
  }

  // ── Lighting ─────────────────────────────────────────────────────────────────

  _buildLights() {
    // Warm gold directional (sun from top-right)
    const dirLight = new THREE.DirectionalLight(COLORS.gold, 1.4);
    dirLight.position.set(5, 8, 5);
    this.scene.add(dirLight);

    // Cool ambient fill
    const ambLight = new THREE.AmbientLight(COLORS.offwhite, 0.5);
    this.scene.add(ambLight);

    // Forest green point light from left (gives depth)
    const pointLight = new THREE.PointLight(COLORS.forest, 0.8, 20);
    pointLight.position.set(-4, 2, 3);
    this.scene.add(pointLight);

    // Gold glow beneath seed (emulates ground bounce)
    const groundLight = new THREE.PointLight(COLORS.gold, 0.4, 8);
    groundLight.position.set(0, -1.5, 0);
    this.scene.add(groundLight);
  }

  // ── Full Scene Build ──────────────────────────────────────────────────────────

  _buildScene() {
    this._buildLights();
    this._buildSoilBase();
    this._buildSeedShell();
    this._buildSproutStem();
    this._buildLeaves();
    this._buildRoots();
    this._buildDataPills();
    this._buildParticles();
  }

  // ── Soil Base ────────────────────────────────────────────────────────────────

  _buildSoilBase() {
    // Main disc of cracked earth
    const geo = new THREE.CylinderGeometry(3.2, 3.0, 0.4, 8, 1);
    const mat = new THREE.MeshLambertMaterial({ color: COLORS.soil });
    const soil = new THREE.Mesh(geo, mat);
    soil.position.y = -1.8;
    this.masterGroup.add(soil);

    // Raised crack ring around seed emergence point
    const crackGeo = new THREE.TorusGeometry(0.9, 0.08, 3, 8);
    const crackMat = new THREE.MeshLambertMaterial({ color: COLORS.crackLine });
    const crack = new THREE.Mesh(crackGeo, crackMat);
    crack.position.y = -1.58;
    crack.rotation.x = Math.PI / 2;
    this.masterGroup.add(crack);

    // Smaller inner crack
    const crack2Geo = new THREE.TorusGeometry(0.5, 0.04, 3, 6);
    const crack2 = new THREE.Mesh(crack2Geo, crackMat);
    crack2.position.y = -1.56;
    crack2.rotation.x = Math.PI / 2;
    crack2.rotation.z = 0.4;
    this.masterGroup.add(crack2);

    // Soil clumps scattered around base
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const radius = 0.8 + Math.random() * 1.4;
      const clumpGeo = new THREE.DodecahedronGeometry(0.08 + Math.random() * 0.12, 0);
      const clumpMat = new THREE.MeshLambertMaterial({
        color: i % 2 === 0 ? COLORS.soil : COLORS.soilLight,
      });
      const clump = new THREE.Mesh(clumpGeo, clumpMat);
      clump.position.set(
        Math.cos(angle) * radius,
        -1.55 + Math.random() * 0.1,
        Math.sin(angle) * radius
      );
      clump.rotation.set(Math.random(), Math.random(), Math.random());
      this.masterGroup.add(clump);
    }
  }

  // ── Seed Shell (split icosahedron) ───────────────────────────────────────────

  _buildSeedShell() {
    // Two halves of a seed — upper half tilted back, lower half forward
    const seedGeo = new THREE.IcosahedronGeometry(0.75, 1);

    // Lower shell half — dark forest green
    const lowerMat = new THREE.MeshLambertMaterial({
      color: COLORS.forest,
      side: THREE.DoubleSide,
    });
    const lower = new THREE.Mesh(seedGeo, lowerMat);
    lower.position.y = -1.3;
    lower.scale.set(1, 0.6, 1);
    lower.rotation.x = 0.3;
    this.masterGroup.add(lower);

    // Upper shell half — tilted open, lighter green
    const upperMat = new THREE.MeshLambertMaterial({
      color: COLORS.sproutDark,
      side: THREE.DoubleSide,
    });
    const upper = new THREE.Mesh(seedGeo, upperMat);
    upper.position.set(0.1, -0.9, 0.2);
    upper.scale.set(0.9, 0.5, 0.9);
    upper.rotation.set(-0.6, 0.2, 0.15);
    this.masterGroup.add(upper);

    // Gold glow core between the two halves
    const glowGeo = new THREE.SphereGeometry(0.25, 6, 6);
    const glowMat = new THREE.MeshBasicMaterial({
      color: COLORS.gold,
      transparent: true,
      opacity: 0.7,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.y = -1.1;
    this.masterGroup.add(glow);
    this.glowCore = glow;
  }

  // ── Sprout Stem ──────────────────────────────────────────────────────────────

  _buildSproutStem() {
    // Main stem — tapered cylinder
    const stemGeo = new THREE.CylinderGeometry(0.06, 0.14, 2.8, 5, 4);
    // Add slight curve via vertex displacement
    const pos = stemGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const t = (y + 1.4) / 2.8; // 0 at bottom, 1 at top
      pos.setX(i, pos.getX(i) + Math.sin(t * Math.PI * 0.5) * 0.12);
    }
    pos.needsUpdate = true;
    stemGeo.computeVertexNormals();

    const stemMat = new THREE.MeshLambertMaterial({ color: COLORS.sprout });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 0.2;
    this.masterGroup.add(stem);
    this.stem = stem;

    // Stem node bumps at intervals
    for (let i = 0; i < 3; i++) {
      const nodeGeo = new THREE.SphereGeometry(0.09, 5, 5);
      const nodeMat = new THREE.MeshLambertMaterial({ color: COLORS.sproutDark });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(
        Math.sin(i * 1.2) * 0.1,
        -0.6 + i * 0.7,
        Math.cos(i * 1.2) * 0.06
      );
      this.masterGroup.add(node);
    }
  }

  // ── Leaves ───────────────────────────────────────────────────────────────────

  _buildLeaves() {
    const leafConfigs = [
      // [x, y, z, rotY, rotZ, scale]
      [-0.3,  0.5,  0.1,  0.4,  -0.5, 1.0],
      [ 0.4,  0.8, -0.1, -0.3,   0.5, 0.85],
      [-0.2,  1.2,  0.2,  0.8,  -0.6, 0.9],
      [ 0.35, 1.5, -0.1, -0.6,   0.45, 0.75],
      [-0.15, 1.8,  0.1,  0.5,  -0.4, 0.65],
    ];

    leafConfigs.forEach(([x, y, z, rotY, rotZ, scale], i) => {
      const leaf = this._makeLeaf(scale);
      leaf.position.set(x, y, z);
      leaf.rotation.set(0, rotY, rotZ);
      this.masterGroup.add(leaf);
      this.leaves.push({ mesh: leaf, baseRotZ: rotZ, index: i });
    });
  }

  _makeLeaf(scale = 1) {
    // Custom leaf shape using BufferGeometry
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(-0.3 * scale, 0.2 * scale, -0.4 * scale, 0.6 * scale, 0, 1.0 * scale);
    shape.bezierCurveTo( 0.4 * scale, 0.6 * scale,  0.3 * scale, 0.2 * scale, 0, 0);

    const geo = new THREE.ShapeGeometry(shape, 4);
    const mat = new THREE.MeshLambertMaterial({
      color: COLORS.leafTop,
      side: THREE.DoubleSide,
    });
    return new THREE.Mesh(geo, mat);
  }

  // ── Roots ────────────────────────────────────────────────────────────────────

  _buildRoots() {
    const rootConfigs = [
      // [endX, endY, endZ, midX, midY]
      [-1.2, -3.2, -0.3, -0.6, -2.2],
      [ 1.0, -3.0,  0.4,  0.5, -2.0],
      [-0.3, -3.4,  0.8, -0.1, -2.3],
      [ 0.8, -3.1, -0.6,  0.3, -2.1],
      [-0.7, -2.8,  0.2, -0.4, -2.0],
      [ 0.2, -3.5, -0.5,  0.1, -2.4],
    ];

    rootConfigs.forEach(([ex, ey, ez, mx, my], i) => {
      // Main root as tapered tube using CatmullRomCurve3
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -1.6, 0),
        new THREE.Vector3(mx * 0.5, my + 0.6, ez * 0.3),
        new THREE.Vector3(mx, my, ez * 0.7),
        new THREE.Vector3(ex, ey, ez),
      ]);

      const tubeGeo = new THREE.TubeGeometry(curve, 8, 0.04 - i * 0.003, 4, false);
      const tubeMat = new THREE.MeshLambertMaterial({ color: COLORS.rootBrown });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      this.masterGroup.add(tube);

      // Amber circuit dot on each root (data marker)
      const dotGeo = new THREE.SphereGeometry(0.05, 4, 4);
      const dotMat = new THREE.MeshBasicMaterial({ color: COLORS.gold });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      const midPoint = curve.getPoint(0.5);
      dot.position.copy(midPoint);
      this.masterGroup.add(dot);
      this.roots.push(dot);

      // Sub-root branches
      if (i < 4) {
        const branchCurve = new THREE.CatmullRomCurve3([
          curve.getPoint(0.6),
          new THREE.Vector3(ex + 0.5 * (Math.random() - 0.5), ey - 0.3, ez + 0.3),
        ]);
        const branchGeo = new THREE.TubeGeometry(branchCurve, 4, 0.02, 3, false);
        const branch = new THREE.Mesh(branchGeo, tubeMat);
        this.masterGroup.add(branch);
      }
    });
  }

  // ── Data Pills ───────────────────────────────────────────────────────────────

  _buildDataPills() {
    const pillConfigs = [
      // [x, y, z, rotX, rotZ, scale]
      [-1.8,  0.5,  0.3,  0.3, -0.4, 1.0],
      [ 1.9,  0.8, -0.2, -0.2,  0.5, 0.85],
      [-1.5,  1.8,  0.5,  0.4, -0.3, 0.9],
      [ 1.6,  2.0, -0.4, -0.3,  0.4, 0.75],
      [-1.0,  2.8,  0.2,  0.5, -0.2, 0.7],
      [ 1.2,  3.0, -0.3, -0.4,  0.3, 0.65],
    ];

    pillConfigs.forEach(([x, y, z, rx, rz, scale], i) => {
      const group = new THREE.Group();

      // Pill body — CapsuleGeometry (Three.js r125+), fallback to cylinder+spheres
      let pillMesh;
      try {
        const geo = new THREE.CapsuleGeometry(0.1 * scale, 0.35 * scale, 4, 8);
        const mat = new THREE.MeshLambertMaterial({
          color: COLORS.gold,
          transparent: true,
          opacity: 0.85,
        });
        pillMesh = new THREE.Mesh(geo, mat);
      } catch {
        // Fallback for older Three.js — cylinder + 2 spheres
        const g = new THREE.Group();
        const cylGeo = new THREE.CylinderGeometry(0.1 * scale, 0.1 * scale, 0.35 * scale, 8);
        const sphGeo = new THREE.SphereGeometry(0.1 * scale, 8, 8);
        const mat = new THREE.MeshLambertMaterial({ color: COLORS.gold, transparent: true, opacity: 0.85 });
        g.add(new THREE.Mesh(cylGeo, mat));
        const top = new THREE.Mesh(sphGeo, mat);
        const bot = new THREE.Mesh(sphGeo, mat);
        top.position.y =  0.175 * scale;
        bot.position.y = -0.175 * scale;
        g.add(top, bot);
        pillMesh = g;
      }

      group.add(pillMesh);

      // Inner glow dot
      const glowGeo = new THREE.SphereGeometry(0.04 * scale, 4, 4);
      const glowMat = new THREE.MeshBasicMaterial({ color: COLORS.goldLight });
      group.add(new THREE.Mesh(glowGeo, glowMat));

      group.position.set(x, y, z);
      group.rotation.set(rx, 0, rz);
      this.masterGroup.add(group);

      this.pills.push({
        group,
        baseY: y,
        baseX: x,
        phase: (i / pillConfigs.length) * Math.PI * 2,
        speed: 0.6 + Math.random() * 0.4,
        index: i,
      });
    });
  }

  // ── Ambient Particles (spores/sparkles rising) ───────────────────────────────

  _buildParticles() {
    const count = 60;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 2.5;
      positions[i * 3]     = Math.cos(angle) * radius;
      positions[i * 3 + 1] = -1.5 + Math.random() * 5.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      sizes[i] = 0.5 + Math.random() * 2.0;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      color: COLORS.gold,
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(geo, mat);
    this.masterGroup.add(this.particles);
    this._particlePositions = positions;
    this._particleCount = count;
  }

  // ── Event Bindings ────────────────────────────────────────────────────────────

  _bindEvents() {
    // Mouse parallax
    this._onMouseMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.targetX = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      this.mouse.targetY = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    };
    window.addEventListener('mousemove', this._onMouseMove);

    // Resize
    this._onResize = () => {
      this.width  = this.canvas.clientWidth;
      this.height = this.canvas.clientHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    };
    window.addEventListener('resize', this._onResize);
  }

  // ── Scroll Progress (call from parent component) ──────────────────────────────

  setScrollProgress(progress) {
    // progress: 0 (hero top) → 1 (hero bottom)
    this.scrollProgress = Math.max(0, Math.min(1, progress));
  }

  // ── Animation Loop ────────────────────────────────────────────────────────────

  _animate() {
    this.animationId = requestAnimationFrame(() => this._animate());
    const t = this.clock.getElapsedTime();

    // ── Master group slow Y rotation (turntable)
    this.masterGroup.rotation.y += 0.003;

    // ── Mouse parallax — smooth lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.04;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.04;
    this.camera.position.x = this.mouse.x * 1.2;
    this.camera.position.y = 3 + this.mouse.y * 0.8;

    // ── Scroll zoom
    this.camera.position.z = 10 - this.scrollProgress * 3.5;
    this.masterGroup.rotation.y += this.scrollProgress * 0.002;

    // ── Data pills — float at different phases
    this.pills.forEach((p) => {
      p.group.position.y = p.baseY + Math.sin(t * p.speed + p.phase) * 0.18;
      p.group.position.x = p.baseX + Math.sin(t * 0.4 + p.phase) * 0.06;
      p.group.rotation.z = Math.sin(t * 0.6 + p.phase) * 0.12;
    });

    // ── Leaves sway (wind)
    this.leaves.forEach((l) => {
      l.mesh.rotation.z = l.baseRotZ + Math.sin(t * 0.8 + l.index * 0.6) * 0.08;
      l.mesh.rotation.y = Math.sin(t * 0.5 + l.index * 0.4) * 0.05;
    });

    // ── Root gold dots pulse
    this.roots.forEach((dot, i) => {
      const scale = 0.8 + Math.sin(t * 1.2 + i * 0.8) * 0.3;
      dot.scale.setScalar(scale);
    });

    // ── Glow core pulse
    if (this.glowCore) {
      this.glowCore.material.opacity = 0.5 + Math.sin(t * 1.5) * 0.2;
      const gs = 0.9 + Math.sin(t * 1.5) * 0.15;
      this.glowCore.scale.setScalar(gs);
    }

    // ── Particles slowly rise and reset
    const pos = this._particlePositions;
    for (let i = 0; i < this._particleCount; i++) {
      pos[i * 3 + 1] += 0.004;
      if (pos[i * 3 + 1] > 4) pos[i * 3 + 1] = -1.5;
    }
    this.particles.geometry.attributes.position.needsUpdate = true;

    // ── Camera look target
    this.camera.lookAt(0, 1.2, 0);

    this.renderer.render(this.scene, this.camera);
  }

  // ── Cleanup ───────────────────────────────────────────────────────────────────

  dispose() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('resize', this._onResize);

    // Dispose all geometries and materials
    this.scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material?.dispose();
        }
      }
    });

    this.renderer.dispose();
  }
}
