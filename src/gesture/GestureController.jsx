// import React, { useEffect, useRef, useState } from "react";

// // Smooth cursor movement helper
// const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

// export default function GestureController() {
//   const videoRef = useRef(null);
//   const [isReady, setIsReady] = useState(false);
  
//   const cursorRef = useRef({ x: 0, y: 0 });
  
//   // Track karne ke liye ki abhi hum kis element ke upar hain
//   const lastHoveredElement = useRef(null);

//   useEffect(() => {
//     let handsInstance = null;
//     let cameraInstance = null;

//     // 1. Script Loader
//     const loadScript = (src) => {
//       return new Promise((resolve, reject) => {
//         if (document.querySelector(`script[src="${src}"]`)) {
//           resolve(); 
//           return;
//         }
//         const script = document.createElement("script");
//         script.src = src;
//         script.crossOrigin = "anonymous";
//         script.onload = () => resolve();
//         script.onerror = () => reject(new Error(`Failed to load ${src}`));
//         document.body.appendChild(script);
//       });
//     };

//     // 2. Main Setup
//     const setupMediaPipe = async () => {
//       try {
//         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
//         await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");

//         if (!window.Hands || !window.Camera) {
//           throw new Error("MediaPipe libraries failed to load");
//         }

//         handsInstance = new window.Hands({
//           locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
//         });

//         handsInstance.setOptions({
//           maxNumHands: 1,
//           modelComplexity: 1,
//           minDetectionConfidence: 0.7,
//           minTrackingConfidence: 0.7,
//         });

//         handsInstance.onResults(onResults);

//         if (videoRef.current) {
//           cameraInstance = new window.Camera(videoRef.current, {
//             onFrame: async () => {
//               if (handsInstance) await handsInstance.send({ image: videoRef.current });
//             },
//             width: 640,
//             height: 480,
//           });
//           await cameraInstance.start();
//           setIsReady(true);
//         }
//       } catch (error) {
//         console.error("Gesture Controller Error:", error);
//       }
//     };

//     // 3. Gesture Logic
//     const onResults = (results) => {
//       if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
//         return;
//       }

//       const lm = results.multiHandLandmarks[0];

//       // --- A. Cursor Movement ---
//       const rawX = (1 - lm[8].x) * window.innerWidth; 
//       const rawY = lm[8].y * window.innerHeight;

//       cursorRef.current.x = lerp(cursorRef.current.x, rawX, 0.2);
//       cursorRef.current.y = lerp(cursorRef.current.y, rawY, 0.2);

//       const { x, y } = cursorRef.current;
//       window.dispatchEvent(new CustomEvent("virtual-move", { detail: { x, y } }));

//       // --- NEW: VIRTUAL HOVER ENGINE ---
//       // Pata lagao ki cursor ke niche kya hai
//       const elementUnderCursor = document.elementFromPoint(x, y);

//       // Agar element change hua hai (humne mouse move kiya ek cheez se dusri cheez pe)
//       if (lastHoveredElement.current !== elementUnderCursor) {
        
//         // 1. Purane element se 'Leave' event fire karo
//         if (lastHoveredElement.current) {
//             const leaveEvent = new MouseEvent('mouseleave', {
//                 view: window,
//                 bubbles: true, // React ke liye bubbling zaroori hai
//                 cancelable: true
//             });
//             const outEvent = new MouseEvent('mouseout', {
//                 view: window,
//                 bubbles: true,
//                 cancelable: true
//             });
//             lastHoveredElement.current.dispatchEvent(leaveEvent);
//             lastHoveredElement.current.dispatchEvent(outEvent);
//         }

//         // 2. Naye element pe 'Enter' event fire karo
//         if (elementUnderCursor) {
//             const enterEvent = new MouseEvent('mouseenter', {
//                 view: window,
//                 bubbles: true,
//                 cancelable: true
//             });
//             const overEvent = new MouseEvent('mouseover', {
//                 view: window,
//                 bubbles: true,
//                 cancelable: true
//             });
//             elementUnderCursor.dispatchEvent(enterEvent);
//             elementUnderCursor.dispatchEvent(overEvent);
//         }

//         // Current element ko update karo
//         lastHoveredElement.current = elementUnderCursor;
//       }


//       // --- B. Gesture Detection ---

//       const isIndexUp = lm[8].y < lm[6].y;
//       const isMiddleUp = lm[12].y < lm[10].y;
//       const isRingUp = lm[16].y < lm[14].y;
//       const isPinkyUp = lm[20].y < lm[18].y;

//       const isVictory = isIndexUp && isMiddleUp && !isRingUp && !isPinkyUp;
//       const isOpenPalm = isIndexUp && isMiddleUp && isRingUp && isPinkyUp;

//       const pinchDist = Math.hypot(lm[8].x - lm[4].x, lm[8].y - lm[4].y);
//       const isPinching = pinchDist < 0.05;

//       // --- C. Execution ---
      
//       const SCROLL_SPEED = 60; 

//       if (isVictory) {
//         window.scrollBy({ top: SCROLL_SPEED, behavior: "auto" });
//       } else if (isOpenPalm) {
//         window.scrollBy({ top: -SCROLL_SPEED, behavior: "auto" });
//       }

//       if (!isVictory && !isOpenPalm) {
//         if (isPinching) {
//             window.dispatchEvent(new CustomEvent("virtual-click", { detail: { isClicking: true } }));
            
//             // Mouse click bhi simulate karo usi jagah par
//             if (elementUnderCursor && !window.isClickingRecently) {
//                 elementUnderCursor.click();
                
//                 if (elementUnderCursor.tagName === 'INPUT' || elementUnderCursor.tagName === 'TEXTAREA') {
//                     elementUnderCursor.focus();
//                 }

//                 window.isClickingRecently = true;
//                 setTimeout(() => window.isClickingRecently = false, 400); 
//             }
//         } else {
//              window.dispatchEvent(new CustomEvent("virtual-click", { detail: { isClicking: false } }));
//         }
//       }
//     };

//     setupMediaPipe();

//     return () => {
//       if (cameraInstance) cameraInstance.stop();
//       if (handsInstance) handsInstance.close();
//     };
//   }, []);

//   return (
//     <div className="fixed top-0 left-0 w-1 h-1 opacity-0 pointer-events-none overflow-hidden z-[-1]">
//       <video
//         ref={videoRef}
//         className="w-full h-full object-cover transform scale-x-[-1]"
//         playsInline
//         muted
//       />
//     </div>
//   );
// }