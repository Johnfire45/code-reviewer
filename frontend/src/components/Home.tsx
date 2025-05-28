import React, { useState } from 'react';
import type { StatisticItem, FeatureItem, SectionId } from './types';

interface HomeProps {
  activeSection: SectionId;
  onSectionChange: (sectionId: SectionId) => void;
}

const Home: React.FC<HomeProps> = ({ activeSection, onSectionChange }) => {
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  const statistics: StatisticItem[] = [
    { number: '10,000+', label: 'Vulnerabilities Detected', icon: '🛡️' },
    { number: '500+', label: 'Projects Secured', icon: '🔒' },
    { number: '99.9%', label: 'Accuracy Rate', icon: '🎯' },
    { number: '<2s', label: 'Analysis Time', icon: '⚡' },
    { number: '50+', label: 'Vulnerability Types', icon: '🔍' },
    { number: '24/7', label: 'Monitoring Available', icon: '👁️' }
  ];

  const features: FeatureItem[] = [
    {
      icon: '🤖',
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning algorithms identify complex security patterns and vulnerabilities.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Get comprehensive security analysis results in under 2 seconds for most codebases.'
    },
    {
      icon: '🔍',
      title: 'Deep Analysis',
      description: 'Scans for SQL injection, XSS, authentication flaws, and 50+ other vulnerability types.'
    },
    {
      icon: '📊',
      title: 'Detailed Reports',
      description: 'Generate comprehensive security reports with actionable recommendations and fix suggestions.'
    },
    {
      icon: '🔧',
      title: 'Auto-Fix Suggestions',
      description: 'Get intelligent code suggestions and automated fixes for common security vulnerabilities.'
    },
    {
      icon: '🌐',
      title: 'Multi-Language Support',
      description: 'Supports JavaScript, Python, Java, C++, PHP, and 15+ other programming languages.'
    }
  ];

  return (
    <div 
      id="home"
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
        display: activeSection === 'home' ? 'block' : 'none'
      }}>
      {/* Hero Section */}
      <div 
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
        style={{ 
          textAlign: 'center',
          color: 'white',
          padding: '60px 40px',
          background: 'rgba(20, 20, 20, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto 40px auto',
          zIndex: 999,
          opacity: 1,
          visibility: 'visible',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          willChange: 'opacity'
        }}>
        <h1 style={{
          fontSize: '56px',
          fontWeight: '900',
          margin: '0 0 20px 0',
          color: 'white', 
          lineHeight: '1.1'
        }}>
          <span style={{
            background: 'linear-gradient(45deg, #ffd89b, #19547b, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '60px'
          }}>
            SecureCode AI
          </span>
          <br />
          <span style={{ fontSize: '42px' }}>
            Advanced Security Analysis
          </span>
        </h1>
        <p style={{
          fontSize: '22px',
          margin: '0 auto 40px auto',
          opacity: 0.9,
          color: '#e2e8f0',
          maxWidth: '700px',
          lineHeight: '1.6'
        }}>
          Detect vulnerabilities, prevent security breaches, and ensure your code meets enterprise-grade security standards with AI-powered analysis.
        </p>
        
        {/* Call to Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '40px'
        }}>
          <button
            onClick={() => onSectionChange('analyzer')}
            style={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              padding: '18px 40px',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(-3px) scale(1.05)';
              target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.6)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(0) scale(1)';
              target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
            }}
          >
            🚀 Start Analysis
          </button>
          
          <button
            onClick={() => onSectionChange('features')}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              padding: '16px 40px',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = 'rgba(255, 255, 255, 0.2)';
              target.style.transform = 'translateY(-3px) scale(1.05)';
              target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.background = 'rgba(255, 255, 255, 0.1)';
              target.style.transform = 'translateY(0) scale(1)';
              target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
          >
            ⚡ View Features
          </button>
        </div>
      </div>

      {/* Statistics Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '30px',
        maxWidth: '900px',
        margin: '0 auto 40px auto',
        padding: '0 20px'
      }}>
        {statistics.map((stat, index) => (
          <div key={index} style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px 20px',
            textAlign: 'center',
            border: '2px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget as HTMLDivElement;
            target.style.transform = 'translateY(-8px) scale(1.05)';
            target.style.background = 'rgba(255, 255, 255, 1)';
            target.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.2)';
            target.style.borderColor = '#667eea';
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget as HTMLDivElement;
            target.style.transform = 'translateY(0) scale(1)';
            target.style.background = 'rgba(255, 255, 255, 0.95)';
            target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            target.style.borderColor = 'rgba(255, 255, 255, 0.8)';
          }}
          >
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>{stat.icon}</div>
            <div style={{
              fontSize: '36px',
              fontWeight: '900',
              color: '#667eea',
              marginBottom: '10px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              {stat.number}
            </div>
            <div style={{
              fontSize: '15px',
              color: '#4a5568',
              fontWeight: '600',
              lineHeight: '1.3'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Features Preview */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: 'white',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          Why Choose SecureCode AI?
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '25px'
        }}>
          {features.map((feature, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '25px 20px',
              border: '2px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLDivElement;
              target.style.background = 'rgba(255, 255, 255, 1)';
              target.style.transform = 'translateY(-5px)';
              target.style.borderColor = '#667eea';
              target.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLDivElement;
              target.style.background = 'rgba(255, 255, 255, 0.9)';
              target.style.transform = 'translateY(0)';
              target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
              target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}
            >
              <div style={{ fontSize: '32px', marginBottom: '15px' }}>{feature.icon}</div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#2d3748',
                marginBottom: '12px'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#4a5568',
                lineHeight: '1.5',
                margin: 0
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 