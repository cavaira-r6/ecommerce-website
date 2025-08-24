import { Canvas } from "@react-three/fiber";
import { Float, useGLTF, Environment } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import type { GLTF } from "three-stdlib";
import * as THREE from "three";

type FloatingModel = {
  url: string;
  position: [number, number, number];
  scale: number;
  speed: number;
  rotationIntensity: number;
  floatIntensity: number;
};

const MODEL_URLS = ["/models/8.glb", "/models/80.glb", "/models/9.glb", "/models/3.glb", "/models/5.glb", "/models/26.glb", "/models/33.glb", "/models/13.glb"];
// number of model instances to spawn (reduced to keep scene lighter)
const INSTANCE_COUNT = 24;

// We'll validate model URLs at runtime (skip 404s/HTML responses) to avoid loader errors
const logged = new Set<string>();

// Stateful list of valid model URLs (only these will be preloaded/used)
import { useState, useEffect } from 'react';

const validateModelUrls = async (urls: string[]) => {
  const valid: string[] = [];
  await Promise.all(urls.map(async (u) => {
    try {
      const res = await fetch(u, { method: 'GET' });
      if (!res.ok) {
        console.warn(`Model not found or server error for ${u} (status ${res.status})`);
        return;
      }
      const ct = res.headers.get('content-type') || '';
      // Skip HTML/text responses (404 pages) or JSON
      if (ct.includes('text/html') || ct.includes('application/json') || ct.includes('text/plain')) {
        console.warn(`Skipping ${u} because content-type is ${ct}`);
        return;
      }
      valid.push(u);
    } catch (err) {
      console.warn(`Error fetching ${u}:`, err);
    }
  }));
  return valid;
};

// Hook: validate on module load inside component via state

function GLTFModel({ url, scale = 1 }: { url: string; scale?: number }) {
  const gltf = useGLTF(url) as unknown as GLTF;
  const cloned = useMemo(() => (gltf?.scene ? (gltf.scene.clone(true) as THREE.Group) : new THREE.Group()), [gltf]);

  // center
  useMemo(() => {
    try {
      const box = new THREE.Box3().setFromObject(cloned);
      const center = new THREE.Vector3();
      box.getCenter(center);
      cloned.position.sub(center);
    } catch (_) {
      // ignore
    }
  }, [cloned]);

  // material tweaks
  useMemo(() => {
    cloned.traverse((child) => {
      // @ts-ignore
      if ((child as any).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m: any) => {
            if (!m) return;
            m.side = THREE.DoubleSide;
            if (m.roughness !== undefined) m.roughness = Math.max(0, m.roughness - 0.2);
            if (m.emissiveIntensity !== undefined) m.emissiveIntensity = (m.emissiveIntensity || 0) + 0.2;
            m.needsUpdate = true;
          });
        } else if (mesh.material) {
          const m: any = mesh.material;
          m.side = THREE.DoubleSide;
          if (m.roughness !== undefined) m.roughness = Math.max(0, m.roughness - 0.2);
          if (m.emissiveIntensity !== undefined) m.emissiveIntensity = (m.emissiveIntensity || 0) + 0.2;
          m.needsUpdate = true;
        }
  mesh.castShadow = true;
  mesh.receiveShadow = true;
      }
    });
  }, [cloned]);

  if (process.env.NODE_ENV === "development" && !logged.has(url)) {
    // eslint-disable-next-line no-console
    console.info(`GLTF loaded: ${url}`);
    logged.add(url);
  }

  return <primitive object={cloned} scale={scale} />;
}

function Scene({ floatingModels }: { floatingModels: FloatingModel[] }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <hemisphereLight intensity={0.6} />
      <directionalLight position={[5, 10, 7]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.6} />

      {floatingModels.map((m, i) => (
        <Float key={i} speed={m.speed} rotationIntensity={m.rotationIntensity} floatIntensity={m.floatIntensity}>
          <group position={m.position}>
            <GLTFModel url={m.url} scale={m.scale} />
          </group>
        </Float>
      ))}

      <Environment preset="sunset" background={false} />
    </>
  );
}

export default function AnimatedBackground() {
  const [validModelUrls, setValidModelUrls] = useState<string[] | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
  const valid = await validateModelUrls(MODEL_URLS);
  if (mounted) setValidModelUrls(valid);

      // Preload via useGLTF if available
      try {
        // @ts-ignore
        if ((useGLTF as any) && typeof (useGLTF as any).preload === 'function') {
          (valid.length ? valid : MODEL_URLS).forEach((u: string) => (useGLTF as any).preload(u));
        }
      } catch (e) {
        // ignore
      }
  // nothing else to do here — we've validated model URLs and preloaded them
    })();
    return () => { mounted = false; };
  }, []);

  const floatingModels = useMemo((): FloatingModel[] => {
    const out: FloatingModel[] = [];
  const urls = (validModelUrls && validModelUrls.length) ? validModelUrls : [];
  // If no valid urls, bail out early to avoid errors
  if (!urls.length) return out;
  const count = INSTANCE_COUNT;
  for (let i = 0; i < count; i++) {
      const url = urls[i % urls.length];
      // wider spread: increase horizontal range and vertical variation
      const spread = 40; // horizontal spread multiplier (was ~20)
      const vertical = 8; // vertical variation (was ~6)
      out.push({
        url,
        position: [
          (Math.random() - 0.5) * spread,
          Math.random() * vertical - 2, // slightly lower baseline and taller range
          (Math.random() - 0.5) * spread,
        ],
  // reduce maximum size: range ~0.6 - 1.4 (was 0.8 - 2.3)
  scale: 0.6 + Math.random() * 0.8,
        // faster speeds and wider oscillation for more visible motion
        speed: 0.4 + Math.random() * 1.0, // was 0.2-0.8
        rotationIntensity: 0.4 + Math.random() * 1.6, // was 0.2-1.4
        floatIntensity: 0.8 + Math.random() * 1.7, // was 0.4-1.4
      });
    }
    return out;
  }, [validModelUrls]);

  return (
    <Canvas camera={{ position: [0, 2, 15], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: false }} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: -10 }}>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 10, 30]} />

      <Suspense fallback={null}>
        <Scene floatingModels={floatingModels} />
      </Suspense>
    </Canvas>
  );
}
