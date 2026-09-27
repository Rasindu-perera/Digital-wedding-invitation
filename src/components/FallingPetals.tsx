'use client';

import { useEffect, useState } from 'react';

type Petal = {
  id: number;
  left: string;
  animationDuration: string;
  animationDelay: string;
  opacity: number;
  scale: number;
};

export default function FallingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Generate petals only on client-side to avoid hydration mismatches
    const newPetals = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      animationDuration: `${Math.random() * 10 + 10}s`, // 10s to 20s
      animationDelay: `-${Math.random() * 20}s`, // Start at different times
      opacity: Math.random() * 0.5 + 0.3, // 0.3 to 0.8
      scale: Math.random() * 0.6 + 0.4, // 0.4 to 1.0
    }));
    setPetals(newPetals);
  }, []);

  if (petals.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg) rotateX(0deg);
          }
          100% {
            transform: translateY(110vh) rotate(360deg) rotateX(360deg);
          }
        }
        .petal {
          position: absolute;
          top: -10vh;
          width: 15px;
          height: 15px;
          background: #fff;
          border-radius: 15px 0 15px 0;
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
          animation-name: fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal"
          style={{
            left: petal.left,
            animationDuration: petal.animationDuration,
            animationDelay: petal.animationDelay,
            opacity: petal.opacity,
            transform: `scale(${petal.scale})`,
          }}
        />
      ))}
    </div>
  );
}
