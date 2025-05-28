import React from 'react';
import type { SectionId } from './types';

interface FeaturesProps {
  activeSection: SectionId;
}

const Features: React.FC<FeaturesProps> = ({ activeSection }) => {
  const features = [
    { icon: '🛡️', title: 'Vulnerability Detection', desc: 'Detect SQL injection, XSS, and other security flaws' },
    { icon: '⚡', title: 'Instant Analysis', desc: 'Get results in seconds with AI-powered scanning' },
    { icon: '📊', title: 'Detailed Reports', desc: 'Comprehensive security reports with recommendations' }
  ];

  return (
    <div 
      id="features"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 8s ease infinite',
        height: 'calc(100vh - 76px)',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        padding: '20px',
        paddingTop: '76px',
        overflowY: 'auto',
        zIndex: 2,
        display: activeSection === 'features' ? 'block' : 'none'
      }}>
      {/* Features Title */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{
          fontSize: '48px',
          fontWeight: '900',
          color: 'white',
          margin: '0 0 20px 0'
        }}>
          <span style={{
            background: 'linear-gradient(45deg, #ffd89b, #19547b, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Features
          </span>
        </h2>
        <p style={{
          fontSize: '20px',
          color: '#e2e8f0',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Powerful security analysis tools at your fingertips
        </p>
      </div>
      
      {/* Features Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
          opacity: 1,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'auto',
          willChange: 'opacity'
        }}>
        {features.map((feature, index) => (
          <div key={index} style={{
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '30px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget as HTMLDivElement;
            target.style.transform = 'translateY(-10px) scale(1.05)';
            target.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.2)';
            target.style.background = 'rgba(255, 255, 255, 1)';
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget as HTMLDivElement;
            target.style.transform = 'translateY(0) scale(1)';
            target.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.12)';
            target.style.background = 'rgba(255, 255, 255, 0.95)';
          }}
          >
            <div style={{ 
              fontSize: '56px', 
              marginBottom: '20px'
            }}>{feature.icon}</div>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3748', margin: '0 0 15px 0' }}>
              {feature.title}
            </h3>
            <p style={{ fontSize: '18px', color: '#718096', margin: 0, lineHeight: '1.6' }}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features; 