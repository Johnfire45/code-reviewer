console.log('[SQLI DEBUG] backend/src/services/checks/sqlInjection.ts module loaded');
import { VulnerabilityCheck, VulnerabilityLocation } from '../../types/vulnerability';

const SQL_INJECTION_PATTERNS = {
  javascript: [
    {
      pattern: /`[^`]*(SELECT|INSERT|UPDATE|DELETE)[^`]*\${[^}]+}[^`]*`/i, // template literals with SQL keyword
      description: 'Template literal in SQL query with SQL keyword'
    },
    {
      pattern: /["'`][^"'`]*["'`]\s*\+\s*\w+/g, // string concatenation
      description: 'String concatenation in SQL query'
    },
    {
      pattern: /(SELECT|INSERT|UPDATE|DELETE)[^;]*\+\s*\w+/gi, // SQL keyword with concatenation
      description: 'SQL keyword with string concatenation'
    }
  ],
  python: [
    {
      pattern: /f["'][^"']*(SELECT|INSERT|UPDATE|DELETE)[^"']*{[^}]+}[^"']*["']/i, // f-string with SQL keyword
      description: 'f-string with variable interpolation and SQL keyword'
    },
    {
      pattern: /["'][^"']*["']\s*\+\s*\w+/g, // string concatenation
      description: 'String concatenation in SQL query'
    },
    {
      pattern: /(SELECT|INSERT|UPDATE|DELETE)[^;]*\+\s*\w+/gi, // SQL keyword with concatenation
      description: 'SQL keyword with string concatenation'
    }
  ],
  java: [
    {
      pattern: /["'][^"']*["']\s*\+\s*\w+/g, // string concatenation
      description: 'String concatenation in SQL query'
    },
    {
      pattern: /(SELECT|INSERT|UPDATE|DELETE)[^;]*\+\s*\w+/gi, // SQL keyword with concatenation
      description: 'SQL keyword with string concatenation'
    }
  ],
  php: [
    {
      pattern: /["'][^"']*["']\s*\.\s*\$\w+/g, // string concatenation
      description: 'String concatenation in SQL query'
    },
    {
      pattern: /(SELECT|INSERT|UPDATE|DELETE)[^;]*\.\s*\$\w+/gi, // SQL keyword with concatenation
      description: 'SQL keyword with string concatenation'
    }
  ]
};

export async function checkSQLInjection(code: string, language: string): Promise<VulnerabilityCheck | null> {
  try {
    const patterns = SQL_INJECTION_PATTERNS[language as keyof typeof SQL_INJECTION_PATTERNS];
    if (!patterns) {
      return null; // Language not supported
    }

    const locations: VulnerabilityLocation[] = [];
    let lineNumber = 1;
    const lines = code.split('\n');

    for (const line of lines) {
      console.log(`[SQLI DEBUG] Checking line ${lineNumber}:`, line);
      for (const { pattern, description } of patterns) {
        pattern.lastIndex = 0;
        if (pattern.test(line)) {
          console.log(`[SQLI DEBUG] Pattern matched (${description}):`, line.trim());
          locations.push({
            line: lineNumber,
            column: 1, // Could be improved to actual match index if needed
            length: line.length,
            snippet: line.trim()
          });
        }
      }
      lineNumber++;
    }

    if (locations.length === 0) {
      console.log('[SQLI DEBUG] No SQL injection patterns detected.');
      return null;
    }

    console.log(`[SQLI DEBUG] Detected ${locations.length} SQL injection pattern(s).`);
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
        '- Java: Use PreparedStatement with ? placeholders\n' +
        '- PHP: Use PDO prepared statements with ? or :named placeholders',
      cweId: 'CWE-89',
      owaspCategory: 'A1:2021 – Broken Access Control'
    };
  } catch (error) {
    console.error('Error in SQL injection check:', error);
    return null;
  }
} 