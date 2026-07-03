import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ParticleWorldMap = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    
    // --- VARIABLES ---
    let geometry = null;
    let material = null;
    let particlesMesh = null;
    let renderer = null;
    let animationId = null;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff); // White BG

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 120; // Camera thoda peeche

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // 2. MOUSE & RAYCASTER
    const mouse = new THREE.Vector2(-1000, -1000);
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    // 3. CREATE PARTICLES (GRID METHOD - No Image Required)
    // Hum image ki jagah ek mathematically perfect grid bana rahe hain
    const positions = [];
    const originalPositions = [];
    const sizes = [];

    const rows = 150; // Total rows
    const cols = 250; // Total columns
    const separation = 1.8; // Do dots ke beech ka gap

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        // Grid ko center me laane ka math
        const pX = (x - cols / 2) * separation;
        const pY = (y - rows / 2) * separation;
        const pZ = 0;

        positions.push(pX, pY, pZ);
        originalPositions.push(pX, pY, pZ);
        
        // Random size for "Glitch" effect like video
        sizes.push(Math.random() > 0.8 ? 2.5 : 1.2); 
      }
    }

    geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('initialPosition', new THREE.Float32BufferAttribute(originalPositions, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    material = new THREE.PointsMaterial({
      color: 0x000000, // Black Dots
      size: 1.5,
      sizeAttenuation: true, // Door wale dots chote dikhenge
    });

    particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    // 4. MOUSE MOVEMENT
    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // 5. ANIMATION LOOP
    let time = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.03; // Wave speed

      if (particlesMesh && geometry) {
        const positions = geometry.attributes.position.array;
        const initials = geometry.attributes.initialPosition.array;
        
        raycaster.setFromCamera(mouse, camera);
        const intersectPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersectPoint);

        for (let i = 0; i < positions.length; i += 3) {
          // --- WAVE EFFECT ---
          // Har dot ko wave ki tarah hilana based on X and Y
          const waveZ = Math.sin(initials[i] * 0.05 + time) * Math.cos(initials[i+1] * 0.05 + time) * 5; 
          
          let px = positions[i];
          let py = positions[i+1];
          let pz = positions[i+2];

          const ix = initials[i];
          const iy = initials[i+1];
          const iz = initials[i+2] + waveZ;

          // --- MOUSE REPULSION ---
          let dx = px - intersectPoint.x;
          let dy = py - intersectPoint.y;
          let dist = Math.sqrt(dx*dx + dy*dy);
          
          const radius = 30; // Radius badha diya

          if (dist < radius) {
            const force = (radius - dist) / radius;
            let angle = Math.atan2(dy, dx);
            const pushX = Math.cos(angle) * force * 8; 
            const pushY = Math.sin(angle) * force * 8;
            px += pushX;
            py += pushY;
          } else {
            // Wapas aana
            px += (ix - px) * 0.1;
            py += (iy - py) * 0.1;
            pz += (iz - pz) * 0.1;
          }

          positions[i] = px;
          positions[i+1] = py;
          positions[i+2] = pz;
        }
        
        geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. RESIZE
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // CLEANUP
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      if (animationId) cancelAnimationFrame(animationId);
      if (mount && renderer) mount.removeChild(renderer.domElement);
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'absolute', top: 0, left: 0 }}
    >
      <div style={{
        position: 'absolute', 
        top: '50%', left: '50%', 
        transform: 'translate(-50%, -50%)', 
        textAlign: 'center', pointerEvents: 'none',
        zIndex: 10,
        mixBlendMode: 'difference' 
      }}>
        <h1 style={{fontSize: '5vw', margin: 0, fontFamily: 'sans-serif', color: '#fff'}}>Rebooting</h1>
      </div>
    </div>
  );
};

export default ParticleWorldMap;