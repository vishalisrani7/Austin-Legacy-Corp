import React, { useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Trail, PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const SCROLL_WIDTH = 20000;
const TRAIL_COLOR = "#aaccff";
const COLLISION_POINT = new THREE.Vector3(12, 0, 0); 
const LogoParticles = ({ progress }) => {
  const pointsRef = useRef();
  const [particles, setParticles] = useState(null);
  const { camera, raycaster, pointer, gl } = useThree();
  const [mouseWorldPos, setMouseWorldPos] = useState(new THREE.Vector3(0, 0, 0));
  useEffect(() => {
    const canvas = gl.domElement;
    const handleMouseMove = () => {
      raycaster.setFromCamera(pointer, camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const target = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(plane, target)) {
        setMouseWorldPos(target);
      }
    };
    canvas.addEventListener("mousemove", handleMouseMove);
    return () => canvas.removeEventListener("mousemove", handleMouseMove);
  }, [camera, raycaster, pointer, gl]);

  useEffect(() => {
    const img = new Image();
    img.src = "/ALC.png"; 
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      const width = 250;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const ratio = img.height / img.width;
      const height = width * ratio;

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      const positions = [];
      const randoms = [];
      const offsets = [];

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          const alpha = data[i + 3];
          if (alpha > 128) {
            const px = (x - width / 2) * 0.07;
            const py = -(y - height / 2) * 0.07;
            const pz = 0;

            positions.push(px, py, pz);
            randoms.push(Math.random());
            offsets.push(
              (Math.random() - 0.5) * 50,
              (Math.random() - 0.5) * 50,
              (Math.random() - 0.5) * 50
            );
          }
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute("aRandom", new THREE.Float32BufferAttribute(randoms, 1));
      geometry.setAttribute("aOffset", new THREE.Float32BufferAttribute(offsets, 3));

      setParticles(geometry);
    };
  }, []);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        mousePos: { value: new THREE.Vector3(0, 0, 0) },
        hoverRadius: { value: 3.0 },
        pushStrength: { value: 1.2 },
        swirlStrength: { value: 2.5 },
        colorIntensity: { value: 1.5 },
      },
      transparent: true,
      depthWrite: false,
      vertexShader: `
        uniform float uTime;
        uniform float uProgress;
        uniform vec3 mousePos;
        uniform float hoverRadius;
        uniform float pushStrength;
        uniform float swirlStrength;
        
        attribute float aRandom;
        attribute vec3 aOffset;
        
        varying float vAlpha;
        varying vec3 vColor;
        varying float vDist;
        
        float cubicOut(float t) {
          float f = t - 1.0;
          return f * f * f + 1.0;
        }
        
        void main() {
          // Morph from scattered to logo
          vec3 finalPos = position;
          vec3 startPos = position + aOffset;
          float ease = cubicOut(uProgress);
          vec3 morphedPos = mix(startPos, finalPos, ease);
          
          // Hover Logic
          float hoverActive = smoothstep(0.98, 1.0, uProgress);
          
          // FIX: mousePos needs to be relative to the particle in Local Space
          // Note: We handled the coordinate conversion in useFrame (JS side)
          vec3 toMouse = mousePos - morphedPos; 
          float dist = length(toMouse);
          float influence = smoothstep(hoverRadius, 0.0, dist) * hoverActive;
          
          vec3 dir = normalize(toMouse + 0.001);
          vec3 perp = vec3(-dir.y, dir.x, dir.z);
          
          float push = influence * pushStrength * (0.8 + 0.5 * sin(uTime * 3.0 + aRandom * 10.0));
          float swirl = influence * swirlStrength * (0.6 + 0.4 * cos(uTime * 4.0 + aRandom * 5.0));
          
          vec3 displacement = dir * push + perp * swirl;
          float scaleFactor = 1.0 - influence * 0.6;
          vec3 displacedPos = morphedPos + displacement;
          
          // Wave Logic - Ensure it stops completely when formed
          if (uProgress > 0.1 && uProgress < 0.99) {
            float wave = sin(displacedPos.x * 2.0 + uTime * 2.0 + aRandom * 5.0);
            displacedPos.z += wave * 0.5 * (1.0 - ease);
          }
          
          vec4 mvPosition = modelMatrix * viewMatrix * vec4(displacedPos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          float baseSize = 20.0 * (1.0 / -mvPosition.z) * (0.8 + aRandom * 0.4);
          gl_PointSize = baseSize * scaleFactor;
          
          vAlpha = uProgress * (0.7 + aRandom * 0.3);
          
          vec3 baseColor = mix(vec3(0.7, 0.8, 1.0), vec3(1.0, 1.0, 1.0), aRandom);
          vec3 highlight = vec3(1.0, 0.9, 0.6);
          vColor = mix(baseColor, highlight, influence * 0.8);
          
          vDist = dist;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        varying vec3 vColor;
        varying float vDist;
        
        void main() {
          vec2 cxy = 2.0 * gl_PointCoord - 1.0;
          float r = dot(cxy, cxy);
          if (r > 1.0) discard;
          
          float alpha = (1.0 - r) * vAlpha;
          float glow = 1.0 + 0.5 * (1.0 - smoothstep(0.0, 3.0, vDist));
          
          gl_FragColor = vec4(vColor * glow, alpha);
        }
      `,
    });
  }, []);

  useFrame(({ clock }) => {
    const p = progress.current;
    if (pointsRef.current) {
      pointsRef.current.material.uniforms.uTime.value = clock.getElapsedTime();
      const localMouse = mouseWorldPos.clone().sub(COLLISION_POINT);
      pointsRef.current.material.uniforms.mousePos.value.copy(localMouse);

      let reveal = 0;
      if (p > 0.85) {
        reveal = (p - 0.85) * 6.66;
      }
      pointsRef.current.material.uniforms.uProgress.value = Math.min(Math.max(reveal, 0), 1);

      pointsRef.current.rotation.set(0, 0, 0); 
    }
  });

  if (!particles) return null;

  return (
    <points
      ref={pointsRef}
      geometry={particles}
      material={shaderMaterial}
      position={COLLISION_POINT}
    />
  );
};
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
      if (p > 0.85) {
        meshRef.current.visible = false;
        return;
      }
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

const MultiComets = ({ progress, centerRef }) => {
  const cometRefs = useRef([]);
  const comets = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 1; i++) {
      const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      temp.push({ type: "spiral", direction: dir });
    }
    for (let i = 0; i < 6; i++) {
      const start = new THREE.Vector3(0, 0, 0);
      const c1 = new THREE.Vector3(2 + Math.random() * 3, 2 + Math.random() * 2, (Math.random() - 0.5) * 2);
      const c2 = new THREE.Vector3(14 + Math.random() * 6, -3 + Math.random() * 4, (Math.random() - 0.5) * 4);
      const end = new THREE.Vector3(24 + Math.random() * 10, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6);
      temp.push({ type: "wave", curve: new THREE.CatmullRomCurve3([start, c1, c2, end]) });
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
      if (p > 0.85) {
        mesh.visible = false;
        return;
      }
      if (p < 0.5) {
        mesh.visible = false;
        return;
      }
      mesh.visible = true;
      let local = (p - 0.5) * 1.5;
      local = Math.min(Math.max(local, 0), 1);

      if (data.type === "spiral") {
        const dir = data.direction;
        const distance = local * 4;
        mesh.position.set(dir.x * distance, dir.y * distance, dir.z * distance);
        mesh.scale.setScalar(0.18);
        let avgX = 0, count = 0;
        cometRefs.current.forEach((m) => {
          if (m && m.visible) {
            avgX += m.position.x;
            count++;
          }
        });
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

const CameraRig = ({ progress, centerRef }) => {
  const { camera } = useThree();
  const targetX = COLLISION_POINT.x;

  useFrame(() => {
    const p = progress.current;
    if (p > 0.9) {
      camera.position.x += (targetX - camera.position.x) * 0.1;
    } else {
      if (centerRef.current !== undefined) {
        camera.position.x += (centerRef.current - camera.position.x) * 0.08;
      }
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
        <CameraRig progress={scrollRef} centerRef={centerRef} />
        <HeroComet progress={scrollRef} />
        <MultiComets progress={scrollRef} centerRef={centerRef} />
        <LogoParticles progress={scrollRef} />
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.2} intensity={2.0} radius={0.8} />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default CinematicHorizontalStory;