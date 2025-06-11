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

/**
 * Detects the programming language from code content
 * @param code The code content to analyze
 * @returns The detected language name, or default language if detection fails
 */
export function detectLanguageFromContent(code: string): string {
  if (!code || code.trim().length === 0) {
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
    
    // Only return if it's in our supported languages
    if (supportedLanguages.includes(standardName)) {
      return standardName;
    }
  } catch (err) {
    console.warn('Language detection failed:', err);
  }
  
  return DEFAULT_LANGUAGE;
}

/**
 * Detects language from file name using extension
 * @param fileName The name of the file
 * @returns The detected language name, or default language if detection fails
 */
export function detectLanguageFromFileName(fileName: string): string {
  if (!fileName) return DEFAULT_LANGUAGE;
  
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (!extension) return DEFAULT_LANGUAGE;
  
  return extensionToLanguage[extension] || DEFAULT_LANGUAGE;
} 