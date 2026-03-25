import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CursorFollower = () => {
  const dotRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const glow = glowRef.current;
    
    const moveCursor = (e) => {
      // Precision dot (fast)
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      // Soft glow (delayed/smooth)
      gsap.to(glow, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: 'power3.out'
      });
    };

    const handleHover = (e) => {
      const isInteractive = e.target.closest('button, a, input, .cursor-pointer, [role="button"]');
      if (isInteractive) {
        gsap.to(dot, { scale: 2, duration: 0.3 });
        gsap.to(glow, { scale: 1.5, opacity: 0.8, duration: 0.3 });
      } else {
        gsap.to(dot, { scale: 1, duration: 0.3 });
        gsap.to(glow, { scale: 1, opacity: 0.5, duration: 0.3 });
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleHover);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleHover);
    };
  }, []);

  return (
    <>
      {/* Precision Dot (Pastel Blue) */}
      <div 
        ref={dotRef} 
        className="fixed top-0 left-0 w-3 h-3 -ml-1.5 -mt-1.5 bg-primary rounded-full pointer-events-none z-[10000] shadow-[0_0_10px_rgba(96,165,250,0.5)] opacity-80" 
      />
      {/* Soft Glow (Pastel Blue) */}
      <div 
        ref={glowRef} 
        className="fixed top-0 left-0 w-24 h-24 -ml-12 -mt-12 bg-primary/20 rounded-full blur-[30px] pointer-events-none z-[9999] mix-blend-multiply opacity-50" 
      />
    </>
  );
};

export default CursorFollower;
