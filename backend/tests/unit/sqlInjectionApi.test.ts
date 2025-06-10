import request from 'supertest';

const API_URL = 'http://localhost:3001';

describe('SQL Injection Detection API', () => {
  const testCases = [
    // JavaScript - Positive Cases
    {
      code: 'const query = `SELECT * FROM users WHERE id = ${userId}`;',
      language: 'javascript',
      shouldDetect: true,
      description: 'JS: Template literal with SQL keyword and variable (detected)',
    },
    {
      code: 'const query = "SELECT * FROM users WHERE id = " + userId;',
      language: 'javascript',
      shouldDetect: true,
      description: 'JS: String concatenation with SQL keyword (detected)',
    },
    {
      code: `const sql = \`INSERT INTO logs (message) VALUES ('\${logMessage}')\`;`,
      language: 'javascript',
      shouldDetect: true,
      description: 'JS: Insert statement with template literal and variable (detected)',
    },
    // JavaScript - Negative Cases
    {
      code: 'const query = "SELECT * FROM users WHERE id = ?";',
      language: 'javascript',
      shouldDetect: false,
      description: 'JS: Parameterized query (safe)',
    },
    {
      code: 'const message = `Hello, ${userName}!`;',
      language: 'javascript',
      shouldDetect: false,
      description: 'JS: Template literal with no SQL keyword (safe)',
    },
    {
      code: 'const query = "SELECT * FROM users WHERE id = 1";',
      language: 'javascript',
      shouldDetect: false,
      description: 'JS: SQL keyword but no variable (safe)',
    },

    // Python - Positive Cases
    {
      code: 'query = f"SELECT * FROM users WHERE id = {user_id}"',
      language: 'python',
      shouldDetect: true,
      description: 'Python: f-string with SQL keyword and variable (detected)',
    },
    {
      code: 'query = "SELECT * FROM users WHERE id = " + user_id',
      language: 'python',
      shouldDetect: true,
      description: 'Python: String concatenation with SQL keyword (detected)',
    },
    {
      code: 'query = "UPDATE products SET price = %s WHERE id = %s" % (new_price, product_id)',
      language: 'python',
      shouldDetect: true,
      description: 'Python: % operator with SQL keyword and variable (detected)',
    },
    // Python - Negative Cases
    {
      code: 'query = "SELECT * FROM users WHERE id = %s", (user_id,)',
      language: 'python',
      shouldDetect: false,
      description: 'Python: Parameterized query (safe)',
    },

    // Java - Positive Cases
    {
      code: 'String query = "SELECT * FROM users WHERE id = " + userId;',
      language: 'java',
      shouldDetect: true,
      description: 'Java: String concatenation with SQL keyword (detected)',
    },
    {
      code: 'String sql = String.format("DELETE FROM logs WHERE id = %d", logId);',
      language: 'java',
      shouldDetect: true,
      description: 'Java: String.format with SQL keyword and variable (detected)',
    },
    // Java - Negative Cases
    {
      code: 'String query = "SELECT * FROM users WHERE id = ?";',
      language: 'java',
      shouldDetect: false,
      description: 'Java: Parameterized query (safe)',
    },

    // PHP - Positive Cases
    {
      code: '$query = "SELECT * FROM users WHERE id = " . $userId;',
      language: 'php',
      shouldDetect: true,
      description: 'PHP: String concatenation with SQL keyword and variable (detected)',
    },
    {
      code: '$query = "SELECT * FROM users WHERE id = {$userId}";',
      language: 'php',
      shouldDetect: true,
      description: 'PHP: String interpolation with SQL keyword and variable (detected)',
    },
    {
      code: '$sql = "UPDATE products SET stock = $newStock WHERE id = $productId";',
      language: 'php',
      shouldDetect: true,
      description: 'PHP: Double-quoted string interpolation with SQL keyword (detected)',
    },
    // PHP - Negative Cases
    {
      code: '$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");',
      language: 'php',
      shouldDetect: false,
      description: 'PHP: Prepared statement (safe)',
    },
  ];

  testCases.forEach(({ code, language, shouldDetect, description }) => {
    it(description, async () => {
      const res = await request(API_URL)
        .post('/api/code-review/analyze')
        .send({ code, language })
        .set('Accept', 'application/json');

      if (shouldDetect) {
        expect(res.body.vulnerabilities.length).toBeGreaterThan(0);
        expect(res.body.vulnerabilities[0].id).toBe('sql-injection');
      } else {
        expect(res.body.vulnerabilities.length).toBe(0);
      }
    });
  });
}); 