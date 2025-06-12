import { detectLanguageFromContent, detectLanguageFromFileName, DEFAULT_LANGUAGE } from '../languageDetector';

describe('languageDetector', () => {

  describe('detectLanguageFromFileName', () => {
    it('should detect JavaScript from .js extension', () => {
      expect(detectLanguageFromFileName('index.js')).toBe('javascript');
    });

    it('should detect Python from .py extension', () => {
      expect(detectLanguageFromFileName('script.py')).toBe('python');
    });

    it('should detect Java from .java extension', () => {
      expect(detectLanguageFromFileName('Main.java')).toBe('java');
    });

    it('should detect TypeScript from .ts extension', () => {
      expect(detectLanguageFromFileName('app.ts')).toBe('typescript');
    });

    it('should detect TypeScript from .tsx extension', () => {
      expect(detectLanguageFromFileName('App.tsx')).toBe('typescript');
    });

    it('should detect C++ from .cpp extension', () => {
      expect(detectLanguageFromFileName('main.cpp')).toBe('cpp');
    });

    it('should detect PHP from .php extension', () => {
      expect(detectLanguageFromFileName('index.php')).toBe('php');
    });

    it('should detect Ruby from .rb extension', () => {
      expect(detectLanguageFromFileName('script.rb')).toBe('ruby');
    });

    it('should detect Go from .go extension', () => {
      expect(detectLanguageFromFileName('main.go')).toBe('go');
    });

    it('should return default language for unknown extension', () => {
      expect(detectLanguageFromFileName('file.unknownext')).toBe(DEFAULT_LANGUAGE);
    });

    it('should return default language for file with no extension', () => {
      expect(detectLanguageFromFileName('Makefile')).toBe(DEFAULT_LANGUAGE);
    });
  });

  describe('detectLanguageFromContent', () => {
    it('should detect JavaScript from JS code', () => {
      const code = `const x = 42; console.log(x);`;
      expect(detectLanguageFromContent(code)).toBe('javascript');
    });

    it('should detect Python from Python code', () => {
      const code = `def hello():\n    print("Hello, world!")`;
      expect(detectLanguageFromContent(code)).toBe('python');
    });

    it('should detect Java from Java code', () => {
      const code = `public class Main { public static void main(String[] args) { System.out.println("Hello"); } }`;
      expect(detectLanguageFromContent(code)).toBe('java');
    });

    it('should detect TypeScript from TS code with .ts file', () => {
      const code = `const greet = (name: string): void => { console.log("Hello " + name); };`;
      expect(detectLanguageFromContent(code, 'app.ts')).toBe('typescript');
    });

    it('should detect TypeScript from TSX code with .tsx file', () => {
      const code = `const Button: React.FC = () => <button>Click</button>;`;
      expect(detectLanguageFromContent(code, 'App.tsx')).toBe('typescript');
    });

    it('should detect C++ from C++ code', () => {
      const code = `#include <iostream>\nint main() { std::cout << "Hello"; return 0; }`;
      expect(detectLanguageFromContent(code)).toBe('cpp');
    });

    it('should detect PHP from PHP code', () => {
      const code = `<?php echo "Hello, world!"; ?>`;
      expect(detectLanguageFromContent(code)).toBe('php');
    });

    it('should detect Ruby from Ruby code', () => {
      const code = `puts "Hello, world!"`;
      expect(detectLanguageFromContent(code)).toBe('ruby');
    });

    it('should detect Go from Go code', () => {
      const code = `package main\nimport "fmt"\nfunc main() { fmt.Println("Hello") }`;
      expect(detectLanguageFromContent(code)).toBe('go');
    });

    it('should return default language for empty code', () => {
      expect(detectLanguageFromContent('')).toBe(DEFAULT_LANGUAGE);
    });

    it('should return default language for SQL content', () => {
      const code = `SELECT * FROM users;`;
      expect(detectLanguageFromContent(code, 'query.sql')).toBe(DEFAULT_LANGUAGE);
    });

    it('should return default language for unsupported language content', () => {
      const code = `PRINT 'Hello from T-SQL!';`; // Some dialect of SQL — expect fallback
      expect(detectLanguageFromContent(code, 'example.sql')).toBe(DEFAULT_LANGUAGE);
    });

    it('should handle mixed case SQL keywords', () => {
      const code = `Select * From users Where id = 1;`;
      expect(detectLanguageFromContent(code)).toBe(DEFAULT_LANGUAGE);
    });

    it('should not detect SQL in comments or strings', () => {
      const code = `console.log("SELECT * FROM users"); // This is not SQL`;
      expect(detectLanguageFromContent(code)).toBe('javascript');
    });

    it('should handle TypeScript with interfaces', () => {
      const code = `const user: User = { id: 1, name: "John" };`; // More likely to be detected as JS
      expect(detectLanguageFromContent(code, 'types.ts')).toBe('typescript');
    });

    it('should handle complex SQL statements', () => {
      const code = `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(255));`;
      expect(detectLanguageFromContent(code)).toBe(DEFAULT_LANGUAGE);
    });

    it('should handle filename with multiple dots', () => {
      const code = `const x: number = 42;`;
      expect(detectLanguageFromContent(code, 'my.component.ts')).toBe('typescript');
    });

    it('should handle whitespace-only code', () => {
      expect(detectLanguageFromContent('   \n\t  ')).toBe(DEFAULT_LANGUAGE);
    });
  });

});