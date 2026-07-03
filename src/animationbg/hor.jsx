import React, { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Trail, PerspectiveCamera, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const SCROLL_WIDTH = 20000;

const TRAIL_COLOR = "#ffffff";

const COLLISION_POINT = new THREE.Vector3(12, 0, 0);
const HeroComet = ({ progress }) => {
  const meshRef = useRef();

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-15, 0, 0),
        new THREE.Vector3(-8, 2, 0),
        new THREE.Vector3(-2, -1, 0),
        new THREE.Vector3(0, 0, 0),
      ]),
    []
  );

useFrame(() => {
  const p = progress.current;
  const moveProgress = Math.min(p * 2.2, 1);

  if (meshRef.current) {
    const point = curve.getPointAt(moveProgress);
    meshRef.current.position.copy(point);

    // --- INSTANT EXPLOSION WINDOW ---
    if (p > 0.45) {
      const burst = (p - 0.45) * 0; // very fast burst

      meshRef.current.scale.setScalar(1 + burst * 3);

      const opacity = Math.max(1 - burst * 6, 0);
      meshRef.current.material.opacity = opacity;
      meshRef.current.material.transparent = true;

      if (opacity <= 0.05) {
        meshRef.current.visible = false;
      }
    } else {
      meshRef.current.visible = true;
      meshRef.current.scale.setScalar(1);
      meshRef.current.material.opacity = 1;
    }
  }
});


  return (
    <Trail width={4} length={8} color={TRAIL_COLOR} attenuation={(t) => t * t}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </Trail>
  );
};

const MultiComets = ({ progress, centerRef }) => {

  const cometRefs = useRef([]);

  const comets = useMemo(() => {
    const temp = [];

    // 4 spiral comets (circle & fade)
    for (let i = 0; i < 1; i++) {
    const dir = new THREE.Vector3(
  Math.random() - 0.5,
  Math.random() - 0.5,
  Math.random() - 0.5
).normalize();

temp.push({
  type: "spiral",
  direction: dir,
});

    }

    for (let i = 0; i < 6; i++) {
 const start = new THREE.Vector3(0, 0, 0);

const c1 = new THREE.Vector3(
  2 + Math.random() * 3,
  2 + Math.random() * 2,
  (Math.random() - 0.5) * 2
);

const c2 = new THREE.Vector3(
  14 + Math.random() * 6,
  -3 + Math.random() * 4,
  (Math.random() - 0.5) * 4
);

const end = new THREE.Vector3(
  24 + Math.random() * 10,
  (Math.random() - 0.5) * 6,
  (Math.random() - 0.5) * 6
);


      temp.push({
        type: "wave",
        curve: new THREE.CatmullRomCurve3([start, c1, c2, end]),
      });
    }
    return temp;
  }, []);

  useEffect(() => {
    cometRefs.current = cometRefs.current.slice(0, comets.length);
  }, [comets]);

  useFrame(() => {
    const p = progress.current;

    cometRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const data = comets[i];

      // All comets appear only after hero explosion (p > 0.35)
    if (p < 0.50) {

        mesh.visible = false;
        return;
      }
      mesh.visible = true;

      // local progress within the MultiComets phase (0 → 1)
     let local = (p - 0.50) * 1.5;

      local = Math.min(Math.max(local, 0), 1);

      // ----- SPIRAL COMETS (circle outward & fade) -----
     if (data.type === "spiral") {
  const dir = data.direction;
  const distance = local * 4;

  mesh.position.set(
    dir.x * distance,
    dir.y * distance,
    dir.z * distance
  );

  mesh.scale.setScalar(0.18);
  let avgX = 0;
let count = 0;

cometRefs.current.forEach((mesh) => {
  if (mesh && mesh.visible) {
    avgX += mesh.position.x;
    count++;
  }
});

if (count > 0 && centerRef) {
  centerRef.current = avgX / count;
}

}


      // ----- WAVE COMETS (follow hero‑like curves, then converge) -----
      if (data.type === "wave") {
        // Move along the curve – starts at (0,0,0) automatically
        const t = Math.min(local * 1.2, 1);
        const point = data.curve.getPointAt(t);
        mesh.position.copy(point);
        mesh.scale.setScalar(0.18);

        // ---- CONVERGENCE PHASE: all wave comets lerp to COLLISION_POINT ----
    if (p > 0.80) {
  const converge = (p - 0.80) * 3;

          mesh.position.lerp(COLLISION_POINT, converge);
          mesh.scale.setScalar(0.18 * (1 - converge * 0.5));

          // Hide after reaching collision point
          if (converge > 0.98) mesh.visible = false;
        }
      }
    });
  });

  return (
    <group>
      {comets.map((_, i) => (
        <Trail
          key={i}
          width={1.5}
          length={5}
          color={TRAIL_COLOR}
          attenuation={(t) => t}
        >
          <mesh ref={(el) => (cometRefs.current[i] = el)}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial
              color={TRAIL_COLOR}
              toneMapped={false}
              transparent
              opacity={1}
            />
          </mesh>
        </Trail>
      ))}
    </group>
  );
};

const Network = ({ progress }) => {
  const linesRef = useRef();
  const nodesRef = useRef([]); 
  const { nodes, edges } = useMemo(() => {
    const nodeCount = 16;
    const pts = [];
    for (let i = 0; i < nodeCount; i++) {
      pts.push(
        new THREE.Vector3(
          COLLISION_POINT.x + (Math.random() - 0.5) * 65,
          COLLISION_POINT.y + (Math.random() - 0.5) * 77,
          COLLISION_POINT.z + (Math.random() - 0.5) * 55
        )
      );
    }

    const edgeList = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        // Random connections, but keep it dense enough
        if (Math.random() > 0.55) continue;
        // Each edge has a random "appearance time" between 0 and 0.8
        const startProgress = Math.random() * 0.8;
        edgeList.push({
          i,
          j,
          startProgress,
        });
      }
    }
    return { nodes: pts, edges: edgeList };
  }, []);

  // Pre-build line geometries for performance
  const lineGeometries = useMemo(() => {
    return edges.map(({ i, j }) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        nodes[i],
        nodes[j],
      ]);
      return geometry;
    });
  }, [nodes, edges]);

  // Refs for each line to control opacity
  const lineRefs = useRef([]);

  // Create visible nodes (small spheres) that expand from center
  const nodeMeshes = useMemo(() => {
    return nodes.map((_, idx) => (
      <mesh
        key={`node-${idx}`}
        ref={(el) => (nodesRef.current[idx] = el)}
        scale={0.08}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={TRAIL_COLOR} toneMapped={false} transparent />
      </mesh>
    ));
  }, [nodes]);

  useFrame(() => {
    const p = progress.current;

    // Network starts after wave comets have collided (p > 0.85)
   if (p < 0.92) {

      // Hide all nodes and lines before network phase
      nodesRef.current.forEach((node) => {
        if (node) node.visible = false;
      });
      linesRef.current?.children.forEach((line) => {
        line.material.opacity = 0;
      });
      return;
    }

    // Network progress: 0 → 1 between p = 0.85 and p = 1.0
 const networkProgress = Math.min((p - 0.92) * (1 / 0.08), 1);


    // 1. NODES: expand from collision point to final positions
    nodesRef.current.forEach((node, i) => {
      if (!node) return;
      node.visible = true;
      // Interpolate position: start at COLLISION_POINT, end at nodes[i]
      node.position.lerpVectors(COLLISION_POINT, nodes[i], networkProgress);
      // Fade in opacity
      node.material.opacity = networkProgress * 0.8;
    });

    // 2. LINES: appear gradually based on each edge's startProgress
    linesRef.current?.children.forEach((line, idx) => {
      if (!line) return;
      const edge = edges[idx];
      if (!edge) return;

      // Only show line if networkProgress has passed its start threshold
      const progressForEdge = Math.max(
        0,
        (networkProgress - edge.startProgress) * 2
      );
      const opacity = Math.min(progressForEdge, 1) * 0.6; // max opacity 0.6

line.material.opacity = 0.15 + opacity * 0.5; 
line.material.transparent = true;
line.visible = true;

    });
  });

  return (
    <group>
      {/* Nodes (sparkling points) */}
      {nodeMeshes}

      {/* Lines (edges) */}
      <group ref={linesRef}>
        {lineGeometries.map((geometry, idx) => (
          <line key={`edge-${idx}`} geometry={geometry}>
            <lineBasicMaterial
              color="#ffffff"
              transparent
              opacity={0}
              toneMapped={false}
            />
          </line>
        ))}
      </group>
    </group>
  );
};

const CameraRig = ({ centerRef }) => {
  const { camera } = useThree();

  useFrame(() => {
    if (centerRef.current !== undefined) {
      // smooth follow
      camera.position.x += (centerRef.current - camera.position.x) * 0.08;
    }
  });

  return null;
};

const CinematicHorizontalStory = () => {
  const scrollRef = useRef(0);
  const containerRef = useRef();
const centerRef = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(scrollRef, {
        current: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${SCROLL_WIDTH}`,
          scrub: 1.5,
          pin: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} style={{ height: "100vh", width: "100%" }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <color attach="background" args={["#050202"]} />
        <Stars radius={100} depth={50} count={4000} factor={4} fade />

      <CameraRig centerRef={centerRef} />
<HeroComet progress={scrollRef} />
<MultiComets progress={scrollRef} centerRef={centerRef} />

        <Network progress={scrollRef} />

        <EffectComposer disableNormalPass>
         <Bloom luminanceThreshold={0} intensity={2} radius={0.9} />

          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default CinematicHorizontalStory;