import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

// Define pattern type
interface SecurityPattern {
  pattern: RegExp;
  name: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

// Define languages type
interface SecurityPatterns {
  [key: string]: SecurityPattern[];
}

// Security vulnerabilities and patterns to check for
const securityPatterns: SecurityPatterns = {
  javascript: [
    { pattern: /eval\s*\(/g, name: 'Unsafe eval()', severity: 'high', description: 'Using eval() can execute arbitrary code and lead to code injection vulnerabilities.' },
    { pattern: /document\.write\s*\(/g, name: 'Unsafe document.write()', severity: 'medium', description: 'Using document.write() can enable XSS attacks if untrusted data is written.' },
    { pattern: /innerHTML\s*=/g, name: 'Unsafe innerHTML', severity: 'medium', description: 'Setting innerHTML with untrusted content can lead to XSS vulnerabilities.' },
    { pattern: /\$\s*\(\s*['"]/g, name: 'Potential jQuery injection', severity: 'medium', description: 'Constructing jQuery selectors with user input can lead to XSS.' },
    { pattern: /exec\s*\(/g, name: 'Command execution', severity: 'high', description: 'Executing system commands can lead to command injection if user input is used.' },
    { pattern: /password\s*:\s*['"]\w+['"]/g, name: 'Hardcoded password', severity: 'high', description: 'Hardcoded passwords in source code are a security risk.' },
    { pattern: /http:\/\//g, name: 'Insecure HTTP', severity: 'medium', description: 'Using HTTP instead of HTTPS can expose data to interception.' },
  ],
  python: [
    { pattern: /eval\s*\(/g, name: 'Unsafe eval()', severity: 'high', description: 'Using eval() can execute arbitrary code and lead to code injection vulnerabilities.' },
    { pattern: /exec\s*\(/g, name: 'Command execution', severity: 'high', description: 'Executing system commands can lead to command injection if user input is used.' },
    { pattern: /subprocess\.call/g, name: 'Command execution', severity: 'high', description: 'Subprocess calls can lead to command injection if user input is used.' },
    { pattern: /os\.system/g, name: 'Command execution', severity: 'high', description: 'OS system calls can lead to command injection if user input is used.' },
    { pattern: /request\.GET\s*\[\s*['"]/g, name: 'Potential parameter injection', severity: 'medium', description: 'Accessing GET parameters without validation can lead to injection attacks.' },
    { pattern: /password\s*=\s*['"]\w+['"]/g, name: 'Hardcoded password', severity: 'high', description: 'Hardcoded passwords in source code are a security risk.' },
  ],
  php: [
    { pattern: /eval\s*\(/g, name: 'Unsafe eval()', severity: 'high', description: 'Using eval() can execute arbitrary code and lead to code injection vulnerabilities.' },
    { pattern: /\$_GET\s*\[\s*['"]/g, name: 'Unsanitized GET input', severity: 'high', description: 'Using $_GET without sanitization can lead to injection attacks.' },
    { pattern: /\$_POST\s*\[\s*['"]/g, name: 'Unsanitized POST input', severity: 'high', description: 'Using $_POST without sanitization can lead to injection attacks.' },
    { pattern: /mysql_query\s*\(/g, name: 'Deprecated MySQL function', severity: 'medium', description: 'mysql_query() is deprecated and vulnerable to SQL injection.' },
    { pattern: /exec\s*\(/g, name: 'Command execution', severity: 'high', description: 'Executing system commands can lead to command injection if user input is used.' },
    { pattern: /shell_exec/g, name: 'Command execution', severity: 'high', description: 'Shell command execution can lead to command injection if user input is used.' },
    { pattern: /password\s*=\s*['"]\w+['"]/g, name: 'Hardcoded password', severity: 'high', description: 'Hardcoded passwords in source code are a security risk.' },
  ]
};

// Define finding type
interface Finding {
  name: string;
  severity: string;
  description: string;
  lineNumbers: number[];
  count: number;
}

// Function to analyze code for security vulnerabilities
function analyzeCode(code: string, language: string): Finding[] {
  const findings: Finding[] = [];
  const patterns = securityPatterns[language.toLowerCase()] || securityPatterns.javascript;
  
  patterns.forEach((pattern: SecurityPattern) => {
    const matches = code.match(pattern.pattern);
    if (matches) {
      findings.push({
        name: pattern.name,
        severity: pattern.severity,
        description: pattern.description,
        lineNumbers: findLineNumbers(code, pattern.pattern),
        count: matches.length
      });
    }
  });
  
  return findings;
}

// Helper function to find line numbers of matches
function findLineNumbers(code: string, pattern: RegExp): number[] {
  const lines = code.split('\n');
  const lineNumbers: number[] = [];
  
  lines.forEach((line, index) => {
    if (pattern.test(line)) {
      lineNumbers.push(index + 1); // Line numbers are 1-indexed
    }
    pattern.lastIndex = 0; // Reset regex index
  });
  
  return lineNumbers;
}

// Calculate a code quality score
function calculateCodeQuality(issueCount: number, codeLength: number): number {
  // Simple algorithm: higher score is better (0-100)
  const normalizedIssues = Math.min(issueCount, 20); // Cap at 20 issues for calculation
  const baseScore = 100 - (normalizedIssues * 5); // Each issue reduces score by 5 points
  
  // Adjust for code length (shorter code with issues is worse than longer code with same issues)
  const lengthFactor = Math.min(codeLength / 500, 1); // Normalize length, max 1
  
  return Math.max(Math.round(baseScore * (0.7 + (lengthFactor * 0.3))), 0);
}

// Define request body interface
interface AnalyzeRequestBody {
  code: string;
  language?: string;
}

// Add analyze endpoint
router.post('/analyze', function(req: Request<{}, {}, AnalyzeRequestBody>, res: Response) {
  try {
    const { code, language = 'javascript' } = req.body;
    
    if (!code) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'No code provided for analysis'
      });
    }
    
    const vulnerabilities = analyzeCode(code, language);
    const severity = {
      high: vulnerabilities.filter(v => v.severity === 'high').length,
      medium: vulnerabilities.filter(v => v.severity === 'medium').length,
      low: vulnerabilities.filter(v => v.severity === 'low').length
    };
    
    const totalIssues = vulnerabilities.length;
    
    return res.status(StatusCodes.OK).json({
      success: true,
      language,
      summary: {
        totalIssues,
        severity
      },
      vulnerabilities,
      codeQuality: calculateCodeQuality(totalIssues, code.length)
    });
  } catch (error: any) {
    console.error('Error analyzing code:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Failed to analyze code',
      details: error.message
    });
  }
});

export default router; 