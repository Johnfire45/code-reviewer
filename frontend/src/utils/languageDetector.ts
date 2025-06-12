import detector from 'lang-detector';

// Map of file extensions to language names
export const extensionToLanguage: { [key: string]: string } = {
  // JavaScript
  'js': 'javascript',
  'jsx': 'javascript',
  
  // TypeScript
  'ts': 'typescript',
  'tsx': 'typescript',
  
  // Python
  'py': 'python',
  'pyc': 'python',
  'pyw': 'python',
  
  // Java
  'java': 'java',
  
  // C/C++
  'c': 'c',
  'h': 'c',
  'cpp': 'cpp',
  'hpp': 'cpp',
  'cc': 'cpp',
  
  // PHP
  'php': 'php',
  
  // Ruby
  'rb': 'ruby',
  
  // Go
  'go': 'go',
  
  // Other languages
  'cs': 'csharp',
  'swift': 'swift',
  'kt': 'kotlin',
  'rs': 'rust',
  'sql': 'sql',
  'html': 'html',
  'css': 'css',
  'json': 'json',
  'xml': 'xml',
  'yml': 'yaml',
  'yaml': 'yaml',
};

// Default language to use if detection fails
export const DEFAULT_LANGUAGE = 'javascript';

// Supported languages in our application
export const supportedLanguages = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'c',
  'php',
  'ruby',
  'go'
];

// Performance: Pre-compile regex for better performance
const SQL_KEYWORDS_REGEX = /\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|GRANT|REVOKE|TRUNCATE|EXEC|EXECUTE|MERGE|WITH|UNION|EXPLAIN|CALL|DESCRIBE|SHOW)\b/i;

// Performance: Pre-compile TypeScript filename regex
const TS_FILE_REGEX = /\.tsx?$/i;

/**
 * Detects the programming language from code content
 * @param code The code content to analyze
 * @param fileName Optional filename for TypeScript override logic
 * @returns The detected language name, or default language if detection fails
 */
export function detectLanguageFromContent(code: string, fileName?: string): string {
  if (!code || code.trim().length === 0) {
    console.log(`[LanguageDetector] Empty code → ${DEFAULT_LANGUAGE}`);
    return DEFAULT_LANGUAGE;
  }
  
  // Custom SQL detection logic (check first before lang-detector)
  if (SQL_KEYWORDS_REGEX.test(code)) {
    console.log(`[LanguageDetector] SQL detected → ${DEFAULT_LANGUAGE} (unsupported)`);
    return DEFAULT_LANGUAGE;
  }
  
  try {
    // Use lang-detector to detect the language
    const detected = detector(code);
    
    // Map lang-detector's output to our standardized language names
    const detectorToStandard: { [key: string]: string } = {
      'JavaScript': 'javascript',
      'TypeScript': 'typescript',
      'Python': 'python',
      'Java': 'java',
      'C++': 'cpp',
      'C': 'c',
      'PHP': 'php',
      'Ruby': 'ruby',
      'Go': 'go',
    };
    
    // Convert to standard name or use default
    const standardName = detectorToStandard[detected] || detected.toLowerCase();
    
    console.log(`[LanguageDetector] ${detected} → ${standardName}`);
    
    // TypeScript override logic: if filename suggests TS but content detected as JS
    if (fileName && TS_FILE_REGEX.test(fileName) && standardName === 'javascript') {
      console.log(`[LanguageDetector] TS override: ${fileName} → typescript`);
      return 'typescript';
    }
    
    // Only return if it's in our supported languages
    if (supportedLanguages.includes(standardName)) {
      return standardName;
    } else {
      console.warn(`[LanguageDetector] Unsupported: ${standardName} → ${DEFAULT_LANGUAGE}`);
    }
  } catch (err) {
    console.warn('[LanguageDetector] Detection failed:', err);
  }
  
  return DEFAULT_LANGUAGE;
}

/**
 * Detects language from file name using extension
 * @param fileName The name of the file
 * @returns The detected language name, or default language if detection fails
 */
export function detectLanguageFromFileName(fileName: string): string {
  if (!fileName) {
    console.log('[LanguageDetector] Empty fileName → returning DEFAULT_LANGUAGE:', DEFAULT_LANGUAGE);
    return DEFAULT_LANGUAGE;
  }
  
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (!extension) {
    console.log('[LanguageDetector] Could not extract file extension → returning DEFAULT_LANGUAGE:', DEFAULT_LANGUAGE);
    return DEFAULT_LANGUAGE;
  }
  
  const detectedLanguage = extensionToLanguage[extension] || DEFAULT_LANGUAGE;
  console.log(`[LanguageDetector] File extension ".${extension}" → detected language: "${detectedLanguage}"`);
  
  return detectedLanguage;
}