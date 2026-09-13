/**
 * components/ThreeChaos.tsx
 * WebGL layer: a whirling orbital cloud of ~44 geometric meshes, a central
 * torus-knot, billboarded occult sprites, and a 900-point particle field.
 *
 * Runs on its own requestAnimationFrame loop – independent from React state –
 * with deterministic per-mesh parameters attached via `userData`.
 *
 * Resources (geometries, renderer) are disposed on unmount to avoid WebGL leaks.
 */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/** Paths (from Vite public root) of the occult sprite textures. */
const SPRITE_PATHS = ['/sprites/eye.png', '/sprites/goat.png', '/sprites/sun.png'] as const;

/** Geometry zoo we draw from when spawning mesh objects. */
const GEOMETRIES: THREE.BufferGeometry[] = [
  new THREE.TorusKnotGeometry(1, 0.35, 64, 8, 2, 5),
  new THREE.IcosahedronGeometry(1.2, 0),
  new THREE.TetrahedronGeometry(1.5, 0),
  new THREE.TorusGeometry(1.2, 0.4, 8, 16),
  new THREE.OctahedronGeometry(1.3, 0),
  new THREE.ConeGeometry(1, 2.2, 5),
  new THREE.BoxGeometry(1.5, 1.5, 1.5),
];

const MESH_COUNT = 44;
const SPRITES_PER_TEX = 7;
const PARTICLE_COUNT = 900;

export default function ThreeChaos() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      85,
      window.innerWidth / window.innerHeight,
      0.1,
      200,
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    // --- Meshes -----------------------------------------------------------
    const meshes: THREE.Mesh[] = [];
    const basicMats: THREE.MeshBasicMaterial[] = [];

    for (let i = 0; i < MESH_COUNT; i++) {
      const geo = GEOMETRIES[Math.floor(Math.random() * GEOMETRIES.length)];
      let mat: THREE.Material;
      if (Math.random() < 0.45) {
        mat = new THREE.MeshNormalMaterial({ wireframe: Math.random() > 0.5 });
      } else {
        const bm = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
          wireframe: Math.random() > 0.35,
        });
        basicMats.push(bm);
        mat = bm;
      }
      const mesh = new THREE.Mesh(geo, mat);
      const r = 8 + Math.random() * 26;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      mesh.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi) * 0.7,
        r * Math.sin(phi) * Math.sin(theta),
      );
      const s = 0.6 + Math.random() * 2.2;
      mesh.scale.setScalar(s);
      mesh.userData = {
        rx: (Math.random() - 0.5) * 0.15,
        ry: (Math.random() - 0.5) * 0.15,
        rz: (Math.random() - 0.5) * 0.15,
        orbitR: r,
        orbitSpeed: (Math.random() - 0.5) * 1.2,
        orbitPhase: theta,
        yBase: mesh.position.y,
        bobSpeed: 1 + Math.random() * 3,
      };
      scene.add(mesh);
      meshes.push(mesh);
    }

    // --- Centre knot ------------------------------------------------------
    const centerKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(3, 0.9, 128, 16, 3, 7),
      new THREE.MeshNormalMaterial({ wireframe: true }),
    );
    scene.add(centerKnot);

    // --- Sprites (billboards) --------------------------------------------
    const loader = new THREE.TextureLoader();
    const sprites: THREE.Sprite[] = [];

    SPRITE_PATHS.forEach((path) => {
      const tex = loader.load(path);
      for (let i = 0; i < SPRITES_PER_TEX; i++) {
        const sp = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: tex,
            transparent: true,
            depthWrite: false,
          }),
        );
        const r = 6 + Math.random() * 24;
        const a = Math.random() * Math.PI * 2;
        sp.position.set(Math.cos(a) * r, (Math.random() - 0.5) * 20, Math.sin(a) * r);
        const base = 2.5 + Math.random() * 4;
        sp.scale.setScalar(base);
        sp.userData = {
          base,
          phase: Math.random() * Math.PI * 2,
          orbitR: r,
          orbitA: a,
          orbitS: (Math.random() - 0.5) * 0.8,
        };
        scene.add(sp);
        sprites.push(sp);
      }
    });

    // --- Particle field ---------------------------------------------------
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const c = new THREE.Color();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 70;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 70;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 70;
      c.setHSL(Math.random(), 1, 0.6);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const points = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ size: 0.35, vertexColors: true }),
    );
    scene.add(points);

    // --- Animation loop ---------------------------------------------------
    const clock = new THREE.Clock();
    let raf = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      camera.position.set(Math.sin(t * 0.9) * 24, Math.sin(t * 0.55) * 12, Math.cos(t * 0.9) * 24);
      camera.lookAt(0, 0, 0);
      camera.rotation.z = Math.sin(t * 1.7) * 0.35;

      centerKnot.rotation.x = t * 1.3;
      centerKnot.rotation.y = t * 0.9;
      centerKnot.scale.setScalar(1 + Math.sin(t * 4) * 0.25);

      for (const m of meshes) {
        const u = m.userData;
        m.rotation.x += u.rx;
        m.rotation.y += u.ry;
        m.rotation.z += u.rz;
        const ang = u.orbitPhase + t * u.orbitSpeed;
        m.position.x = Math.cos(ang) * u.orbitR;
        m.position.z = Math.sin(ang) * u.orbitR;
        m.position.y = u.yBase + Math.sin(t * u.bobSpeed) * 3;
      }

      basicMats.forEach((bm, i) => {
        bm.color.setHSL((t * 0.5 + i * 0.13) % 1, 1, 0.5);
      });

      sprites.forEach((sp, i) => {
        const u = sp.userData;
        const s = u.base * (1 + 0.4 * Math.sin(t * 5 + u.phase));
        sp.scale.set(s, s, 1);
        const a = u.orbitA + t * u.orbitS;
        sp.position.x = Math.cos(a) * u.orbitR;
        sp.position.z = Math.sin(a) * u.orbitR;
        (sp.material as THREE.SpriteMaterial).rotation = t * (i % 2 === 0 ? 2 : -2);
      });

      points.rotation.y = t * 0.3;
      points.rotation.x = Math.sin(t * 0.4) * 0.5;

      renderer.render(scene, camera);
    };
    animate();

    // --- Resize & cleanup -------------------------------------------------
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      // Dispose particle geometry (we don't own the zoo GEOMETRIES — they're
      // shared module-level constants kept for the lifetime of the page).
      pGeo.dispose();
      // Dispose materials created in this mount. A mesh can hold a single
      // material or an array – normalise before calling dispose.
      const disposeMat = (m: THREE.Material | THREE.Material[]) => {
        if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
        else m.dispose();
      };
      for (const m of meshes) disposeMat(m.material);
      for (const sp of sprites) sp.material.dispose();
      centerKnot.material.dispose();
      points.material.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={mountRef} className="fixed inset-0 z-10 pointer-events-none" aria-hidden="true" />
  );
}
