import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef, useImperativeHandle } from 'react';
import gsap from 'gsap';
export const Card2 = forwardRef(({ customClass, onClick, index, ...rest }, ref) => (
  <div
    ref={ref}
    onClick={() => onClick && onClick(index)} 
    {...rest}
    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d] [will-change:transform] cursor-pointer ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  />
));
Card2.displayName = 'Card2';

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY, 
  z: -i * distX * 1.5,
  zIndex: total - i,
  opacity: 1 - (i * 0.05),
  scale: 1 - (i * 0.05) 
});

const CardSwap2 = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  skewAmount = 6, 
  currentIndex = 0, 
  onCardClick, 
  children
}) => {
  const containerRef = useRef(null);
  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(() => childArr.map(() => React.createRef()), [childArr.length]);

  useEffect(() => {
    const total = refs.length;
    
    refs.forEach((ref, i) => {
      const el = ref.current;
      if (!el) return;

      const visualIndex = (i - currentIndex + total) % total;

      const slot = makeSlot(visualIndex, cardDistance, verticalDistance, total);

      gsap.to(el, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        opacity: slot.opacity,
        zIndex: slot.zIndex,
        scale: slot.scale,
        skewY: skewAmount, 
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto"
      });
    });

  }, [currentIndex, cardDistance, verticalDistance, skewAmount, refs]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child) ? cloneElement(child, {
        key: i,
        ref: refs[i],
        index: i,
        onClick: onCardClick,
        style: { width, height, ...(child.props.style ?? {}) },
      }) : child
  );

  return (
    <div
      ref={containerRef}
      className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-[15%] perspective-[1200px] 
                 max-[1024px]:scale-[0.8] max-[1024px]:translate-x-[20%]
                 max-[768px]:relative max-[768px]:top-auto max-[768px]:right-auto max-[768px]:translate-y-0 max-[768px]:translate-x-0 max-[768px]:scale-[0.6] max-[768px]:mx-auto max-[768px]:mt-20 "
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
};

export default CardSwap2;