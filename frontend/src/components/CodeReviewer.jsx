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

const API_URL = import.meta.env.DEV
  ? 'http://localhost:3000/api/analyze'
  : 'https://secure-code-reviewer-api.onrender.com/api/analyze';

const CodeReviewer = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

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

      setResults(data);
    } catch (err) {
      console.error('Error analyzing code:', err);
      setError(err.message || 'An error occurred while analyzing the code');
    } finally {
      setLoading(false);
    }
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
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Enter code to analyze"
                    multiline
                    rows={10}
                    variant="outlined"
                    fullWidth
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={`// Enter your ${language} code here for security analysis`}
                  />
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
                  {results.vulnerabilities.length === 0 ? (
                    <Alert severity="success">No vulnerabilities detected!</Alert>
                  ) : (
                    <List>
                      {results.vulnerabilities.map((vuln, index) => (
                        <ListItem key={index} divider={index < results.vulnerabilities.length - 1}>
                          <ListItemText
                            primary={
                              <Box display="flex" alignItems="center">
                                <Typography variant="subtitle1" style={{ marginRight: '10px' }}>
                                  {vuln.name}
                                </Typography>
                                <Chip 
                                  size="small" 
                                  label={vuln.severity} 
                                  style={{ 
                                    backgroundColor: getSeverityColor(vuln.severity),
                                    color: 'white'
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography variant="body2" color="textPrimary">
                                  {vuln.description}
                                </Typography>
                                <Typography variant="body2">
                                  Found {vuln.count} occurrence(s) on line(s): {vuln.lineNumbers.join(', ')}
                                </Typography>
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