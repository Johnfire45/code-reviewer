import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ParticleBackground from './components/ParticleBackground';
import Home from './components/Home';
import Analyzer from './components/Analyzer';
import Features from './components/Features';
import About from './components/About';
import ResultsPage from './components/ResultsPage';
import type { Particle, SectionId } from './components/types';

function App() {
  const [code, setCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  // Removed isHeaderVisible state - header is now always visible

  // Create floating particles effect
  useEffect(() => {
    const createParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 15; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.3 + 0.1
        });
      }
      setParticles(newParticles);
    };
    createParticles();

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Handle hash changes for URL navigation
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      setActiveSection(hash as SectionId);
    };
    
    // Initial hash handling
    handleHashChange();
    
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [activeSection]);

  // Switch to section
  const scrollToSection = (sectionId: SectionId) => {
    // Update URL hash
    window.location.hash = sectionId;
    setActiveSection(sectionId);
  };

  const handleAnalyze = () => {
    if (!code.trim()) {
      alert('Please enter some code to analyze!');
      return;
    }
    
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      alert('🔍 Analysis Complete!\n\n✅ Found 3 potential security issues:\n• SQL Injection vulnerability\n• Missing input validation\n• Weak password handling\n\n(This is a demo - real analysis coming soon!)');
    }, 2000);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
      };
      reader.readAsText(file);
    }
  };

  const handleBrowseClick = () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  };

  return (
    <div style={{ margin: 0, padding: 0, position: 'relative', overflow: 'hidden' }}>
      {/* Animated Background Particles */}
      <ParticleBackground particles={particles} />

      {/* Header with navigation - Always visible */}
      <Header 
        activeSection={activeSection} 
        onSectionChange={scrollToSection} 
      />

      {/* MAIN CONTENT SECTIONS */}
      <Home 
        activeSection={activeSection} 
        onSectionChange={scrollToSection} 
      />
      
      <Analyzer 
        activeSection={activeSection}
        onSectionChange={scrollToSection}
      />

      <ResultsPage 
        activeSection={activeSection}
        onSectionChange={scrollToSection}
      />
      
      <Features 
        activeSection={activeSection} 
      />
      
      <About 
        activeSection={activeSection} 
      />

      {/* CSS Animations */}
      <style>{`
        /* Performance optimizations */
        * {
          box-sizing: border-box;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        /* Faster, smoother transitions */
        .section-transition {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: opacity, transform;
        }
        
        /* Optimized animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes textGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes buttonGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes revealContent {
          0% {
            opacity: 0;
            transform: translateY(100px) scale(0.8);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
        
        @keyframes heroGlow {
          0% { box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 30px 80px rgba(102, 126, 234, 0.4); }
          100% { box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        }
        
        /* Smooth hash navigation */
        :target {
          scroll-margin-top: 0;
        }
        
        /* Section spacing for fixed header */
        #home, #analyzer, #features, #about {
          scroll-margin-top: 0;
        }
        
        /* Preload optimization */
        .preload * {
          transition: none !important;
        }
      `}</style>
    </div>
  );
}

export default App; 