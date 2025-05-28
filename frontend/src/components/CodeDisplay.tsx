import React, { useEffect } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-go';

interface CodeDisplayProps {
  code: string;
  language: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, language }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  const getLanguageForPrism = (lang: string): string => {
    const languageMap: { [key: string]: string } = {
      'javascript': 'javascript',
      'typescript': 'typescript',
      'python': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'php': 'php',
      'ruby': 'ruby',
      'go': 'go',
    };
    return languageMap[lang] || 'javascript';
  };

  return (
    <Paper elevation={2} sx={{ overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'grey.100', p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" component="h3">
          Code Preview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {language.toUpperCase()} • {code.split('\n').length} lines
        </Typography>
      </Box>
      
      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
        <pre style={{ margin: 0, padding: '16px', fontSize: '14px' }}>
          <code className={`language-${getLanguageForPrism(language)}`}>
            {code}
          </code>
        </pre>
      </Box>
    </Paper>
  );
};

export default CodeDisplay; 