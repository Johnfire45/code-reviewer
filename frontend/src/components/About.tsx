import React from 'react';
import type { AboutItem, SectionId } from './types';

interface AboutProps {
  activeSection: SectionId;
}

const About: React.FC<AboutProps> = ({ activeSection }) => {
  const aboutItems: AboutItem[] = [
    {
      title: 'Developer',
      name: 'Harshit Shah',
      role: 'Ethical Hacker & Security Engineer',
      description: 'Cybersecurity professional with expertise in penetration testing and secure code analysis.',
      link: 'https://johnfire45.github.io'
    },
    {
      title: 'Technology',
      name: 'React + TypeScript',
      role: 'Modern Frontend Stack',
      description: 'Built with cutting-edge web technologies for optimal performance and user experience.',
      link: '#'
    },
    {
      title: 'Mission',
      name: 'Secure Development',
      role: 'Making Security Accessible',
      description: 'Democratizing security analysis tools for developers of all skill levels.',
      link: '#'
    }
  ];

  return (
    <div 
      id="about"
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
        display: activeSection === 'about' ? 'block' : 'none'
      }}>
      {/* About Section */}
      <div 
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '60px 40px',
          background: 'rgba(255, 255, 254, 0.95)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          opacity: 1,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'auto',
          willChange: 'opacity'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '900',
            color: '#2d3748',
            margin: '0 0 20px 0',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            About SecureCode AI
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#718096',
            lineHeight: '1.8',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Advanced AI-powered security analysis tool designed by cybersecurity professionals. 
            Bringing enterprise-grade vulnerability detection to developers worldwide.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          marginTop: '40px'
        }}>
          {aboutItems.map((item, index) => (
            <div key={index} style={{
              padding: '30px',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '16px',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLDivElement;
              target.style.transform = 'translateY(-5px)';
              target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.2)';
              target.style.background = 'rgba(255, 255, 255, 1)';
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLDivElement;
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = 'none';
              target.style.background = 'rgba(255, 255, 255, 0.8)';
            }}
            >
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#667eea',
                margin: '0 0 8px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {item.title}
              </h4>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#2d3748',
                margin: '0 0 8px 0'
              }}>
                {item.name}
              </h3>
              <p style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#667eea',
                margin: '0 0 12px 0'
              }}>
                {item.role}
              </p>
              <p style={{
                fontSize: '14px',
                color: '#718096',
                lineHeight: '1.6',
                margin: 0
              }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About; 