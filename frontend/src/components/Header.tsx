import React from 'react';
import type { NavigationItem, SectionId } from './types';

interface HeaderProps {
  activeSection: SectionId;
  onSectionChange: (sectionId: SectionId) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onSectionChange }) => {
  const navigationItems: NavigationItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'analyzer', label: 'Analyzer' },
    { id: 'features', label: 'Features' },
    { id: 'about', label: 'About' }
  ];

  return (
    <div 
      data-header="true"
      style={{
        background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95), rgba(30, 30, 30, 0.95))',
        backdropFilter: 'blur(20px)',
        color: 'white',
        padding: '16px 30px',
        fontSize: '18px',
        fontWeight: '700',
        textAlign: 'center',
        border: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        width: '100%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        letterSpacing: '0.5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        // Always visible - no auto-hide behavior
      }}>
      {/* Brand */}
      <div style={{ flex: 1, textAlign: 'left' }}>
        <span style={{
          background: 'linear-gradient(45deg, #ffd89b, #19547b, #764ba2)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'textGradient 3s ease infinite',
          fontWeight: '800',
          fontSize: '20px'
        }}>
          🔒 SECURECODE AI
        </span>
      </div>

      {/* Navigation Links */}
      <nav style={{ 
        display: 'flex', 
        gap: '30px', 
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
      }}>
        {navigationItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              onSectionChange(item.id as SectionId);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: activeSection === item.id ? '#ffd89b' : '#e2e8f0',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: '20px',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              textDecoration: 'none',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLAnchorElement;
              target.style.color = '#ffd89b';
              target.style.background = 'rgba(255, 216, 155, 0.1)';
              target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLAnchorElement;
              target.style.color = activeSection === item.id ? '#ffd89b' : '#e2e8f0';
              target.style.background = 'none';
              target.style.transform = 'translateY(0)';
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Contact Info */}
      <div style={{ 
        flex: 1, 
        textAlign: 'right',
        fontSize: '14px',
        color: '#e2e8f0'
      }}>
        Security Analysis Tool
      </div>
    </div>
  );
};

export default Header; 