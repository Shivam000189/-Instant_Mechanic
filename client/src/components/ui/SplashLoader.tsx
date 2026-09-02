import { useState, useEffect } from 'react';

const NUM_SLICES = 6;

export function SplashLoader() {
  const [show, setShow] = useState(true);
  const [linesVisible, setLinesVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 1. After the name and badge finish their entrance animation (~1.4s), reveal the vertical slice lines
    const linesTimer = setTimeout(() => {
      setLinesVisible(true);
    }, 1400);

    // 2. Start the slice curtain slide-up sequence after the lines have appeared (2.1s)
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2100);

    // 3. Completely unmount after all slices have slid up off-screen
    const removeTimer = setTimeout(() => {
      setShow(false);
    }, 3500);

    return () => {
      clearTimeout(linesTimer);
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden select-none"
      style={{ perspective: '1200px' }}
    >
      {/* 6 Vertical Slices that shoot upwards */}
      <div className="absolute inset-0 grid grid-cols-6 h-full w-full">
        {Array.from({ length: NUM_SLICES }).map((_, index) => (
          <div
            key={index}
            className="relative h-full w-full bg-white will-change-transform shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)]"
            style={{
              transitionProperty: 'transform',
              transitionDuration: '950ms',
              transitionTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)',
              transitionDelay: isExiting ? `${index * 60}ms` : '0ms',
              transform: isExiting ? 'translate3d(0, -100%, 0)' : 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Vertical dividing line that slices/draws down after the name appears */}
            {index < NUM_SLICES - 1 && (
              <div
                className="absolute top-0 right-0 w-[1px] h-full bg-neutral-900/[0.08] origin-top will-change-transform"
                style={{
                  transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease',
                  transitionDelay: `${index * 45}ms`,
                  transform: linesVisible ? 'scaleY(1)' : 'scaleY(0)',
                  opacity: linesVisible ? 1 : 0,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Brand & Content Overlay in center */}
      <div
        className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 will-change-transform"
        style={{
          transition: 'opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1), transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), filter 0.55s ease',
          opacity: isExiting ? 0 : 1,
          transform: isExiting ? 'translate3d(0, -28px, 0)' : 'translate3d(0, 0, 0)',
          filter: isExiting ? 'blur(6px)' : 'blur(0px)',
        }}
      >
        <div
          className="text-[clamp(2.6rem,7vw,5.5rem)] font-black tracking-[-0.03em] text-[#0a0a0a] opacity-0 translate-y-8 animate-loader-fade-up text-center drop-shadow-sm"
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          Instant Mechanic<sup className="text-[0.4em] align-super font-bold ml-1 text-primary">™</sup>
        </div>
        <div
          className="text-[clamp(0.9rem,2vw,1.1rem)] text-[#6b7280] font-medium mt-3.5 opacity-0 translate-y-4 animate-loader-fade-up flex items-center gap-2"
          style={{ animationDelay: '0.45s', animationFillMode: 'forwards' }}
        >
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          Live Vehicle Service Operations
        </div>
      </div>

      <style>{`
        @keyframes loaderFadeUp {
          0% {
            opacity: 0;
            transform: translate3d(0, 24px, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        .animate-loader-fade-up {
          animation: loaderFadeUp 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
