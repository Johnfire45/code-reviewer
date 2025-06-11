import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import { detectLanguageFromContent, detectLanguageFromFileName } from '../utils/languageDetector';

const API_URL = import.meta.env.DEV
  ? 'http://localhost:3001/api/code-review/analyze'
  : 'https://secure-code-reviewer-api.onrender.com/api/code-review/analyze';

const CodeReviewer = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [detectedLanguage, setDetectedLanguage] = useState(null);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    
    // Only detect language if we have enough code to analyze
    if (newCode && newCode.trim().length > 20) {
      const detectedLang = detectLanguageFromContent(newCode);
      setDetectedLanguage(detectedLang);
      // Auto-select the detected language
      setLanguage(detectedLang);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setCode(content);
        
        // Detect language from file name
        const detectedLang = detectLanguageFromFileName(file.name);
        setLanguage(detectedLang);
        setDetectedLanguage(detectedLang);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze code');
      }
      
      // Transform API response to match expected frontend format
      const transformedData = {
        codeQuality: calculateCodeQuality(data.summary),
        summary: {
          severity: {
            high: data.summary.criticalIssues + data.summary.highIssues,
            medium: data.summary.mediumIssues,
            low: data.summary.lowIssues,
          }
        },
        issues: data.vulnerabilities.map((vuln, index) => ({
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
    } catch (err) {
      console.error('Error analyzing code:', err);
      setError(err.message || 'An error occurred while analyzing the code');
    } finally {
      setLoading(false);
    }
  };

  // Calculate code quality score based on vulnerability summary
  const calculateCodeQuality = (summary) => {
    const criticalPenalty = summary.criticalIssues * 30;
    const highPenalty = summary.highIssues * 20;
    const mediumPenalty = summary.mediumIssues * 10;
    const lowPenalty = summary.lowIssues * 5;
    
    return Math.max(0, 100 - criticalPenalty - highPenalty - mediumPenalty - lowPenalty);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return '#d32f2f';
      case 'medium':
        return '#f57c00';
      case 'low':
        return '#388e3c';
      default:
        return '#757575';
    }
  };

  const getQualityColor = (score) => {
    if (score >= 80) return '#388e3c';
    if (score >= 60) return '#f57c00';
    return '#d32f2f';
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Secure Code Reviewer
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Analyze your code for security vulnerabilities
        </Typography>

        <Paper elevation={3}>
          <Box p={3}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="language-select-label">Language</InputLabel>
                    <Select
                      labelId="language-select-label"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      label="Language"
                    >
                      <MenuItem value="javascript">JavaScript</MenuItem>
                      <MenuItem value="python">Python</MenuItem>
                      <MenuItem value="php">PHP</MenuItem>
                      <MenuItem value="typescript">TypeScript</MenuItem>
                      <MenuItem value="java">Java</MenuItem>
                      <MenuItem value="cpp">C++</MenuItem>
                      <MenuItem value="c">C</MenuItem>
                      <MenuItem value="ruby">Ruby</MenuItem>
                      <MenuItem value="go">Go</MenuItem>
                    </Select>
                    {detectedLanguage && (
                      <Typography variant="caption" style={{ marginTop: 4, display: 'block', color: '#666' }}>
                        Detected: {detectedLanguage.charAt(0).toUpperCase() + detectedLanguage.slice(1)}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <TextField
                      label="Enter code to analyze"
                      multiline
                      rows={10}
                      variant="outlined"
                      fullWidth
                      value={code}
                      onChange={handleCodeChange}
                      placeholder={`// Enter your code here for security analysis`}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M4.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-7zM8 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
                          <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0-4 2 2 0 0 0 0 4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                        </svg>}
                      >
                        Upload File
                        <input 
                          type="file"
                          accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.php,.rb,.go"
                          hidden
                          onChange={handleFileUpload}
                        />
                      </Button>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={!code.trim() || loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Analyze Code'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Paper>

        {error && (
          <Box mt={3}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {results && (
          <Box mt={4}>
            <Paper elevation={3}>
              <Box p={3}>
                <Typography variant="h5" gutterBottom>
                  Analysis Results
                </Typography>
                
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6">
                    Code Quality Score: 
                  </Typography>
                  <Chip 
                    label={`${results.codeQuality}/100`}
                    style={{ 
                      backgroundColor: getQualityColor(results.codeQuality),
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.1rem'
                    }}
                  />
                </Box>

                <Box mb={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Summary of Issues:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Paper elevation={1} style={{ backgroundColor: '#ffebee', padding: '10px', textAlign: 'center' }}>
                        <Typography variant="h6" style={{ color: '#d32f2f' }}>
                          {results.summary.severity.high}
                        </Typography>
                        <Typography variant="body2">High Severity</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper elevation={1} style={{ backgroundColor: '#fff8e1', padding: '10px', textAlign: 'center' }}>
                        <Typography variant="h6" style={{ color: '#f57c00' }}>
                          {results.summary.severity.medium}
                        </Typography>
                        <Typography variant="body2">Medium Severity</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper elevation={1} style={{ backgroundColor: '#e8f5e9', padding: '10px', textAlign: 'center' }}>
                        <Typography variant="h6" style={{ color: '#388e3c' }}>
                          {results.summary.severity.low}
                        </Typography>
                        <Typography variant="body2">Low Severity</Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                <Box mt={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Detected Vulnerabilities:
                  </Typography>
                  {results.issues.length === 0 ? (
                    <Alert severity="success">No vulnerabilities detected!</Alert>
                  ) : (
                    <List>
                      {results.issues.map((issue, index) => (
                        <ListItem key={index} divider={index < results.issues.length - 1}>
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center">
                                <Typography variant="subtitle1" style={{ marginRight: '10px' }}>
                                  {issue.type}
                                </Typography>
                                <Chip 
                                  size="small" 
                                  label={issue.severity} 
                                  style={{ 
                                    backgroundColor: getSeverityColor(issue.severity),
                                    color: 'white'
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography variant="body2" color="textPrimary">
                                  {issue.description}
                                </Typography>
                                <Typography variant="body2">
                                  {issue.line > 0 ? `Found on line: ${issue.line}` : 'Code-level issue'}
                                </Typography>
                                {issue.code && (
                                  <Box mt={1} p={1} bgcolor="rgba(0,0,0,0.04)" borderRadius={1}>
                                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
                                      {issue.code}
                                    </pre>
                                  </Box>
                                )}
                                {issue.recommendation && (
                                  <Typography variant="body2" color="textSecondary" style={{ marginTop: '8px' }}>
                                    <strong>Recommendation:</strong> {issue.recommendation}
                                  </Typography>
                                )}
                              </>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default CodeReviewer; 