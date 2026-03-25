import React, { useEffect, useRef } from 'react';
import { Button } from './UI';
import gsap from 'gsap';

const HeroSection = ({ 
  title, 
  description, 
  features = [], 
  ctaText, 
  onCtaClick, 
  illustration,
  reverse = false 
}) => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-content', { x: reverse ? 50 : -50, opacity: 0, duration: 1, ease: 'power4.out' });
      gsap.from('.hero-illustration', { x: reverse ? -50 : 50, opacity: 0, duration: 1, ease: 'power4.out' });
      gsap.from('.feature-item', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, delay: 0.3, ease: 'power2.out' });
    }, sectionRef);
    return () => ctx.revert();
  }, [reverse]);

  return (
    <section ref={sectionRef} className="py-20 px-6 overflow-hidden">
      <div className={`max-w-7xl mx-auto flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}>
        
        {/* Text Content */}
        <div className="hero-content flex-1 space-y-8 text-left">
          <h1 className="text-5xl lg:text-6xl font-black text-slate-800 leading-[1.1] tracking-tight">
            {title}
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl leading-relaxed">
            {description}
          </p>
          
          {features.length > 0 && (
            <div className="space-y-6 pt-4">
              {features.map((feature, index) => (
                <div key={index} className="feature-item flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-700 leading-tight">{feature.title}</h4>
                    <p className="text-sm text-slate-500 font-medium mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-6">
            <Button size="lg" onClick={onCtaClick} className="shadow-xl">
              {ctaText}
            </Button>
          </div>
        </div>

        {/* Illustration */}
        <div className="hero-illustration flex-1 w-full flex justify-center items-center">
          {illustration ? (
            <div className="relative w-full max-w-xl aspect-square flex items-center justify-center">
              {illustration}
            </div>
          ) : (
            <div className="w-full max-w-lg aspect-square bg-gradient-to-br from-primary/5 to-primary/20 rounded-[40px] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 border-4 border-primary rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border-4 border-primary rounded-full" />
              </div>
              <p className="text-primary/40 font-black text-2xl uppercase tracking-[0.2em]">Illustration</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
