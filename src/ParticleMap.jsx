import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const IMAGE_URL = `${import.meta.env.BASE_URL}worldmap.png`;

const WorldParticle = ({ theme }) => {
  const mountRef = useRef(null);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const isDark = theme === 'dark';

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const supportsWebGL = () => {
      try {
        const testCanvas = document.createElement('canvas');
        return Boolean(
          window.WebGL2RenderingContext && testCanvas.getContext('webgl2')
        ) || Boolean(
          window.WebGLRenderingContext && testCanvas.getContext('webgl')
        );
      } catch {
        return false;
      }
    };

    if (!supportsWebGL()) {
      setWebglAvailable(false);
      return undefined;
    }

    const scene = new THREE.Scene();
    scene.background = null;

    const width = mount.clientWidth || 1;
    const height = mount.clientHeight || 1;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 180;

    let renderer;

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (error) {
      setWebglAvailable(false);
      console.warn('ParticleMap: WebGL renderer could not be created.', error);
      return undefined;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    setWebglAvailable(true);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = IMAGE_URL;

    let particles;
    let animationFrameId;
    let isDisposed = false;

    img.onload = () => {
      if (isDisposed) return;

      const canvas = document.createElement('canvas');
      const mapWidth = 240;
      const mapHeight = 120;

      canvas.width = mapWidth;
      canvas.height = mapHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, mapWidth, mapHeight);

      const imgData = ctx.getImageData(0, 0, mapWidth, mapHeight);
      const data = imgData.data;

      const positions = [];
      const sizes = [];
      const step = 2;

      for (let y = 0; y < mapHeight; y += step) {
        for (let x = 0; x < mapWidth; x += step) {
          const index = (y * mapWidth + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];

          if (a > 20 && (r < 200 || g < 200 || b < 200)) {
            const pX = (x - mapWidth / 2) * 2.5;
            const pY = -(y - mapHeight / 2) * 2.5;
            const pZ = 0;

            positions.push(pX, pY, pZ);
            sizes.push(Math.random());
          }
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
      );
      geometry.setAttribute(
        'aRandom',
        new THREE.Float32BufferAttribute(sizes, 1)
      );

      const material = new THREE.ShaderMaterial({
        vertexShader: `
          uniform float uTime;
          attribute float aRandom;
          varying float vAlpha;

          void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            float wave = sin(
              modelPosition.x * 0.03 +
              sin(modelPosition.y * 0.08 + uTime) +
              aRandom * 4.0 -
              uTime * 2.0
            );
            wave = (wave + 1.0) / 2.0;
            float waveEffect = pow(wave, 2.0);

            float baseVisibility = 0.2 + (aRandom * 0.3);
            float finalSize = baseVisibility + (waveEffect * 0.8 * aRandom);

            gl_PointSize = finalSize * 15.0;
            gl_PointSize *= (100.0 / -viewMatrix[3].z);

            vAlpha = finalSize;
            gl_Position = projectionMatrix * viewMatrix * modelPosition;
          }
        `,
        fragmentShader: `
          varying float vAlpha;
          uniform vec3 uColor;

          void main() {
            float dist = distance(gl_PointCoord, vec2(0.5));
            if (dist > 0.5) discard;

            gl_FragColor = vec4(uColor, vAlpha);
          }
        `,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(1, 1, 1) },
        },
        transparent: true,
        depthWrite: false,
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);
    };

    img.onerror = (error) => {
      console.warn('ParticleMap: map image could not be loaded.', error);
      setWebglAvailable(false);
    };

    const clock = new THREE.Clock();

    const animate = () => {
      if (isDisposed) return;

      if (particles) {
        particles.material.uniforms.uTime.value = clock.getElapsedTime();
        const targetColor = isDark
          ? new THREE.Color(1, 1, 1)
          : new THREE.Color(0, 0, 0);

        particles.material.uniforms.uColor.value.lerp(targetColor, 0.1);
      }

      renderer.render(scene, camera);
      animationFrameId = window.requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;

      const nextWidth = mount.clientWidth || 1;
      const nextHeight = mount.clientHeight || 1;

      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      window.removeEventListener('resize', handleResize);

      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }

      if (particles) {
        particles.geometry.dispose();
        particles.material.dispose();
      }

      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div ref={mountRef} className="absolute inset-0 h-full w-full z-0">
      {!webglAvailable && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={IMAGE_URL}
            alt="World map"
            className={`h-full w-full object-contain px-4 opacity-50 transition duration-500 ${
              isDark ? 'invert' : ''
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default WorldParticle;
