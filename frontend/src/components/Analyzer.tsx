import React, { useState } from 'react';
import type { SectionId } from './types';

interface AnalyzerProps {
  activeSection: SectionId;
}

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3001';

const Analyzer: React.FC<AnalyzerProps> = ({ activeSection }) => {
  const [code, setCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      alert('Please enter some code to analyze!');
      return;
    }
    setIsAnalyzing(true);
    try {
      const response = await fetch(`${API_URL}/api/code-review/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: 'javascript' }), // or allow user to select language
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to analyze code');
      }
      const data = await response.json();
      // Display results (replace alert with UI update as needed)
      alert('Analysis Complete!\n' + JSON.stringify(data, null, 2));
    } catch (err: any) {
      alert(err.message || 'Failed to analyze code. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
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
    <div 
      id="analyzer"
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
        display: activeSection === 'analyzer' ? 'block' : 'none'
      }}>
      {/* Upload Section */}
      <div 
        style={{ 
          maxWidth: '900px', 
          margin: '0 auto',
          opacity: 1,
          visibility: 'visible',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
          pointerEvents: 'auto',
          willChange: 'opacity'
        }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          const target = e.currentTarget as HTMLDivElement;
          target.style.transform = 'translateY(-5px)';
          target.style.boxShadow = '0 30px 80px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget as HTMLDivElement;
          target.style.transform = 'translateY(0)';
          target.style.boxShadow = '0 20px 60px rgba(0,0,0,0.15)';
        }}
        >
          {/* Drag & Drop Area */}
          <div style={{
            border: '3px dashed #e1e5e9',
            borderRadius: '20px',
            padding: '50px 40px',
            textAlign: 'center',
            background: '#f8fafc',
            transition: 'all 0.3s ease',
            cursor: 'default',
            position: 'relative',
            overflow: 'visible',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget as HTMLDivElement;
            target.style.borderColor = '#667eea';
            target.style.background = 'linear-gradient(45deg, #f8fafc, #e6f3ff)';
            target.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget as HTMLDivElement;
            target.style.borderColor = '#e1e5e9';
            target.style.background = '#f8fafc';
            target.style.transform = 'scale(1)';
          }}
          >
            {/* Hidden File Input */}
            <input
              id="fileInput"
              type="file"
              accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.php,.c,.cs,.rb,.go,.rs,.swift,.kt,.scala,.clj,.hs,.ml,.fs,.vb,.pl,.sh,.sql,.html,.css,.json,.xml,.yaml,.yml"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            
            <div style={{ 
              fontSize: '60px', 
              marginBottom: '20px',
              animation: 'bounce 2s ease infinite'
            }}>📁</div>
            
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#2d3748',
              margin: '0 0 10px 0'
            }}>
              Drag & Drop Code Files
            </h3>
            
            <p style={{
              fontSize: '16px',
              color: '#718096',
              margin: '0 0 25px 0'
            }}>
              or click the button below to browse
            </p>
            
            {/* Upload Button - More Prominent */}
            <button
              onClick={handleBrowseClick}
              style={{
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '18px 40px',
                borderRadius: '30px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                marginBottom: '25px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                zIndex: 10,
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(-3px) scale(1.08)';
                target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(0) scale(1)';
                target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
              }}
            >
              📂 Choose File
            </button>
            
            {/* File Type Badges */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px',
              maxWidth: '400px'
            }}>
              {['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.php'].map((ext) => (
                <span key={ext} style={{
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                  transition: 'transform 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLSpanElement;
                  target.style.transform = 'translateY(-1px) scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLSpanElement;
                  target.style.transform = 'translateY(0) scale(1)';
                }}
                >
                  {ext}
                </span>
              ))}
            </div>
          </div>

          {/* Code Input */}
          <div style={{ marginTop: '40px' }}>
            <label style={{
              display: 'block',
              fontSize: '20px',
              fontWeight: '700',
              color: '#2d3748',
              marginBottom: '20px'
            }}>
              Or paste your code here:
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste your code here for security analysis...\nfunction login(username, password) {\n  const query = 'SELECT * FROM users WHERE username = ' + username;\n  // This is vulnerable to SQL injection!\n}"
              style={{
                width: '100%',
                height: '350px',
                padding: '25px',
                border: '3px solid #e2e8f0',
                borderRadius: '16px',
                fontSize: '15px',
                fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
                lineHeight: '1.7',
                resize: 'vertical',
                outline: 'none',
                transition: 'all 0.3s ease',
                background: '#f8fafc',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                color: '#222',
                fontWeight: 500,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.2)';
                e.target.style.transform = 'scale(1.01)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
                e.target.style.transform = 'scale(1)';
              }}
            />
          </div>

          {/* Analyze Button */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              style={{
                background: isAnalyzing 
                  ? 'linear-gradient(45deg, #a0aec0, #718096)' 
                  : 'linear-gradient(45deg, #667eea, #764ba2, #667eea)',
                backgroundSize: '200% 200%',
                animation: isAnalyzing ? 'none' : 'buttonGradient 3s ease infinite',
                color: 'white',
                border: 'none',
                padding: '20px 50px',
                borderRadius: '50px',
                fontSize: '20px',
                fontWeight: '700',
                cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '0 auto',
                transform: 'translateY(0)',
                opacity: isAnalyzing ? 0.8 : 1
              }}
              onMouseEnter={(e) => {
                if (!isAnalyzing) {
                  const target = e.target as HTMLButtonElement;
                  target.style.transform = 'translateY(-3px) scale(1.05)';
                  target.style.boxShadow = '0 15px 50px rgba(102, 126, 234, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(0) scale(1)';
                target.style.boxShadow = '0 10px 40px rgba(102, 126, 234, 0.4)';
              }}
            >
              {isAnalyzing ? (
                <>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '3px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Analyzing Security...
                </>
              ) : (
                <>
                  🔍 Analyze Code Security
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyzer; 