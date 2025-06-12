import React, { useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  CloudUpload,
  Code,
  Security,
  BugReport,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import CodeDisplay from './CodeDisplay';
import AnalysisResults from './AnalysisResults';
import { detectLanguageFromContent, detectLanguageFromFileName } from '../utils/languageDetector';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const CodeReviewer: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/plain': ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.php', '.rb', '.go'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setCode(content);
          
          // Detect language from file extension
          const detectedLang = detectLanguageFromFileName(file.name);
          setLanguage(detectedLang);
          setDetectedLanguage(detectedLang);
        };
        reader.readAsText(file);
      }
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    
    // Only detect language if we have enough code to analyze (at least 20 chars)
    if (newCode && newCode.trim().length > 20) {
      const detectedLang = detectLanguageFromContent(newCode);
      setDetectedLanguage(detectedLang);
      // Auto-select the detected language if it's different
      if (detectedLang !== language) {
        setLanguage(detectedLang);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please provide code to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setAnalysisResults(null);

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
      
      setAnalysisResults(transformedData);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze code. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={3}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="code input tabs">
          <Tab icon={<CloudUpload />} label="Upload File" />
          <Tab icon={<Code />} label="Paste Code" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.300',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: isDragActive ? 'action.hover' : 'background.paper',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
          >
            <input {...getInputProps()} />
            <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {isDragActive ? 'Drop your code file here' : 'Drag & drop a code file here'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or click to select a file
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Supported: .js, .jsx, .ts, .tsx, .py, .java, .cpp, .c, .php, .rb, .go
            </Typography>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={language}
                  label="Language"
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <MenuItem value="javascript">JavaScript</MenuItem>
                  <MenuItem value="typescript">TypeScript</MenuItem>
                  <MenuItem value="python">Python</MenuItem>
                  <MenuItem value="java">Java</MenuItem>
                  <MenuItem value="cpp">C++</MenuItem>
                  <MenuItem value="c">C</MenuItem>
                  <MenuItem value="php">PHP</MenuItem>
                  <MenuItem value="ruby">Ruby</MenuItem>
                  <MenuItem value="go">Go</MenuItem>
                </Select>
                {detectedLanguage && (
                  <Typography variant="caption" sx={{ mt: 0.5, display: 'inline-block', color: 'text.secondary' }}>
                    Detected: {detectedLanguage.charAt(0).toUpperCase() + detectedLanguage.slice(1)}
                  </Typography>
                )}
                <Typography variant="caption" sx={{ mt: 0.75, display: 'block', color: 'text.secondary', fontSize: '12px' }}>
                  ⚠️ Language detection is heuristic and may be inaccurate for short code snippets. Manually select the correct language if needed.
                </Typography>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={15}
                variant="outlined"
                label="Paste your code here"
                value={code}
                onChange={handleCodeChange}
                sx={{
                  '& .MuiInputBase-input': {
                    fontFamily: 'monospace',
                    fontSize: '14px',
                  },
                }}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={isAnalyzing ? <CircularProgress size={20} /> : <Security />}
              onClick={handleAnalyze}
              disabled={isAnalyzing || !code.trim()}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
            </Button>
            
            {code && (
              <Chip
                label={`${language.toUpperCase()} • ${code.split('\n').length} lines`}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Paper>

      {code && (
        <Box sx={{ mt: 3 }}>
          <CodeDisplay code={code} language={language} />
        </Box>
      )}

      {analysisResults && (
        <Box sx={{ mt: 3 }}>
          <AnalysisResults results={analysisResults} />
        </Box>
      )}
    </Box>
  );
};

export default CodeReviewer; 