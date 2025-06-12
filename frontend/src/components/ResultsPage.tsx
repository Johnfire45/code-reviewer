import React, { useEffect, useState } from 'react';
import AnalysisResults from './AnalysisResults';
import type { SectionId } from './types';

interface ResultsPageProps {
  activeSection: SectionId;
  onSectionChange: (sectionId: SectionId) => void;
}

interface AnalysisData {
  results: {
    summary: {
      totalIssues: number;
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    issues: Array<{
      id: number;
      severity: 'critical' | 'high' | 'medium' | 'low';
      type: string;
      line: number;
      description: string;
      recommendation: string;
      code: string;
    }>;
  };
  language: string;
  codeSnippet?: string;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ activeSection, onSectionChange }) => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  useEffect(() => {
    // Get analysis data from window object
    const data = (window as any).analysisData;
    if (data) {
      setAnalysisData(data);
    }
  }, [activeSection]);

  const handleBackToAnalyzer = () => {
    // Navigate back to analyzer and clear any previous state
    onSectionChange('analyzer');
    // Clear the analysis data
    (window as any).analysisData = null;
  };

  // If no data provided, show error message
  if (!analysisData || !analysisData.results) {
    return (
      <div 
        id="results"
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 8s ease infinite',
          minHeight: '100vh',
          width: '100%',
          padding: '20px',
          paddingTop: '96px', // Account for fixed header
          paddingBottom: '40px',
          display: activeSection === 'results' ? 'block' : 'none'
        }}>
        <div style={{ 
          maxWidth: '900px', 
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '60px 40px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>⚠️</div>
            <h2 style={{ 
              color: '#2d3748', 
              marginBottom: '20px',
              fontSize: '28px',
              fontWeight: '700'
            }}>
              No Analysis Data Found
            </h2>
            <p style={{ 
              color: '#718096', 
              marginBottom: '30px',
              fontSize: '18px',
              lineHeight: '1.6'
            }}>
              It looks like you navigated here directly without running an analysis first.
            </p>
            <button
              onClick={handleBackToAnalyzer}
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
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(-3px) scale(1.05)';
                target.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(0) scale(1)';
                target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
              }}
            >
              🔍 Go to Code Analyzer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="results"
      style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 8s ease infinite',
        minHeight: '100vh',
        width: '100%',
        paddingTop: '76px', // Account for global navbar
        display: activeSection === 'results' ? 'block' : 'none'
      }}>
      
      {/* Sticky Sub-Header */}
      <div style={{
        position: 'sticky',
        top: '76px', // Position below global navbar
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        padding: '16px 20px',
        width: '100%'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px'
        }}>
          {/* Back Button - Left */}
          <button
            onClick={handleBackToAnalyzer}
            style={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(-1px) scale(1.03)';
              target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(0) scale(1)';
              target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }}
          >
            ← Back to Analyzer
          </button>

          {/* Page Title - Right */}
          <h1 style={{ 
            color: '#2d3748', 
            margin: 0,
            fontSize: '20px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🛡️ Security Analysis Results
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        padding: '20px',
        paddingBottom: '40px'
      }}>
        {/* Analysis Info Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '20px 30px',
          marginBottom: '20px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            📝 Language: {analysisData.language.charAt(0).toUpperCase() + analysisData.language.slice(1)}
          </div>
          <div style={{
            color: '#718096',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Analysis completed • {new Date().toLocaleString()}
          </div>
        </div>

        {/* Results Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}>
          <AnalysisResults results={analysisData.results} />
        </div>
      </div>
    </div>
  );
};

export default ResultsPage; 