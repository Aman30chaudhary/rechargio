import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const DynamicBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating blobs animation with parallax
      gsap.to('.blob', {
        x: 'random(-150, 150)',
        y: 'random(-150, 150)',
        duration: 'random(15, 25)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 3,
          from: 'random'
        }
      });

      // Parallax on scroll
      window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        gsap.to('.parallax-slow', { y: scrolled * 0.1, duration: 1, ease: 'power1.out' });
        gsap.to('.parallax-fast', { y: scrolled * 0.2, duration: 1, ease: 'power1.out' });
      });

      // Subtle pulse animation
      gsap.to('.blob', {
        scale: 'random(0.7, 1.3)',
        opacity: 'random(0.1, 0.4)',
        duration: 'random(8, 12)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Animated gradient overlay movement
      gsap.to('.gradient-overlay', {
        rotate: 360,
        duration: 40,
        repeat: -1,
        ease: 'none'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-50 overflow-hidden bg-[#F8FAFC]"
      style={{
        backgroundImage: 'linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 100%)',
      }}
    >
      {/* Layered Animated Gradients (Pastel) */}
      <div className="gradient-overlay absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-[0.4] pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, #BFDBFE 0%, transparent 50%), radial-gradient(circle at 30% 70%, #DBEAFE 0%, transparent 40%)'
        }}
      />

      {/* Animated Blobs (Pastel Blue) */}
      <div className="blob parallax-slow absolute top-[5%] left-[5%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[120px]" />
      <div className="blob parallax-fast absolute top-[40%] right-[5%] w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-[140px]" />
      <div className="blob parallax-slow absolute bottom-[5%] left-[25%] w-[550px] h-[550px] bg-blue-100/30 rounded-full blur-[120px]" />
      <div className="blob parallax-fast absolute top-[20%] left-[45%] w-[400px] h-[400px] bg-sky-100/20 rounded-full blur-[100px]" />

      {/* Clean Minimal Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 L90 90 M90 10 L10 90' stroke='%2360A5FA' stroke-width='0.2' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />
      
      {/* Soft Dot Matrix */}
      <div 
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: 'radial-gradient(circle, #60A5FA 0.5px, transparent 0.5px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Noise Texture (Reduced for light theme) */}
      <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Soft Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(255,255,255,0.5)]" />
    </div>
  );
};

export default DynamicBackground;
