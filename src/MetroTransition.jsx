import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, useAnimations, useGLTF } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import ScreenContent from "./ScreenContent";

gsap.registerPlugin(ScrollTrigger);
useGLTF.setDecoderPath("/draco/");

const INTRO_SCROLL_FACTOR = 5;
const INTRO_SCROLL_HEIGHT = `${Math.ceil(INTRO_SCROLL_FACTOR * 100) + 20}vh`;
const OUTRO_SCROLL_LENGTH = "+=420";
const METRO_MODEL = "/Metro.glb";
const TAB_MODEL = "/Final_Tab_Animation.glb";
const WINDOW_VIDEO = "/sun.mp4";
const SCREEN_VIDEO = "/notes.mp4";
const SCREEN_SWITCH_PROGRESS = 0.22;
const SCREEN_SYNC_SECONDS = 20;
const SCREEN_PLAYBACK_SPEED = 0.4;
const SCREEN_CANVAS_WIDTH = 1920;
const SCREEN_CANVAS_HEIGHT = 1200;
const LOOP_RESET_SCROLL_TOP = 0;
let metroAssetsPromise = null;

function updateBodyCursorState(className, isActive) {
  document.body.classList.toggle(className, isActive);
  const shouldHideCursor =
    document.body.classList.contains("is-ani-loader-active") ||
    document.body.classList.contains("is-metro-intro-active") ||
    document.body.classList.contains("is-metro-outro-active");

  document.body.style.cursor = shouldHideCursor ? "none" : "";
  window.dispatchEvent(new Event("cursor-visibility-change"));
}

useGLTF.preload(METRO_MODEL);
useGLTF.preload(TAB_MODEL);

export function preloadMetroAssets() {
  if (!metroAssetsPromise) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const loadModel = (path) =>
      new Promise((resolve, reject) => {
        gltfLoader.load(path, resolve, undefined, reject);
      });

    metroAssetsPromise = Promise.all([
      loadModel(METRO_MODEL),
      loadModel(TAB_MODEL),
    ]).finally(() => {
      dracoLoader.dispose();
    });
  }
  return metroAssetsPromise;
}

// Exactly CODE 1 Model Views
const MODEL_VIEWS = {
  compact: {
    metro: { scale: 6.2, position: [-0.38, -0.12, 3.8], rotation: [0, 0, 0] },
    tab: { scale: 18, position: [-0.1, -2.0, 6.35], rotation: [0.08, Math.PI, 0] },
    cameraPosition: [0, 0.08, 6.8],
    fov: 54,
  },
  mobile: {
    metro: { scale: 6.4, position: [-0.42, -0.1, 4.15], rotation: [0, 0, 0] },
    tab: { scale: 7.2, position: [-0.02, -0.45, 1.15], rotation: [0.1, Math.PI, 0] },
    cameraPosition: [0, 0.08, 6.35],
    fov: 52,
  },
  tablet: {
    metro: { scale: 7, position: [-0.48, -0.1, -0.8], rotation: [0.05, 0, 0] },
    tab: { scale: 8.5, position: [-0.02, -0.75, 2.1], rotation: [0.14, Math.PI, 0] },
    cameraPosition: [0, 0.12, 5.25],
    fov: 51,
  },
  desktop: {
    metro: { scale: 8, position: [-0.5, -0.1, 0.5], rotation: [0.1, 0, 0] },
    tab: { scale: 12, position: [-0.05, -1.35, 4.6], rotation: [0.18, Math.PI, 0] },
    cameraPosition: [0, 0.2, 4.5],
    fov: 50,
  },
};

function getResponsiveModelView(size) {
  const width = size.width || 1;
  const height = size.height || 1;
  const aspect = width / Math.max(height, 1);
  if (width < 480 || aspect < 0.62) return MODEL_VIEWS.compact;
  if (width < 768) return MODEL_VIEWS.mobile;
  if (width < 1024) return MODEL_VIEWS.tablet;
  return MODEL_VIEWS.desktop;
}

function ensurePlanarUvs(geometry) {
  const position = geometry.getAttribute("position");
  if (!position || geometry.getAttribute("uv")) return;
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  if (!box) return;

  const size = new THREE.Vector3();
  box.getSize(size);

  const axes = [
    { key: "x", size: size.x, min: box.min.x },
    { key: "y", size: size.y, min: box.min.y },
    { key: "z", size: size.z, min: box.min.z },
  ].sort((a, b) => b.size - a.size);
  const uAxis = axes[0];
  const vAxis = axes[1];
  const uSize = uAxis.size || 1;
  const vSize = vAxis.size || 1;
  const uvs = [];

  for (let i = 0; i < position.count; i += 1) {
    uvs.push(
      (position.getComponent(i, ["x", "y", "z"].indexOf(uAxis.key)) - uAxis.min) / uSize,
      1 - (position.getComponent(i, ["x", "y", "z"].indexOf(vAxis.key)) - vAxis.min) / vSize
    );
  }
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
}

function useSmoothMetroScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return undefined;

    const lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.1,
    });

    window.lenis = lenis;

    const updateScrollTrigger = () => ScrollTrigger.update();
    const raf = (time) => {
      if (document.body.classList.contains("is-website-screen-active")) return;
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.lenis = null;
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}

function MetroModel({ progressRef, startAtEnd = false, loopScreen = false, playScreenVideo = false, onScreenEnd, showWebsiteScreen, setShowWebsiteScreen, screenContainerRef }) {
  const group = useRef(null);
  const { scene: metroScene } = useGLTF(METRO_MODEL);
  const { scene: tabScene, animations } = useGLTF(TAB_MODEL);
  
  const clonedMetroScene = useMemo(() => cloneSkeleton(metroScene), [metroScene]);
  const clonedScene = useMemo(() => cloneSkeleton(tabScene), [tabScene]);
  const { actions, mixer } = useAnimations(animations, group);
  
  const { camera, size } = useThree();
  const view = useMemo(() => getResponsiveModelView(size), [size.width, size.height]);
  
  const screenMeshesRef = useRef([]);
  const windowMeshesRef = useRef([]);
  const windowVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const screenVideoTextureRef = useRef(null);
  
  const animationClipRef = useRef(null);
  const loopTimeRef = useRef(0);

const htmlScreenSize = useMemo(() => {
    if (size.width < 640) return { width: 1240, height: 1290, distanceFactor: 1.16, position: [0, -0.01, 1.09] };
    if (size.width < 1024) return { width: 1450, height: 780, distanceFactor: 1.18, position: [0, -0.018, 1.09] };
    return { width: 2120, height: 800, distanceFactor: 1.25, position: [0, 0.24, 0.50] };
  }, [size.width]);
  const applyScreenVideoTexture = () => {
    const videoTexture = screenVideoTextureRef.current;
    if (!videoTexture) return;
    screenMeshesRef.current.forEach((mesh) => {
      if (mesh.material.map !== videoTexture) {
        mesh.material.map = videoTexture;
        mesh.material.needsUpdate = true;
      }
    });
  };

  useEffect(() => {
    camera.position.set(...view.cameraPosition);
    camera.fov = view.fov;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, view]);

  useEffect(() => {
    screenMeshesRef.current = [];
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true; child.receiveShadow = true;
        const meshName = child.name.toLowerCase();
        const materialName = child.material?.name?.toLowerCase() || "";
        const isScreenMesh =
          meshName.includes("screen") || materialName.includes("screen") ||
          meshName.includes("cube.002_material_0") || materialName === "material.001" || materialName === "material.003";

        if (!isScreenMesh) return;
        ensurePlanarUvs(child.geometry);
        const screenMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff", toneMapped: false, side: THREE.DoubleSide });
        child.material = screenMaterial;
        screenMeshesRef.current.push(child);
      }
    });

    return () => {
      screenMeshesRef.current.forEach((mesh) => { if (mesh.material?.dispose) mesh.material.dispose(); });
      screenMeshesRef.current = [];
    };
  }, [clonedScene]);

  // Handle Window Background Video
  useEffect(() => {
    const video = document.createElement("video");
    video.src = WINDOW_VIDEO;
    video.muted = true; video.loop = true; video.playsInline = true; video.preload = "auto"; video.crossOrigin = "anonymous"; video.playbackRate = 1;
    windowVideoRef.current = video;

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace; videoTexture.flipY = false;

    windowMeshesRef.current = [];
    clonedMetroScene.traverse((child) => {
      if (!child.isMesh) return;
      const meshName = child.name.toLowerCase();
      const materialName = child.material?.name?.toLowerCase() || "";
      if (meshName.includes("window") || materialName.includes("window")) {
        child.material = new THREE.MeshBasicMaterial({ map: videoTexture, toneMapped: false, side: THREE.DoubleSide });
        windowMeshesRef.current.push(child);
      }
    });

    video.play().catch(() => {});
    return () => {
      video.pause(); video.removeAttribute("src"); video.load(); videoTexture.dispose();
      windowMeshesRef.current.forEach((mesh) => { if (mesh.material?.dispose) mesh.material.dispose(); });
      windowMeshesRef.current = []; windowVideoRef.current = null;
    };
  }, [clonedMetroScene]);

  // Handle Tablet Screen Video (notes.mp4)
  useEffect(() => {
    if (!loopScreen && !playScreenVideo) return undefined;
    const video = document.createElement("video");
    video.src = SCREEN_VIDEO; video.muted = true; video.loop = true; video.playsInline = true; video.preload = "auto"; video.crossOrigin = "anonymous"; video.currentTime = 0;
    screenVideoRef.current = video;

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace; videoTexture.flipY = false;
    screenVideoTextureRef.current = videoTexture;

    video.load();
    video.play().catch(() => {});
    applyScreenVideoTexture();

    return () => {
      video.pause(); video.removeAttribute("src"); video.load(); videoTexture.dispose();
      screenVideoRef.current = null; screenVideoTextureRef.current = null;
    };
  }, [loopScreen, playScreenVideo]);

  // Start Animation
  useEffect(() => {
    if (!animations.length) return;
    const targetAnimation = animations.find((a) => a.name === "video") || animations[0];
    const primaryAction = actions[targetAnimation.name];
    const clipDuration = targetAnimation.duration;

    if (!primaryAction) return;

    animationClipRef.current = { name: targetAnimation.name, duration: clipDuration };
    primaryAction.reset().play();
    primaryAction.paused = false;
    primaryAction.clampWhenFinished = !loopScreen;
    primaryAction.setLoop(loopScreen ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
    primaryAction.time = startAtEnd ? clipDuration : 0;
    loopTimeRef.current = startAtEnd ? clipDuration : 0;

    return () => {
      animationClipRef.current = null;
      primaryAction.stop();
    };
  }, [actions, animations, loopScreen, startAtEnd]);

  // MAIN RENDER FRAME LOGIC
  useFrame((_, delta) => {
    const animationClip = animationClipRef.current;
    if (!animationClip) return;
    const primaryAction = actions[animationClip.name];
    if (!animationClip.duration || !primaryAction) return;

    const clampedProgress = THREE.MathUtils.clamp(progressRef.current, 0, 1);

    if (loopScreen) {
      const syncDuration = Math.min(animationClip.duration, SCREEN_SYNC_SECONDS);

      // Rule 1: ANIMATION NEVER STOPS
      primaryAction.paused = false;
      const loopTime = (loopTimeRef.current + delta * SCREEN_PLAYBACK_SPEED) % syncDuration;
      loopTimeRef.current = loopTime;
      primaryAction.time = loopTime;
      mixer?.setTime(loopTime);
      const screenVideo = screenVideoRef.current;
      if (screenVideo?.duration) {
        const videoLoopDuration = Math.min(screenVideo.duration, syncDuration);
        const syncedVideoTime = Math.min(loopTime, videoLoopDuration - 0.05);
        screenVideo.playbackRate = (videoLoopDuration / syncDuration) * SCREEN_PLAYBACK_SPEED;

        if (screenVideo.paused) screenVideo.play().catch(() => {});
        if (loopTime < delta * 1.5 || Math.abs(screenVideo.currentTime - syncedVideoTime) > 0.55) {
          screenVideo.currentTime = syncedVideoTime;
        }
      }
      
      applyScreenVideoTexture();
      windowVideoRef.current?.play().catch(() => {});

      // Rule 3: TRIGGER WEBSITE OVERLAY based on scroll 
      const shouldShowWebsite = clampedProgress > SCREEN_SWITCH_PROGRESS; 
      if (shouldShowWebsite && !showWebsiteScreen) {
        setShowWebsiteScreen(true);
      } else if (!shouldShowWebsite && showWebsiteScreen) {
        setShowWebsiteScreen(false);
      }

    } else {
      // Outro scrubbing
      const animationProgress = startAtEnd ? 1 - clampedProgress : clampedProgress;
      const scrubTime = animationClip.duration * animationProgress;

      primaryAction.time = scrubTime;
      mixer?.setTime(scrubTime);

      if (playScreenVideo) {
        applyScreenVideoTexture();
        const screenVideo = screenVideoRef.current;
        if (screenVideo?.duration) {
          const syncedVideoTime = THREE.MathUtils.clamp(scrubTime % screenVideo.duration, 0, Math.max(0, screenVideo.duration - 0.05));
          if (Math.abs(screenVideo.currentTime - syncedVideoTime) > 0.25) {
            screenVideo.currentTime = syncedVideoTime;
          }
        }
        if (screenVideo?.paused) screenVideo.play().catch(() => {});
      }
    }
  });

  return (
    <group ref={group}>
      <primitive object={clonedMetroScene} scale={view.metro.scale} position={view.metro.position} rotation={view.metro.rotation} />
      <primitive object={clonedScene} scale={view.tab.scale} position={view.tab.position} rotation={view.tab.rotation} />
      
      {showWebsiteScreen && (
        <Html transform center position={htmlScreenSize.position} distanceFactor={htmlScreenSize.distanceFactor}
          style={{ width: `${htmlScreenSize.width}px`, height: `${htmlScreenSize.height}px`, pointerEvents: "auto" }}>
          <ScreenContent 
             containerBridgeRef={screenContainerRef} 
             onScreenEnd={onScreenEnd} 
             showWebsiteScreen={showWebsiteScreen} 
          />
        </Html>
      )}
    </group>
  );
}

function MetroCanvas({ progressRef, startAtEnd = false, loopScreen = false, playScreenVideo = false, onScreenEnd, showWebsiteScreen, setShowWebsiteScreen, screenContainerRef }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 1]} gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}>
      <color attach="background" args={["#ffffff"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 5, 2]} intensity={0.2} />
      <Suspense fallback={null}>
        <MetroModel progressRef={progressRef} startAtEnd={startAtEnd} loopScreen={loopScreen} playScreenVideo={playScreenVideo} onScreenEnd={onScreenEnd} showWebsiteScreen={showWebsiteScreen} setShowWebsiteScreen={setShowWebsiteScreen} screenContainerRef={screenContainerRef} />
      </Suspense>
    </Canvas>
  );
}

export function TrainIntro() {
  useSmoothMetroScroll();

  const canvasRef = useRef(null);
  const portalOverlayRef = useRef(null);
  const progressRef = useRef(0);
  const portalStartedRef = useRef(false);
  const lockedScrollTopRef = useRef(0);
  const websiteScrollContainerRef = useRef(null);
  const [isCanvasActive, setIsCanvasActive] = useState(true);
  const [showWebsiteScreen, setShowWebsiteScreen] = useState(false);
  const screenEndTimeoutRef = useRef(null);

  const handleScreenEnd = () => {
    setShowWebsiteScreen(false);
    screenEndTimeoutRef.current = setTimeout(() => {
      progressRef.current = 0;
      if (window.lenis) window.lenis.scrollTo(0, { immediate: true });
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      
      ScrollTrigger.getAll().forEach((st) => {
        if (st.animation) st.animation.progress(0);
      });
      
      ScrollTrigger.update(); ScrollTrigger.refresh();
      setIsCanvasActive(true);
    }, 100); 
  };

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    if (showWebsiteScreen) {
      lockedScrollTopRef.current = window.scrollY;
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      window.scrollTo({ top: lockedScrollTopRef.current, left: 0, behavior: "auto" });
    } else {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    }

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [showWebsiteScreen]);

  useEffect(() => {
    if (!showWebsiteScreen) {
        window.lenis?.start();
        return undefined;
    }

    window.lenis?.stop(); 
    let lastTouchY = null;
    const getContainer = () => websiteScrollContainerRef.current;
    
    const scrollContainerBy = (delta) => {
      const container = getContainer();
      if (!container) return;
      container.scrollTop = Math.max(0, Math.min(container.scrollTop + delta, container.scrollHeight - container.clientHeight));
    };

    const handleWheel = (event) => {
      const container = getContainer();
      if (!container) return;

      const scrollableChild = event.target.closest('.overflow-y-auto');
      if (scrollableChild && scrollableChild.scrollHeight > scrollableChild.clientHeight) {
        const scrollTop = Math.ceil(scrollableChild.scrollTop);
        const maxScroll = scrollableChild.scrollHeight - scrollableChild.clientHeight;
        const isAtTop = scrollTop <= 0;
        const isAtBottom = scrollTop >= maxScroll - 2;

        if ((event.deltaY < 0 && !isAtTop) || (event.deltaY > 0 && !isAtBottom)) {
            event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation?.();
            scrollableChild.scrollTop += event.deltaY;
            return; 
        }
      }

      const isContainerAtTop = container.scrollTop <= 0;
      if (event.deltaY < 0 && isContainerAtTop) {
        event.preventDefault();
        setShowWebsiteScreen(false);
        window.scrollBy({ top: -100, behavior: 'auto' });
        return;
      }

      event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation?.();
      scrollContainerBy(event.deltaY);
    };

    const handleKeyDown = (event) => {
      const container = getContainer();
      if (!container) return;
      let delta = 0;
      if (event.key === "ArrowDown") delta = 90;
      if (event.key === "ArrowUp") delta = -90;
      if (event.key === "PageDown" || event.key === " ") delta = container.clientHeight * 0.9;
      if (event.key === "PageUp") delta = -container.clientHeight * 0.9;
      if (event.key === "Home") delta = -container.scrollTop;
      if (event.key === "End") delta = container.scrollHeight;
      if (!delta) return;

      const scrollableChild = event.target.closest('.overflow-y-auto');
      if (scrollableChild && scrollableChild.scrollHeight > scrollableChild.clientHeight) {
        const scrollTop = Math.ceil(scrollableChild.scrollTop);
        const maxScroll = scrollableChild.scrollHeight - scrollableChild.clientHeight;
        const isAtTop = scrollTop <= 0;
        const isAtBottom = scrollTop >= maxScroll - 2;

        if ((delta < 0 && !isAtTop) || (delta > 0 && !isAtBottom)) {
            event.preventDefault(); event.stopPropagation();
            scrollableChild.scrollTop += delta;
            return;
        }
      }

      const isContainerAtTop = container.scrollTop <= 0;
      if (delta < 0 && isContainerAtTop) {
        setShowWebsiteScreen(false);
        window.scrollBy({ top: -100, behavior: 'auto' });
        return;
      }

      event.preventDefault(); event.stopPropagation();
      scrollContainerBy(delta);
    };

    const handleTouchStart = (event) => { lastTouchY = event.touches[0]?.clientY ?? null; };
    const handleTouchMove = (event) => {
      const currentY = event.touches[0]?.clientY;
      if (lastTouchY == null || currentY == null) return;
      const deltaY = lastTouchY - currentY;
      
      const scrollableChild = event.target.closest('.overflow-y-auto');
      if (scrollableChild && scrollableChild.scrollHeight > scrollableChild.clientHeight) {
        const scrollTop = Math.ceil(scrollableChild.scrollTop);
        const maxScroll = scrollableChild.scrollHeight - scrollableChild.clientHeight;
        const isAtTop = scrollTop <= 0;
        const isAtBottom = scrollTop >= maxScroll - 2;

        if ((deltaY < 0 && !isAtTop) || (deltaY > 0 && !isAtBottom)) {
           lastTouchY = currentY;
           return;
        }
      }
      
      const container = getContainer();
      if (container) {
        const isContainerAtTop = container.scrollTop <= 0;
        if (deltaY < 0 && isContainerAtTop) {
            setShowWebsiteScreen(false);
            window.scrollBy({ top: -100, behavior: 'auto' });
            return;
        }
      }

      event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation?.();
      scrollContainerBy(deltaY);
      lastTouchY = currentY;
    };
    
    const resetTouch = () => { lastTouchY = null; };

    document.body.classList.add("is-website-screen-active");
    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    window.addEventListener("keydown", handleKeyDown, { passive: false, capture: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false, capture: true });
    window.addEventListener("touchend", resetTouch, { passive: true, capture: true });

    return () => {
      document.body.classList.remove("is-website-screen-active");
      window.removeEventListener("wheel", handleWheel, { capture: true });
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("touchstart", handleTouchStart, { capture: true });
      window.removeEventListener("touchmove", handleTouchMove, { capture: true });
      window.removeEventListener("touchend", resetTouch, { capture: true });
      window.lenis?.start();
    };
  }, [showWebsiteScreen]);

  useEffect(() => {
    const updateCanvasState = () => {
      setIsCanvasActive(window.scrollY <= window.innerHeight * INTRO_SCROLL_FACTOR + 200);
    };
    updateCanvasState();
    window.addEventListener("scroll", updateCanvasState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateCanvasState);
      if (screenEndTimeoutRef.current) clearTimeout(screenEndTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    updateBodyCursorState("is-metro-intro-active", isCanvasActive && !showWebsiteScreen);
    return () => updateBodyCursorState("is-metro-intro-active", false);
  }, [isCanvasActive, showWebsiteScreen]);

  useGSAP(() => {
    const canvasNode = canvasRef.current;
    const portalOverlay = portalOverlayRef.current;
    if (!canvasNode || !portalOverlay) return;

    gsap.set("#portal-landing-root", { scale: 1.1, filter: "blur(20px)", opacity: 1, transformOrigin: "center top" });
    gsap.set(canvasNode, { scale: 1, opacity: 1, filter: "blur(0px)", transformOrigin: "center center" });
    gsap.set(portalOverlay, { opacity: 0, scale: 1, background: "rgba(255,255,255,0.92)" });

    const introState = { progress: 0, overlay: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: () => `+=${window.innerHeight * INTRO_SCROLL_FACTOR}`,
        scrub: 1.6,
        invalidateOnRefresh: true,
        onEnter: () => setIsCanvasActive(true),
        onEnterBack: () => {
          portalStartedRef.current = false;
          setIsCanvasActive(true);
          window.dispatchEvent(new Event("hidePortalAnimation"));
        },
        onLeaveBack: () => {
          portalStartedRef.current = false;
          progressRef.current = 0;
          setIsCanvasActive(true);
          window.dispatchEvent(new Event("hidePortalAnimation"));
        },
        onLeave: () => {
          progressRef.current = 1;
          setIsCanvasActive(false);
          gsap.set(canvasNode, { scale: 2.25, filter: "blur(12px)", opacity: 0 });
          gsap.set(portalOverlay, { opacity: 0, scale: 1 });
          gsap.set("#portal-landing-root", { scale: 1, filter: "blur(0px)", clearProps: "transform,filter" });
          if (!portalStartedRef.current) {
            portalStartedRef.current = true;
            window.dispatchEvent(new Event("startPortalAnimation"));
          }
        },
      },
    });

    tl.to(introState, {
      progress: 1, ease: "none", duration: 0.8,
      onUpdate: () => progressRef.current = THREE.MathUtils.clamp(introState.progress, 0, 1)
    })
      .to(introState, {
        overlay: 0, duration: 0.25, ease: "power2.out",
        onUpdate: () => gsap.set(portalOverlay, { opacity: introState.overlay, scale: 1 })
      }, "reveal")
      .to(canvasNode, { scale: 2.25, filter: "blur(12px)", opacity: 0, ease: "power2.in", duration: 0.25 }, "reveal")
      .to("#portal-landing-root", {
        scale: 1, filter: "blur(0px)", duration: 0.25, ease: "power2.out", clearProps: "transform,filter",
        onStart: () => {
          if (!portalStartedRef.current) {
            portalStartedRef.current = true;
            window.dispatchEvent(new Event("startPortalAnimation"));
          }
        }
      }, "reveal")
      .to({}, { duration: 0.25 });
  }, []);

  return (
    <>
      <div className="w-full pointer-events-none" style={{ height: INTRO_SCROLL_HEIGHT }} />
      <section
        className={`fixed top-0 left-0 w-full h-screen bg-transparent overflow-hidden z-[51] ${showWebsiteScreen ? "pointer-events-auto" : "pointer-events-none"}`}
        style={{ height: "100svh", cursor: showWebsiteScreen ? "auto" : "none" }}
      >
        <div ref={canvasRef} className="w-full h-full origin-center">
          {isCanvasActive ? <MetroCanvas progressRef={progressRef} loopScreen onScreenEnd={handleScreenEnd} showWebsiteScreen={showWebsiteScreen} setShowWebsiteScreen={setShowWebsiteScreen} screenContainerRef={websiteScrollContainerRef} /> : null}
        </div>
        <div ref={portalOverlayRef} className="absolute inset-0 pointer-events-none" style={{ background: "#ffffff" }} />
      </section>
    </>
  );
}

export function TrainOutro() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const portalOverlayRef = useRef(null);
  const progressRef = useRef(0);
  const [isCanvasActive, setIsCanvasActive] = useState(false);

  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => setIsCanvasActive(entry.isIntersecting), { root: null, rootMargin: "200% 0px 200% 0px", threshold: 0 });
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    updateBodyCursorState("is-metro-outro-active", isCanvasActive);
    return () => updateBodyCursorState("is-metro-outro-active", false);
  }, [isCanvasActive]);

  useGSAP(() => {
    const canvasNode = canvasRef.current;
    const portalOverlay = portalOverlayRef.current;
    const contactSection = document.getElementById("contact");
    if (!canvasNode || !portalOverlay) return;

    gsap.set(canvasNode, { scale: 2.25, filter: "blur(2px)", opacity: 0, transformOrigin: "center center" });
    gsap.set(portalOverlay, { opacity: 0, scale: 1 });

    const outroState = { progress: 0, overlay: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "bottom bottom",
        end: OUTRO_SCROLL_LENGTH,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onEnter: () => { progressRef.current = 0; setIsCanvasActive(true); },
        onEnterBack: () => setIsCanvasActive(true),
        onLeaveBack: () => {
          progressRef.current = 0;
          gsap.set(canvasNode, { scale: 2.25, filter: "blur(2px)", opacity: 0 });
          gsap.set(portalOverlay, { opacity: 0, scale: 1 });
        },
        onLeave: () => {
          progressRef.current = 1;
          const loopOverlay = document.createElement("div");
          Object.assign(loopOverlay.style, { position: "fixed", inset: "0", zIndex: "999999", pointerEvents: "none", background: "#0d0d0d", opacity: "0" });
          document.body.appendChild(loopOverlay);

          gsap.timeline({
            defaults: { ease: "power2.inOut" },
            onComplete: () => {
              gsap.set(canvasNode, { opacity: 0, scale: 1, filter: "blur(0px)" });
              gsap.set(portalOverlay, { opacity: 0, scale: 1 });
              if (contactSection) gsap.set(contactSection, { opacity: 1, scale: 1, filter: "blur(0px)", clearProps: "transform,filter,opacity" });
              window.dispatchEvent(new Event("hidePortalAnimation"));
              setIsCanvasActive(true);
              progressRef.current = 0;
              const scrollingElement = document.scrollingElement || document.documentElement;

              requestAnimationFrame(() => {
                scrollingElement.scrollTop = LOOP_RESET_SCROLL_TOP;
                document.documentElement.scrollTop = LOOP_RESET_SCROLL_TOP;
                document.body.scrollTop = LOOP_RESET_SCROLL_TOP;
                window.scrollTo({ top: LOOP_RESET_SCROLL_TOP, left: 0, behavior: "auto" });
                requestAnimationFrame(() => {
                  ScrollTrigger.refresh();
                  gsap.to(loopOverlay, { opacity: 0, duration: 0.65, ease: "power3.out", onComplete: () => loopOverlay.remove() });
                });
              });
            },
          })
            .to([canvasNode, contactSection].filter(Boolean), { opacity: 0, y: 24, scale: 0.97, filter: "blur(24px)", duration: 0.72, stagger: { amount: 0.08, from: "center" } })
            .to(loopOverlay, { opacity: 1, duration: 0.38, ease: "power3.inOut" }, "-=0.28");
        },
      },
    });

    tl.to(canvasNode, { opacity: 1, duration: 0.05 }, "start");
    if (contactSection) tl.to(contactSection, { scale: 0.9, filter: "blur(0.75px)", opacity: 0.96, duration: 0.16, ease: "power2.in", clearProps: "transform,filter" }, "start");

    tl.to(portalOverlay, { opacity: 0, scale: 1, duration: 0.05, ease: "power2.out" }, "start")
      .to(outroState, { progress: 1, duration: 0.75, ease: "none", onUpdate: () => progressRef.current = THREE.MathUtils.clamp(outroState.progress, 0, 1) }, "start+=0.25")
      .to(outroState, { overlay: 1, duration: 0.75, ease: "none", onUpdate: () => gsap.set(portalOverlay, { opacity: 0, scale: 1 }) }, "start+=0.15")
      .to(canvasNode, { scale: 1, filter: "blur(0px)", ease: "power2.out", duration: 0.2 }, "start+=0.05");
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full h-screen relative z-[51] pointer-events-none -mt-[100vh] overflow-hidden" style={{ height: "100svh", marginTop: "-100svh", cursor: "none" }}>
      <div ref={canvasRef} className="w-full h-full origin-center">
        {isCanvasActive ? <MetroCanvas progressRef={progressRef} startAtEnd playScreenVideo /> : null}
      </div>
      <div ref={portalOverlayRef} className="absolute inset-0 pointer-events-none" style={{ background: "rgba(255,255,255,0.92)" }} />
    </section>
  );
}