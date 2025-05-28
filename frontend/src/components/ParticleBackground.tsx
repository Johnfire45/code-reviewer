import React from 'react';
import type { Particle } from './types';

interface ParticleBackgroundProps {
  particles: Particle[];
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ particles }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 1
    }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            opacity: particle.opacity,
            animation: `float ${4 + Math.random() * 3}s ease-in-out infinite alternate`
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground; 