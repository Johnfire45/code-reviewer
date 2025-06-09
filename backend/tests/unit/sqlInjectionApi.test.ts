import request from 'supertest';

const API_URL = 'http://localhost:3001';

describe('SQL Injection Detection API', () => {
  const testCases = [
    // JavaScript - Positive
    {
      code: 'const query = `SELECT * FROM users WHERE id = ${userId}`;',
      language: 'javascript',
      shouldDetect: true,
      description: 'JS: Template literal with SQL keyword and variable',
    },
    {
      code: 'const query = "SELECT * FROM users WHERE id = " + userId;',
      language: 'javascript',
      shouldDetect: true,
      description: 'JS: String concatenation with SQL keyword',
    },
    // JavaScript - Negative
    {
      code: 'const query = "SELECT * FROM users WHERE id = ?";',
      language: 'javascript',
      shouldDetect: false,
      description: 'JS: Parameterized query (safe)',
    },
    // Python - Positive
    {
      code: 'query = f"SELECT * FROM users WHERE id = {user_id}"',
      language: 'python',
      shouldDetect: true,
      description: 'Python: f-string with SQL keyword and variable',
    },
    {
      code: 'query = "SELECT * FROM users WHERE id = " + user_id',
      language: 'python',
      shouldDetect: true,
      description: 'Python: String concatenation with SQL keyword',
    },
    // Python - Negative
    {
      code: 'query = "SELECT * FROM users WHERE id = %s" % user_id',
      language: 'python',
      shouldDetect: false,
      description: 'Python: Parameterized query (safe)',
    },
    // Java - Positive
    {
      code: 'String query = "SELECT * FROM users WHERE id = " + userId;',
      language: 'java',
      shouldDetect: true,
      description: 'Java: String concatenation with SQL keyword',
    },
    // Java - Negative
    {
      code: 'String query = "SELECT * FROM users WHERE id = ?";',
      language: 'java',
      shouldDetect: false,
      description: 'Java: Parameterized query (safe)',
    },
    // Edge case - No SQL
    {
      code: 'const message = `Hello, ${userName}!`;',
      language: 'javascript',
      shouldDetect: false,
      description: 'JS: Template literal with no SQL keyword',
    },
    // Edge case - SQL keyword but no variable
    {
      code: 'const query = "SELECT * FROM users WHERE id = 1";',
      language: 'javascript',
      shouldDetect: false,
      description: 'JS: SQL keyword but no variable',
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