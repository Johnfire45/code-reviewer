import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
} from '@mui/material';
import {
  ExpandMore,
  Security,
  BugReport,
  Warning,
  Error as ErrorIcon,
  CheckCircle,
} from '@mui/icons-material';

interface Issue {
  id: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  line: number;
  description: string;
  recommendation: string;
  code: string;
}

interface Summary {
  totalIssues: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

interface AnalysisResultsProps {
  results: {
    summary: Summary;
    issues: Issue[];
  };
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  const { summary, issues } = results;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ErrorIcon />;
      case 'high':
        return <Warning />;
      case 'medium':
        return <BugReport />;
      case 'low':
        return <CheckCircle />;
      default:
        return <Security />;
    }
  };

  const calculateSecurityScore = () => {
    const totalPossibleScore = 100;
    const criticalPenalty = summary.critical * 25;
    const highPenalty = summary.high * 15;
    const mediumPenalty = summary.medium * 8;
    const lowPenalty = summary.low * 3;
    
    const score = Math.max(0, totalPossibleScore - criticalPenalty - highPenalty - mediumPenalty - lowPenalty);
    return score;
  };

  const securityScore = calculateSecurityScore();

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Security color="primary" />
          Security Analysis Results
        </Typography>

        {/* Security Score */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Security Score: {securityScore}/100
          </Typography>
          <LinearProgress
            variant="determinate"
            value={securityScore}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                bgcolor: securityScore >= 80 ? 'success.main' : securityScore >= 60 ? 'warning.main' : 'error.main',
              },
            }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {securityScore >= 80 ? 'Excellent security posture' : 
             securityScore >= 60 ? 'Good security with room for improvement' : 
             'Security needs attention'}
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'error.light', color: 'error.contrastText' }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="h4" component="div">
                  {summary.critical}
                </Typography>
                <Typography variant="body2">
                  Critical
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="h4" component="div">
                  {summary.high}
                </Typography>
                <Typography variant="body2">
                  High
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'info.light', color: 'info.contrastText' }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="h4" component="div">
                  {summary.medium}
                </Typography>
                <Typography variant="body2">
                  Medium
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ textAlign: 'center', bgcolor: 'success.light', color: 'success.contrastText' }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="h4" component="div">
                  {summary.low}
                </Typography>
                <Typography variant="body2">
                  Low
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {summary.totalIssues === 0 ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="h6">🎉 No security issues found!</Typography>
            <Typography>Your code appears to follow security best practices.</Typography>
          </Alert>
        ) : (
          <Alert severity="info">
            <Typography variant="body1">
              Found {summary.totalIssues} security issue{summary.totalIssues !== 1 ? 's' : ''} that need attention.
            </Typography>
          </Alert>
        )}
      </Paper>

      {/* Detailed Issues */}
      {issues.length > 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Detailed Findings
          </Typography>
          
          {issues.map((issue) => (
            <Accordion key={issue.id} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  {getSeverityIcon(issue.severity)}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" component="div">
                      {issue.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Line {issue.line} • {issue.description}
                    </Typography>
                  </Box>
                  <Chip
                    label={issue.severity.toUpperCase()}
                    color={getSeverityColor(issue.severity) as any}
                    size="small"
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ pl: 5 }}>
                  <Typography variant="body2" paragraph>
                    <strong>Issue:</strong> {issue.description}
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    <strong>Vulnerable Code:</strong>
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50', mb: 2 }}>
                    <code style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                      {issue.code}
                    </code>
                  </Paper>
                  
                  <Typography variant="body2" paragraph>
                    <strong>Recommendation:</strong> {issue.recommendation}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default AnalysisResults; 