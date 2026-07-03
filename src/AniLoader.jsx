import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import img1 from './assets/img1.png';

import gif1 from './assets/gif1.gif';

import video1 from './assets/vid1.mp4';
import video2 from './assets/vid2.mp4';

import img6 from './assets/img6.png';

const dummyMedia = [
  // { type: 'image', src: img1 },
  { type: 'gif', src: gif1 },
  { type: 'video', src: video1 },
  { type: 'video', src: video2 },
];

export default function AnimatedLogo({ onComplete, allowComplete = true }) {
  const containerRef = useRef(null);
  const squareRef = useRef(null);
  const textWrapperRef = useRef(null);
  const imgWrapperRef = useRef(null);
  const [animationReady, setAnimationReady] = useState(false);
  const exitStartedRef = useRef(false);

  useEffect(() => {
    if (!animationReady || !allowComplete || exitStartedRef.current) return;

    exitStartedRef.current = true;
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.8,
      onComplete,
    });
  }, [allowComplete, animationReady, onComplete]);
  useGSAP(() => {
    const flashTl = gsap.timeline({ repeat: -1 });
    dummyMedia.forEach((_, i) => {
      flashTl
        .set('.flash-media', { opacity: 0 })
        .set(`.media-${i}`, { opacity: 1 })
        .to({}, { duration: 0.50 });
    });
    const mainTl = gsap.timeline({
      delay: 2,
      onComplete: () => {
        setAnimationReady(true);
      }
    });
    mainTl.to(squareRef.current, {
      width: '140px',
      height: '140px',
      duration: 0.7,
      ease: 'expo.inOut',
    });
    mainTl.to(textWrapperRef.current, {
      width: 'auto',
      duration: 1.1,
      ease: 'expo.inOut',
    }, '-=0.1');
    mainTl.fromTo(
      '.text-line',
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, stagger: 0.25, ease: 'power4.out' },
      '-=0.8'
    );
    mainTl.to(imgWrapperRef.current, {
      width: 'auto',
      duration: 0.9,
      ease: 'expo.inOut',
    }, '+=0.1');

    mainTl.fromTo(
      '.main-text',
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: 'power4.out' },
      '-=0.6'
    );

    mainTl.to({}, { duration: 2 });

  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-white flex items-center justify-center overflow-hidden font-sans text-black px-4"
    >
      <div className="flex items-center scale-[0.58] min-[420px]:scale-75 sm:scale-90 md:scale-100 origin-center">

        <div
          ref={squareRef}
          className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] flex-shrink-0 bg-black overflow-hidden"
        >
          {dummyMedia.map((item, index) => {

            if (item.type === 'video') {
              return (
                <video
                  key={index}
                  src={item.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={`flash-media media-${index} absolute inset-0 w-full h-full object-contain opacity-0`}
                />
              );
            }
            return (
              <img
                key={index}
                src={item.src}
                alt={`media-${index}`}
                className={`flash-media media-${index} absolute inset-0 w-full h-full object-contain opacity-0`}
              />
            );
          })}
        </div>
        <div
          ref={textWrapperRef}
          className="w-0 overflow-hidden whitespace-nowrap"
        >
          <div className="pl-3 flex flex-col justify-center text-lg md:text-xl font-bold leading-snug tracking-widest">
            <div className="text-line opacity-0">DIGITAL</div>
            <div className="text-line opacity-0">STUDIO</div>
            <div className="text-line opacity-0">CRAFTING</div>
            <div className="text-line opacity-0 mt-1 text-gray-500">EXPERIENCES</div>
          </div>
        </div>
        <div
          ref={imgWrapperRef}
          className="w-0 overflow-hidden whitespace-nowrap"
        >
          <div className="pl-4">
            <img
              src={img6}
              alt="logo"
              className="main-text opacity-0 w-32 md:w-80 object-contain"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
