import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SPRITE_URLS } from '../assets/sprites';

/**
 * ThreeChaos — the WebGL layer.
 *
 * A self-contained Three.js scene: 44 procedurally seeded meshes drifting on
 * independent orbits, a large wireframe center knot, ~21 occult sprite
 * billboards, and a 900-point particle field. It runs its own
 * requestAnimationFrame loop and owns its own clock — it does not read any
 * React state, so React never re-renders it.
 */

/** Per-mesh kinematics, carried on `mesh.userData`. */
type OrbitKinematics = {
  /** Per-frame angular velocity on each axis. */
  rx: number;
  ry: number;
  rz: number;
  /** Radius of the mesh's orbital shell. */
  orbitR: number;
  /** Angular speed (rad/s, signed) around the origin. */
  orbitSpeed: number;
  /** Starting angle on the orbit ring. */
  orbitPhase: number;
  /** Home height on Y, around which the mesh bobs. */
  yBase: number;
  /** Bob oscillation speed. */
  bobSpeed: number;
};

type SpriteKinematics = {
  base: number;
  phase: number;
  orbitR: number;
  orbitA: number;
  orbitS: number;
};

const GEOMETRIES = () => [
  new THREE.TorusKnotGeometry(1, 0.35, 64, 8, 2, 5),
  new THREE.IcosahedronGeometry(1.2, 0),
  new THREE.TetrahedronGeometry(1.5, 0),
  new THREE.TorusGeometry(1.2, 0.4, 8, 16),
  new THREE.OctahedronGeometry(1.3, 0),
  new THREE.ConeGeometry(1, 2.2, 5),
  new THREE.BoxGeometry(1.5, 1.5, 1.5),
];

const MESH_COUNT = 44;
const PARTICLE_COUNT = 900;
const SPRITES_PER_TEXTURE = 7;
const SPREAD = 70; // particle field half-extent

export default function ThreeChaos() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Fail quietly (and let the rest of the app run) when WebGL is unavailable.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    } catch (err) {
      console.warn('[ThreeChaos] WebGL unavailable; skipping 3D layer.', err);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      85,
      window.innerWidth / window.innerHeight,
      0.1,
      200,
    );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    // ---- geometry zoo ----
    const geos = GEOMETRIES();

    const meshes: THREE.Mesh[] = [];
    const animatedMaterials: THREE.MeshBasicMaterial[] = [];

    for (let i = 0; i < MESH_COUNT; i++) {
      const geo = geos[Math.floor(Math.random() * geos.length)];
      let mat: THREE.Material;
      const roll = Math.random();
      if (roll < 0.45) {
        mat = new THREE.MeshNormalMaterial({ wireframe: Math.random() > 0.5 });
      } else {
        const bm = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
          wireframe: Math.random() > 0.35,
        });
        animatedMaterials.push(bm);
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
      mesh.scale.setScalar(0.6 + Math.random() * 2.2);

      const kin: OrbitKinematics = {
        rx: (Math.random() - 0.5) * 0.15,
        ry: (Math.random() - 0.5) * 0.15,
        rz: (Math.random() - 0.5) * 0.15,
        orbitR: r,
        orbitSpeed: (Math.random() - 0.5) * 1.2,
        orbitPhase: theta,
        yBase: mesh.position.y,
        bobSpeed: 1 + Math.random() * 3,
      };
      mesh.userData = kin;
      scene.add(mesh);
      meshes.push(mesh);
    }

    // ---- giant center knot ----
    const centerKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(3, 0.9, 128, 16, 3, 7),
      new THREE.MeshNormalMaterial({ wireframe: true }),
    );
    scene.add(centerKnot);

    // ---- occult sprite billboards ----
    const sprites: THREE.Sprite[] = [];
    SPRITE_URLS.forEach((url) => {
      new THREE.TextureLoader().load(url, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        for (let i = 0; i < SPRITES_PER_TEXTURE; i++) {
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
          const kin: SpriteKinematics = {
            base,
            phase: Math.random() * Math.PI * 2,
            orbitR: r,
            orbitA: a,
            orbitS: (Math.random() - 0.5) * 0.8,
          };
          sp.userData = kin;
          scene.add(sp);
          sprites.push(sp);
        }
      });
    });

    // ---- particle field ----
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const color = new THREE.Color();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * SPREAD;
      positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
      positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD;
      color.setHSL(Math.random(), 1, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const points = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({ size: 0.35, vertexColors: true }),
    );
    scene.add(points);

    // ---- render loop ----
    const clock = new THREE.Clock();
    let raf = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      camera.position.set(
        Math.sin(t * 0.9) * 24,
        Math.sin(t * 0.55) * 12,
        Math.cos(t * 0.9) * 24,
      );
      camera.lookAt(0, 0, 0);
      camera.rotation.z = Math.sin(t * 1.7) * 0.35;

      centerKnot.rotation.x = t * 1.3;
      centerKnot.rotation.y = t * 0.9;
      centerKnot.scale.setScalar(1 + Math.sin(t * 4) * 0.25);

      meshes.forEach((m) => {
        const u = m.userData as OrbitKinematics;
        m.rotation.x += u.rx;
        m.rotation.y += u.ry;
        m.rotation.z += u.rz;
        const ang = u.orbitPhase + t * u.orbitSpeed;
        m.position.x = Math.cos(ang) * u.orbitR;
        m.position.z = Math.sin(ang) * u.orbitR;
        m.position.y = u.yBase + Math.sin(t * u.bobSpeed) * 3;
      });

      animatedMaterials.forEach((bm, i) => {
        bm.color.setHSL((t * 0.5 + i * 0.13) % 1, 1, 0.5);
      });

      sprites.forEach((sp, i) => {
        const u = sp.userData as SpriteKinematics;
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

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ---- teardown ----
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
          obj.geometry?.dispose();
        }
        const mat = (obj as THREE.Mesh).material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-10 pointer-events-none" />;
}
