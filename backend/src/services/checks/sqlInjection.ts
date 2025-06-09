import { VulnerabilityCheck } from '../../types/vulnerability';

const SQL_KEYWORDS = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];

const SIMPLE_PATTERNS = {
  javascript: [
    // Template literals with variable interpolation and SQL keywords
    /`[^`]*\b(SELECT|INSERT|UPDATE|DELETE)\b[^`]*\${[^}]+}[^`]*`/i,
    // String concatenation with SQL keywords
    /(['"`][^'"`]*\b(SELECT|INSERT|UPDATE|DELETE)\b[^'"`]*['"`]\s*\+\s*\w+)/i
  ],
  python: [
    // f-strings with SQL keywords
    /f['"][^'"]*\b(SELECT|INSERT|UPDATE|DELETE)\b[^'"]*\{[^}]+\}[^'"]*['"]/i,
    // String concatenation with SQL keywords
    /(['"][^'"]*\b(SELECT|INSERT|UPDATE|DELETE)\b[^'"]*['"]\s*\+\s*\w+)/i
  ],
  java: [
    // String concatenation with SQL keywords
    /(['"][^'"]*\b(SELECT|INSERT|UPDATE|DELETE)\b[^'"]*['"]\s*\+\s*\w+)/i
  ]
};

export async function checkSQLInjection(code: string, language: string): Promise<VulnerabilityCheck | null> {
  const patterns = SIMPLE_PATTERNS[language as keyof typeof SIMPLE_PATTERNS];
  if (!patterns) return null;

  const locations = [];
  const lines = code.split('\n');
  let lineNumber = 1;

  for (const line of lines) {
    // Only check lines that contain a SQL keyword
    if (!SQL_KEYWORDS.some(keyword => line.toUpperCase().includes(keyword))) {
      lineNumber++;
      continue;
    }
    for (const pattern of patterns) {
      const match = pattern.exec(line);
      if (match) {
        locations.push({
          line: lineNumber,
          column: match.index + 1,
          length: match[0].length,
          snippet: line.trim()
        });
        break; // Only record the first match per line for simplicity
      }
    }
    lineNumber++;
  }

  if (locations.length === 0) return null;

  return {
    id: 'sql-injection',
    name: 'SQL Injection Vulnerability',
    description: 'Potential SQL injection vulnerability detected. The code appears to be constructing SQL queries using string concatenation or variable interpolation.',
    severity: 'critical',
    category: 'Injection',
    locations,
    recommendation: 'Use parameterized queries or prepared statements instead of string concatenation or variable interpolation.',
    cweId: 'CWE-89',
    owaspCategory: 'A1:2021 – Broken Access Control'
  };
} 