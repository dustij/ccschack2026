import type { CSSProperties } from 'react';

interface Particle {
  top: string;
  left: string;
  size: string;
  driftDuration: string;
  twinkleDuration: string;
  flickerDuration: string;
  delay: string;
  opacity: number;
  color: string;
  glow: string;
}

const COLORS = [
  {
    color: 'var(--candy-yellow-light)',
    glow: 'rgba(255, 243, 196, 0.9)',
  },
  {
    color: 'var(--candy-pink-light)',
    glow: 'rgba(255, 179, 217, 0.88)',
  },
  {
    color: 'var(--candy-blue)',
    glow: 'rgba(96, 165, 250, 0.9)',
  },
  {
    color: 'var(--candy-mint)',
    glow: 'rgba(134, 239, 172, 0.82)',
  },
  {
    color: 'var(--candy-purple-light)',
    glow: 'rgba(233, 213, 255, 0.86)',
  },
];

const PARTICLES: Particle[] = Array.from({ length: 70 }, (_, index) => {
  const palette = COLORS[index % COLORS.length];
  const isSpark = index % 8 === 0;
  const size = isSpark
    ? 2.2 + ((index * 19) % 18) / 10
    : 0.9 + ((index * 17) % 14) / 10;

  return {
    top: `${(index * 61 + 11) % 100}%`,
    left: `${(index * 37 + 17) % 100}%`,
    size: `${size}px`,
    driftDuration: `${13 + ((index * 7) % 16)}s`,
    twinkleDuration: `${2.2 + ((index * 5) % 18) / 10}s`,
    flickerDuration: `${1.5 + ((index * 3) % 12) / 10}s`,
    delay: `-${((index * 9) % 20) / 2}s`,
    opacity: isSpark ? 0.7 : 0.45,
    color: palette.color,
    glow: palette.glow,
  };
});

export function AmbientParticles() {
  return (
    <div aria-hidden="true" className="ambient-particles">
      {PARTICLES.map((particle, index) => (
        <span
          key={`${particle.left}-${particle.top}-${index}`}
          className="ambient-particle"
          style={{
            top: particle.top,
            left: particle.left,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            animationDuration: `${particle.driftDuration}, ${particle.twinkleDuration}, ${particle.flickerDuration}`,
            animationDelay: `${particle.delay}, ${particle.delay}, ${particle.delay}`,
            '--particle-color': particle.color,
            '--particle-glow': particle.glow,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
