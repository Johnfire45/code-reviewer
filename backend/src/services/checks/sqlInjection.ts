import { VulnerabilityCheck } from '../../types/vulnerability';

interface SQLPattern {
  pattern: RegExp;
  description: string;
}

const patterns: Record<string, SQLPattern[]> = {
  javascript: [
    {
      pattern: /`[^`]*(SELECT|INSERT|UPDATE|DELETE|EXECUTE|EXEC|EXECUTE IMMEDIATE|ALTER|TRUNCATE|DROP)[^`]*\$\{[^}]+\}[^`]*`/gi,
      description: 'Template literal with SQL keyword and variable interpolation'
    },
    {
      pattern: /["'][^"']*["']\s*\+\s*\w+/g,
      description: 'String concatenation in SQL query'
    },
    {
      pattern: /(SELECT|INSERT|UPDATE|DELETE|EXECUTE|EXEC|EXECUTE IMMEDIATE|ALTER|TRUNCATE|DROP)[^;]*\+\s*\w+/gi,
      description: 'SQL keyword with string concatenation'
    }
  ],
  python: [
    {
      pattern: /f["'][^"']*(SELECT|INSERT|UPDATE|DELETE|ALTER|TRUNCATE|DROP|EXECUTE IMMEDIATE)[^"']*{[^}]+}[^"']*["']/i,
      description: 'f-string with variable interpolation and SQL keyword'
    },
    {
      pattern: /["'][^"']*["']\s*\+\s*\w+/g,
      description: 'String concatenation in SQL query'
    },
    {
      pattern: /(SELECT|INSERT|UPDATE|DELETE|EXECUTE|EXEC|EXECUTE IMMEDIATE|ALTER|TRUNCATE|DROP)[^;]*\+\s*\w+/gi,
      description: 'SQL keyword with string concatenation'
    },
    {
      // Updated to include ALTER, TRUNCATE, DROP keywords
      pattern: /["'][^"']*(SELECT|INSERT|UPDATE|DELETE|ALTER|TRUNCATE|DROP)[^"']*["']\s*%\s*\([^)]+\)/i,
      description: '% operator string formatting with SQL keyword'
    }
  ],
  java: [
    {
      pattern: /["'][^"']*["']\s*\+\s*\w+/g,
      description: 'String concatenation in SQL query'
    },
    {
      pattern: /(SELECT|INSERT|UPDATE|DELETE|EXECUTE|EXEC|EXECUTE IMMEDIATE|ALTER|TRUNCATE|DROP)[^;]*\+\s*\w+/gi,
      description: 'SQL keyword with string concatenation'
    },
    {
      // Updated to include TRUNCATE and other keywords
      pattern: /String\.format\(\s*"[^"']*(SELECT|INSERT|UPDATE|DELETE|ALTER|TRUNCATE|DROP)[^"]*",\s*[^)]+\)/i,
      description: 'String.format with SQL keyword'
    }
  ],
  php: [
    {
      pattern: /["'][^"']*["']\s*\.\s*\$\w+/g,
      description: 'String concatenation in SQL query'
    },
    {
      pattern: /(SELECT|INSERT|UPDATE|DELETE|EXECUTE|EXEC|EXECUTE IMMEDIATE|ALTER|TRUNCATE|DROP)[^;]*\.\s*\$\w+/gi,
      description: 'SQL keyword with string concatenation'
    },
    {
      // Updated to include TRUNCATE and other keywords
      pattern: /"[^"']*(SELECT|INSERT|UPDATE|DELETE|ALTER|TRUNCATE|DROP)[^"]*\{\$\w+\}[^"]*"/i,
      description: 'Double-quoted string interpolation with {$var} and SQL keyword'
    },
    {
      // Updated to include TRUNCATE and other keywords
      pattern: /"[^"']*(SELECT|INSERT|UPDATE|DELETE|ALTER|TRUNCATE|DROP)[^"]*\$\w+[^"]*"/i,
      description: 'Double-quoted string interpolation with $var and SQL keyword'
    }
  ]
};

function findVulnerabilityLocations(code: string, pattern: RegExp): Array<{
  line: number;
  column: number;
  length: number;
  snippet: string;
}> {
  const locations = [];
  const lines = code.split('\n');
  
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    // Ensure the pattern has global flag for matchAll
    const globalPattern = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g');
    const matches = [...line.matchAll(globalPattern)];
    
    for (const match of matches) {
      if (match.index !== undefined) {
        locations.push({
          line: lineIndex + 1,
          column: match.index + 1,
          length: match[0].length,
          snippet: line.trim()
        });
      }
    }
  }
  
  return locations;
}

export async function checkSQLInjection(code: string, language: string): Promise<VulnerabilityCheck | null> {
  const normalizedLanguage = language.toLowerCase();
  const languagePatterns = patterns[normalizedLanguage];
  
  // Console log 1: Language detected
  console.log(`🔍 [SQL Injection Check] Language detected: ${normalizedLanguage}`);
  
  if (!languagePatterns) {
    console.log(`❌ [SQL Injection Check] Language '${normalizedLanguage}' not supported`);
    return null; // Language not supported
  }
  
  const allLocations = [];
  let matchedPattern = '';
  let vulnerableCode = '';
  
  for (const { pattern, description } of languagePatterns) {
    const locations = findVulnerabilityLocations(code, pattern);
    if (locations.length > 0) {
      allLocations.push(...locations);
      matchedPattern = description;
      vulnerableCode = locations[0].snippet; // Get the first vulnerable line
      break; // Stop at first match to avoid duplicates
    }
  }
  
  if (allLocations.length === 0) {
    // Console log 2: No SQL injection detected
    console.log(`✅ [SQL Injection Check] No SQL injection detected in ${normalizedLanguage} code`);
    return null; // No vulnerabilities found
  }
  
  // Console log 3: SQL injection detected with vulnerable code
  console.log(`🚨 [SQL Injection Check] SQL injection detected!`);
  console.log(`   Pattern matched: ${matchedPattern}`);
  console.log(`   Vulnerable code: ${vulnerableCode}`);
  console.log(`   Total locations found: ${allLocations.length}`);
  console.log(`   Line(s): ${allLocations.map(loc => loc.line).join(', ')}`);
  console.log('');  // Empty line for better readability
  
  return {
    id: 'sql-injection',
    name: 'SQL Injection',
    description: `Potential SQL injection vulnerability detected through ${matchedPattern}. User input appears to be directly concatenated into SQL queries without proper sanitization.`,
    severity: 'high' as const,
    category: 'Injection',
    locations: allLocations,
    recommendation: 'Use parameterized queries, prepared statements, or stored procedures. Validate and sanitize all user inputs. Consider using an ORM that provides built-in protection against SQL injection.',
    cweId: 'CWE-89',
    owaspCategory: 'A03:2021 – Injection'
  };
}