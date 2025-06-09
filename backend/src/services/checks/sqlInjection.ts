import { VulnerabilityCheck, VulnerabilityCheckResult } from '../../types/vulnerability';

// Common SQL injection patterns
const SQL_INJECTION_PATTERNS = {
  javascript: [
    {
      pattern: /`\s*SELECT.*\${[^}]+}.*`/g,
      description: 'Template literal in SQL query'
    },
    {
      pattern: /['"`]\s*\+\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*\+?\s*['"`]/g,
      description: 'String concatenation in SQL query'
    },
    {
      pattern: /execute\s*\(\s*['"`]\s*SELECT/i,
      description: 'Dynamic SQL execution'
    },
    {
      pattern: /query\s*\(\s*['"`]\s*SELECT/i,
      description: 'Dynamic SQL query'
    }
  ],
  python: [
    {
      pattern: /['"]\s*\+\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\+?\s*['"]/g,
      description: 'String concatenation in SQL query'
    },
    {
      pattern: /execute\s*\(\s*['"]\s*SELECT/i,
      description: 'Dynamic SQL execution'
    },
    {
      pattern: /raw\s*\(\s*['"]\s*SELECT/i,
      description: 'Raw SQL query'
    }
  ],
  java: [
    {
      pattern: /['"]\s*\+\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\+?\s*['"]/g,
      description: 'String concatenation in SQL query'
    },
    {
      pattern: /createStatement\s*\(\s*\)\s*\.\s*execute\s*\(\s*['"]\s*SELECT/i,
      description: 'Dynamic SQL execution'
    },
    {
      pattern: /executeQuery\s*\(\s*['"]\s*SELECT/i,
      description: 'Dynamic SQL query'
    }
  ]
};

export async function checkSQLInjection(code: string, language: string): Promise<VulnerabilityCheck | null> {
  const patterns = SQL_INJECTION_PATTERNS[language as keyof typeof SQL_INJECTION_PATTERNS];
  
  if (!patterns) {
    return null; // Language not supported
  }

  const locations = [];
  let lineNumber = 1;
  let column = 0;

  // Split code into lines for better location tracking
  const lines = code.split('\n');

  for (const line of lines) {
    for (const { pattern, description } of patterns) {
      let match;
      while ((match = pattern.exec(line)) !== null) {
        locations.push({
          line: lineNumber,
          column: match.index + 1,
          length: match[0].length,
          snippet: line.trim()
        });
      }
    }
    lineNumber++;
  }

  if (locations.length === 0) {
    return null;
  }

  return {
    id: 'sql-injection',
    name: 'SQL Injection Vulnerability',
    description: 'Potential SQL injection vulnerability detected. The code appears to be constructing SQL queries using string concatenation or executing dynamic SQL, which could allow attackers to manipulate the query.',
    severity: 'critical',
    category: 'Injection',
    locations,
    recommendation: 'Use parameterized queries or prepared statements instead of string concatenation. For example:\n' +
      '- JavaScript: Use ? placeholders with mysql2 or pg\n' +
      '- Python: Use parameterized queries with SQLAlchemy or psycopg2\n' +
      '- Java: Use PreparedStatement with ? placeholders',
    cweId: 'CWE-89',
    owaspCategory: 'A1:2021 – Broken Access Control'
  };
} 