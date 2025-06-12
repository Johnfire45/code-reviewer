import React, { useState } from 'react';
import type { SectionId } from './types';
import { detectLanguageFromContent, detectLanguageFromFileName } from '../utils/languageDetector';
import AnalysisResults from './AnalysisResults';
import styles from '../styles/Analyzer.module.css';

interface AnalyzerProps {
  activeSection: SectionId;
  onSectionChange: (sectionId: SectionId) => void;
}

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3001';

const Analyzer: React.FC<AnalyzerProps> = ({ activeSection, onSectionChange }) => {
  const [code, setCode] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [results, setResults] = useState<any>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Handle responsive layout
  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      alert('Please enter some code to analyze!');
      return;
    }
    setIsAnalyzing(true);
    setResults(null);
    try {
      const response = await fetch(`${API_URL}/api/code-review/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to analyze code');
      }
      const data = await response.json();
      
      // Transform API response to match expected frontend format
      const transformedData = {
        summary: {
          totalIssues: data.summary.totalIssues,
          critical: data.summary.criticalIssues,
          high: data.summary.highIssues,
          medium: data.summary.mediumIssues,
          low: data.summary.lowIssues
        },
        issues: data.vulnerabilities.map((vuln: any, index: number) => ({
          id: index + 1,
          severity: vuln.severity,
          type: vuln.name || vuln.id,
          line: vuln.locations?.[0]?.line || 0,
          description: vuln.description,
          recommendation: vuln.recommendation,
          code: vuln.locations?.[0]?.snippet || ''
        }))
      };
      
      setResults(transformedData);
      setAnalysisResults(transformedData);
      
      // Navigate to results page with data
      // Store results in a way that can be accessed by ResultsPage
      (window as any).analysisData = {
        results: transformedData,
        language: language,
        codeSnippet: code.substring(0, 200) + (code.length > 200 ? '...' : '')
      };
      
      // Navigate to results section
      onSectionChange('results');
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
        
        // Detect language from file extension and content
        const detectedLang = detectLanguageFromFileName(file.name);
        setLanguage(detectedLang);
        setDetectedLanguage(detectedLang);
      };
      reader.readAsText(file);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    
    // Only detect language if we have enough code to analyze (at least 20 chars)
    if (newCode && newCode.trim().length > 20) {
      const detectedLang = detectLanguageFromContent(newCode);
      setDetectedLanguage(detectedLang);
      // Auto-select the detected language
      setLanguage(detectedLang);
    }
  };

  const handleBrowseClick = () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  };

  return (
    <div 
      id="analyzer"
      className={styles.analyzerContainer}
      style={{ 
        display: activeSection === 'analyzer' ? 'block' : 'none'
      }}>

      {/* Main Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.mainCard}>
          {/* Main Layout Container */}
          <div className={styles.layoutContainer}>
            
            {/* LEFT SIDE - Drag & Drop Area */}
            <div className={styles.leftSection}>
              <div className={styles.dragDropBox}>
                {/* Hidden File Input */}
                <input
                  id="fileInput"
                  type="file"
                  accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.php,.c,.cs,.rb,.go,.rs,.swift,.kt,.scala,.clj,.hs,.ml,.fs,.vb,.pl,.sh,.sql,.html,.css,.json,.xml,.yaml,.yml"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                
                <div className={styles.dragDropIcon}>📁</div>
                
                <h3 className={styles.dragDropTitle}>
                  Drag & Drop Code Files
                </h3>
                
                <p className={styles.dragDropSubtitle}>
                  or click the button below to browse
                </p>
                
                {/* Upload Button */}
                <button
                  onClick={handleBrowseClick}
                  className={styles.chooseFileButton}
                >
                  📂 Choose File
                </button>
                
                {/* File Type Badges */}
                <div className={styles.fileTypeBadges}>
                  {['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.php'].map((ext) => (
                    <span key={ext} className={styles.fileTypeBadge}>
                      {ext}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Code Input */}
            <div className={styles.rightSection}>
              <div className={styles.codeInputSection}>
                <h3 className={styles.sectionTitle}>
                  Or paste your code here:
                </h3>
                
                <textarea
                  className={styles.codeTextarea}
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="// Paste your code here for security analysis...
function login(username, password) {
  const query = 'SELECT * FROM users WHERE username = ' + username;
  // This is vulnerable to SQL injection!
}"
                />

                {/* Language Selector */}
                <div className={styles.languageSelector}>
                  <div className={styles.languageRow}>
                    <label htmlFor="language-select" className={styles.languageLabel}>
                      Language:
                    </label>
                    <select
                      id="language-select"
                      value={language}
                      onChange={e => setLanguage(e.target.value)}
                      className={styles.languageSelect}
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="php">PHP</option>
                      <option value="java">Java</option>
                      <option value="typescript">TypeScript</option>
                      <option value="cpp">C++</option>
                      <option value="c">C</option>
                      <option value="ruby">Ruby</option>
                      <option value="go">Go</option>
                    </select>
                    {detectedLanguage && (
                      <span className={styles.detectedLanguage}>
                        Detected: {detectedLanguage.charAt(0).toUpperCase() + detectedLanguage.slice(1)}
                      </span>
                    )}
                  </div>
                  <div className={styles.languageNote}>
                    ⚠️ Language detection is heuristic and may be inaccurate for short code snippets. Manually select the correct language if needed.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analyze Button - Centered below both sections */}
          <div className={styles.analyzeButtonContainer}>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={styles.analyzeButton}
            >
              {isAnalyzing ? (
                <>
                  <div className={styles.loadingSpinner} />
                  Analyzing Security...
                </>
              ) : (
                <>
                  🔍 Analyze Code Security
                </>
              )}
            </button>
          </div>

          {/* Results Display - Fallback (should navigate to results page instead) */}
          {results && activeSection === 'analyzer' && (
            <div style={{ marginTop: 30, background: 'rgba(255, 255, 255, 0.95)', borderRadius: 16, padding: 30, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <AnalysisResults results={results} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analyzer; 