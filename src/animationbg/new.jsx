import React, { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Trail, PerspectiveCamera, Stars, Text, Float, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const SCROLL_WIDTH = 20000;
const TRAIL_COLOR = "#ffffff";
const COLLISION_POINT = new THREE.Vector3(12, 0, 0);

// ... (HeroComet code same rahega) ...
const HeroComet = ({ progress }) => {
  const meshRef = useRef();
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
      new THREE.Vector3(-15, 0, 0), new THREE.Vector3(-8, 2, 0),
      new THREE.Vector3(-2, -1, 0), new THREE.Vector3(0, 0, 0),
    ]), []);

  useFrame(() => {
    const p = progress.current;
    const moveProgress = Math.min(p * 2.2, 1);
    if (meshRef.current) {
      const point = curve.getPointAt(moveProgress);
      meshRef.current.position.copy(point);
      if (p > 0.45) {
        const burst = (p - 0.45) * 0;
        meshRef.current.scale.setScalar(1 + burst * 3);
        const opacity = Math.max(1 - burst * 6, 0);
        meshRef.current.material.opacity = opacity;
        meshRef.current.material.transparent = true;
        if (opacity <= 0.05) meshRef.current.visible = false;
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

// ... (MultiComets code same rahega) ...
const MultiComets = ({ progress, centerRef }) => {
  const cometRefs = useRef([]);
  const comets = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 1; i++) {
      const dir = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize();
      temp.push({ type: "spiral", direction: dir });
    }
    for (let i = 0; i < 6; i++) {
      const start = new THREE.Vector3(0, 0, 0);
      const c1 = new THREE.Vector3(2 + Math.random()*3, 2 + Math.random()*2, (Math.random()-0.5)*2);
      const c2 = new THREE.Vector3(14 + Math.random()*6, -3 + Math.random()*4, (Math.random()-0.5)*4);
      const end = new THREE.Vector3(24 + Math.random()*10, (Math.random()-0.5)*6, (Math.random()-0.5)*6);
      temp.push({ type: "wave", curve: new THREE.CatmullRomCurve3([start, c1, c2, end]) });
    }
    return temp;
  }, []);

  useEffect(() => { cometRefs.current = cometRefs.current.slice(0, comets.length); }, [comets]);

  useFrame(() => {
    const p = progress.current;
    cometRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const data = comets[i];
      if (p < 0.5) { mesh.visible = false; return; }
      mesh.visible = true;
      let local = (p - 0.5) * 1.5;
      local = Math.min(Math.max(local, 0), 1);

      if (data.type === "spiral") {
        const dir = data.direction;
        const distance = local * 4;
        mesh.position.set(dir.x * distance, dir.y * distance, dir.z * distance);
        mesh.scale.setScalar(0.18);
        let avgX = 0, count = 0;
        cometRefs.current.forEach((m) => { if(m && m.visible) { avgX += m.position.x; count++; }});
        if (count > 0 && centerRef) centerRef.current = avgX / count;
      }

      if (data.type === "wave") {
        const t = Math.min(local * 1.2, 1);
        const point = data.curve.getPointAt(t);
        mesh.position.copy(point);
        mesh.scale.setScalar(0.18);
        if (p > 0.8) {
          const converge = (p - 0.8) * 3;
          mesh.position.lerp(COLLISION_POINT, converge);
          mesh.scale.setScalar(0.18 * (1 - converge * 0.5));
          if (converge > 0.98) mesh.visible = false;
        }
      }
    });
  });

  return (
    <group>
      {comets.map((_, i) => (
        <Trail key={i} width={1.5} length={5} color={TRAIL_COLOR} attenuation={(t) => t}>
          <mesh ref={(el) => (cometRefs.current[i] = el)}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color={TRAIL_COLOR} toneMapped={false} transparent opacity={1} />
          </mesh>
        </Trail>
      ))}
    </group>
  );
};


// --- NEW COMPONENT: SUPERNOVA REVEAL ---
// Ye replace karega 'Network' ko
const Supernova = ({ progress }) => {
  const coreRef = useRef();
  const ringRef = useRef();
  const textGroupRef = useRef();
  const sparklesRef = useRef();

  useFrame(({ clock }) => {
    const p = progress.current;
    const time = clock.getElapsedTime();

    // 1. TIMING LOGIC
    // P < 0.85: Nothing visible
    // 0.85 - 0.92: Charging Up (Core grows and shakes)
    // 0.92: EXPLOSION (Shockwave expands)
    // 0.92 - 1.0: Text Reveal & Floating

    if (p < 0.82) {
      if (coreRef.current) coreRef.current.visible = false;
      if (ringRef.current) ringRef.current.visible = false;
      if (textGroupRef.current) textGroupRef.current.visible = false;
      if (sparklesRef.current) sparklesRef.current.visible = false;
      return;
    }

    // --- PHASE 1: CHARGING (All comets merged) ---
    if (p >= 0.82 && p < 0.92) {
       const chargeProgress = (p - 0.82) * 10; // 0 to 1
       
       if (coreRef.current) {
         coreRef.current.visible = true;
         coreRef.current.position.copy(COLLISION_POINT);
         
         // Jitter effect (Unstable energy)
         coreRef.current.position.x += (Math.random() - 0.5) * 0.1;
         coreRef.current.position.y += (Math.random() - 0.5) * 0.1;

         // Scale up rapidly
         const scale = chargeProgress * 1.5; 
         coreRef.current.scale.setScalar(scale);
         coreRef.current.material.opacity = 1;
       }
       
       // Hide others
       if (ringRef.current) ringRef.current.visible = false;
       if (textGroupRef.current) textGroupRef.current.visible = false;
    }

    // --- PHASE 2: EXPLOSION & REVEAL ---
    if (p >= 0.92) {
        const explosionProgress = (p - 0.92) * 12.5; // 0 to 1 very fast
        const stableProgress = Math.min((p - 0.92) * 5, 1); // 0 to 1 slower

        // 1. Core Fade out (Instantly turns into shockwave)
        if (coreRef.current) {
            const coreScale = 1.5 + explosionProgress * 10;
            coreRef.current.scale.setScalar(coreScale);
            coreRef.current.material.opacity = Math.max(1 - explosionProgress * 2, 0);
        }

        // 2. Shockwave Ring
        if (ringRef.current) {
            ringRef.current.visible = true;
            ringRef.current.position.copy(COLLISION_POINT);
            ringRef.current.lookAt(new THREE.Vector3(0,0,10)); // Face camera
            
            // Expand ring
            const ringScale = explosionProgress * 40; // Expands huge
            ringRef.current.scale.set(ringScale, ringScale, 1);
            ringRef.current.material.opacity = Math.max(1 - explosionProgress * 0.8, 0);
        }

        // 3. Text Reveal
        if (textGroupRef.current) {
            textGroupRef.current.visible = true;
            textGroupRef.current.position.copy(COLLISION_POINT);
            
            // Text floats forward slowly
            textGroupRef.current.position.z += stableProgress * 2; 
            
            // Opacity fade in
            textGroupRef.current.children.forEach(child => {
                 if (child.material) child.material.opacity = stableProgress;
            });
        }
        
        // 4. Sparkles (Debris)
        if (sparklesRef.current) {
             sparklesRef.current.visible = true;
             sparklesRef.current.position.copy(COLLISION_POINT);
             sparklesRef.current.scale.setScalar(1 + stableProgress * 5); // Expand field
        }
    }
  });

  return (
    <group>
      {/* The Energy Core (Sun) */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#ffddaa" toneMapped={false} transparent />
      </mesh>

      {/* The Shockwave Ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.8, 1, 64]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} transparent side={THREE.DoubleSide} />
      </mesh>
    
      {/* The Exploded Sparkles */}
      <group ref={sparklesRef}>
          <Sparkles count={50} scale={8} size={4} speed={0.4} opacity={1} color="#ffeebb" />
      </group>

      {/* The Grand Title */}
      <group ref={textGroupRef}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <Text
            
                fontSize={3}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
                fillOpacity={0} // Controlled by logic
            >
                UNIVERSE
                <meshStandardMaterial toneMapped={false} color="#ffffff" emissive="#ffffff" emissiveIntensity={2} transparent />
            </Text>
            
            <Text
                position={[0, -1.2, 0]}
                
                fontSize={0.8}
                letterSpacing={0.2}
                color="#aaaaaa"
                anchorX="center"
                anchorY="middle"
            >
                DIGITAL EXPERIENCE
                <meshStandardMaterial toneMapped={false} color="#cccccc" transparent />
            </Text>
        </Float>
      </group>
    </group>
  );
};


const CameraRig = ({ centerRef }) => {
  const { camera } = useThree();
  useFrame(() => {
    if (centerRef.current !== undefined) {
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
        
        {/* Sequence */}
        <HeroComet progress={scrollRef} />
        <MultiComets progress={scrollRef} centerRef={centerRef} />
        
        {/* NEW ENDING */}
        <Supernova progress={scrollRef} />

        <EffectComposer disableNormalPass>
          {/* Increased bloom for the explosion effect */}
          <Bloom luminanceThreshold={0.2} intensity={2.5} radius={0.8} />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default CinematicHorizontalStory;