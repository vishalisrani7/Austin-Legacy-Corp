import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

const PillNav = ({
  items,
  activeHref,
  className = '',
  ease = 'power3.out',
  baseColor = '#000000ff',
  pillColor = '#060010',
  hoveredPillTextColor = '#060010',
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true,
  onItemClick
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle || !circle.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        
        if (rect.width === 0) return; 

        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        if (tlRefs.current[index]) tlRefs.current[index].kill();

        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.5, ease, overwrite: 'auto' }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 0.5, ease, overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 30), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 0.5, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    const timer = setTimeout(() => {
        layout();
    }, 100);

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    if (initialLoadAnimation) {
      const navItems = navItemsRef.current;
      if (navItems) gsap.fromTo(navItems, { width: 0 }, { width: 'auto', duration: 0.6, ease });
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      tlRefs.current.forEach(tl => tl?.kill());
    };
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = i => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    
    if(activeTweenRefs.current[i]) activeTweenRefs.current[i].kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.4,
      ease
    });
  };

  const handleLeave = i => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    
    if(activeTweenRefs.current[i]) activeTweenRefs.current[i].kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.3,
      ease
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 20, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.3,
            ease,
            transformOrigin: 'bottom center'
          }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 20,
          scale: 0.9,
          duration: 0.2,
          ease,
          transformOrigin: 'bottom center',
          onComplete: () => {
            gsap.set(menu, { visibility: 'hidden' });
          }
        });
      }
    }

    onMobileMenuClick?.();
  };

  const isRouterLink = () => false;

  const cssVars = {
    ['--base']: baseColor,
    ['--pill-bg']: pillColor,
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: resolvedPillTextColor,
    ['--nav-h']: '42px',
    ['--pill-pad-x']: '18px',
    ['--pill-gap']: '3px'
  };

  return (
    <div className={`relative flex justify-center w-full md:w-auto ${className}`}>
      <nav
        className={`flex items-center justify-center box-border`}
        aria-label="Primary"
        style={cssVars}
      >
        
        <div
          ref={navItemsRef}
          className="relative items-center rounded-full hidden md:flex bg-none"
         style={{ height: 'var(--nav-h)', background: 'transparent' }}

        >
          <ul role="menubar" className="list-none flex items-stretch m-0 p-[3px] h-full bg-none" style={{ gap: 'var(--pill-gap)' }}>
            {items.map((item, i) => {
              const isActive = activeHref === item.href;
              const pillStyle = {
                background: 'var(--pill-bg, #000000ff)',
                color: 'var(--pill-text, var(--base, #ffffffff))',
                paddingLeft: 'var(--pill-pad-x)',
                paddingRight: 'var(--pill-pad-x)'
              };

              const PillContent = (
                <>
                  <span
                    className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                    style={{ background: 'var(--base, #ffffffff)', willChange: 'transform' }}
                    aria-hidden="true"
                    ref={el => { circleRefs.current[i] = el; }}
                  />
                  <span className="label-stack relative inline-block leading-[1] z-[2]">
                    <span className="pill-label relative z-[2] inline-block leading-[1]" style={{ willChange: 'transform' }}>
                      {item.label}
                    </span>
                    <span
                      className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                      style={{ color: 'var(--hover-text, #000000ff)', willChange: 'transform, opacity' }}
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </span>
                  {isActive && (
                    <span
                      className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full z-[4]"
                      style={{ background: 'var(--base, #ffffffff)' }}
                      aria-hidden="true"
                    />
                  )}
                </>
              );

              const basePillClasses = 'relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-semibold text-[16px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-0';

              return (
                <li key={item.href} role="none" className="flex h-full">
                  {isRouterLink(item.href) ? (
                    <Link
                      role="menuitem"
                      to={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      {PillContent}
                    </Link>
                  ) : (
                    <a
                      role="menuitem"
                      href={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                      onClick={(e) => {
                        e.preventDefault();
                        onItemClick?.(item.href);
                      }}
                    >
                      {PillContent}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <button
          ref={hamburgerRef}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden rounded-full border-0 flex flex-col items-center justify-center gap-1 cursor-pointer p-0 relative shadow-xl"
          style={{ width: 'var(--nav-h)', height: 'var(--nav-h)', background: 'var(--base, #ffffffff)' }}
        >
          <span className="hamburger-line w-8 h-1 rounded origin-center transition-all duration-[10ms]" style={{ background: 'var(--pill-bg, #000000ff)' }} />
          <span className="hamburger-line w-8 h-1 rounded origin-center transition-all duration-[10ms]" style={{ background: 'var(--pill-bg, #000000ff)' }} />
          
        </button>
      </nav>

      <div 
        ref={mobileMenuRef} 
        className="md:hidden absolute bottom-[120%] left-1/2 -translate-x-1/2 w-[200px] rounded-[20px] shadow-2xl z-[998] origin-bottom invisible" 
        style={{ ...cssVars, background: 'var(--base, #ffffff)' }}
      >
         <ul className="list-none m-0 p-2 flex flex-col gap-1 text-center">
           {items.map(item => (
             <li key={item.href}>
                <a 
                  href={item.href}
                  className="block py-3 px-4 text-sm font-bold uppercase rounded-[12px] transition-colors hover:bg-black/5"
                  style={{ color: 'var(--pill-bg, #000)' }}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleMobileMenu(); 
                    onItemClick?.(item.href); 
                  }}
                >
                  {item.label}
                </a>
             </li>
           ))}
         </ul>
      </div>
    </div>
  );
};

export default PillNav;