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

const CodeReviewer: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState('');

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
          // Auto-detect language from file extension
          const extension = file.name.split('.').pop()?.toLowerCase();
          const languageMap: { [key: string]: string } = {
            'js': 'javascript',
            'jsx': 'javascript',
            'ts': 'typescript',
            'tsx': 'typescript',
            'py': 'python',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c',
            'php': 'php',
            'rb': 'ruby',
            'go': 'go',
          };
          if (extension && languageMap[extension]) {
            setLanguage(languageMap[extension]);
          }
        };
        reader.readAsText(file);
      }
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
      // TODO: Replace with actual API call
      // Simulating API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis results
      const mockResults = {
        summary: {
          totalIssues: 3,
          critical: 1,
          high: 1,
          medium: 1,
          low: 0,
        },
        issues: [
          {
            id: 1,
            severity: 'critical',
            type: 'SQL Injection',
            line: 15,
            description: 'Potential SQL injection vulnerability detected',
            recommendation: 'Use parameterized queries or prepared statements',
            code: 'SELECT * FROM users WHERE id = " + userId',
          },
          {
            id: 2,
            severity: 'high',
            type: 'XSS',
            line: 23,
            description: 'Potential Cross-Site Scripting vulnerability',
            recommendation: 'Sanitize user input before rendering',
            code: 'innerHTML = userInput',
          },
          {
            id: 3,
            severity: 'medium',
            type: 'Weak Encryption',
            line: 8,
            description: 'Using deprecated encryption method',
            recommendation: 'Use AES-256 or other modern encryption standards',
            code: 'crypto.createCipher("des", key)',
          },
        ],
      };

      setAnalysisResults(mockResults);
    } catch (err) {
      setError('Failed to analyze code. Please try again.');
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
                onChange={(e) => setCode(e.target.value)}
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