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

    // ===== ADDITIONAL EDGE CASES AND COMPLEX PATTERNS =====

    // JavaScript - Additional Edge Cases
    {
      code: 'const query = `DROP TABLE users; INSERT INTO logs VALUES (${userInput});`;',
      language: 'javascript',
      shouldDetect: true,
      description: 'JS: Multiple SQL keywords with template literal (detected)',
    },
    {
      code: 'let sql = "TRUNCATE TABLE " + tableName + "; DELETE FROM logs;";',
      language: 'javascript',
      shouldDetect: true,
      description: 'JS: TRUNCATE and DELETE with concatenation (detected)',
    },
    {
      code: 'const query = `EXEC sp_executesql N\'SELECT * FROM users WHERE id = ${id}\';`;',
      language: 'javascript',
      shouldDetect: true,
      description: 'JS: EXEC statement with template literal (detected)',
    },
    {
      code: 'const safe = `Hello ${name}, welcome to our app!`;',
      language: 'javascript',
      shouldDetect: false,
      description: 'JS: Template literal without SQL keywords (safe)',
    },

    // Python - Additional Edge Cases
    {
      code: 'query = f"UPDATE users SET name={name}, email={email} WHERE id={user_id} OR 1=1"',
      language: 'python',
      shouldDetect: true,
      description: 'Python: Complex f-string with multiple variables (detected)',
    },
    {
      code: 'sql = "ALTER TABLE users ADD COLUMN %s %s" % (column_name, column_type)',
      language: 'python',
      shouldDetect: true,
      description: 'Python: ALTER TABLE with % operator (detected)',
    },
    {
      code: 'query = f"EXECUTE IMMEDIATE \'DROP TABLE {table_name}\'"',
      language: 'python',
      shouldDetect: true,
      description: 'Python: EXECUTE IMMEDIATE with f-string (detected)',
    },
    {
      code: 'message = f"Hello {username}, your balance is ${balance}"',
      language: 'python',
      shouldDetect: false,
      description: 'Python: f-string without SQL keywords (safe)',
    },
    {
      code: 'query = "SELECT * FROM users WHERE id = %(user_id)s"',
      language: 'python',
      shouldDetect: false,
      description: 'Python: Named parameter placeholder (safe)',
    },

    // Java - Additional Edge Cases
    {
      code: 'String sql = String.format("TRUNCATE TABLE %s; INSERT INTO %s VALUES (%d)", table1, table2, value);',
      language: 'java',
      shouldDetect: true,
      description: 'Java: Multiple SQL operations with String.format (detected)',
    },
    {
      code: 'String query = "ALTER TABLE users ADD " + columnDef + " " + dataType;',
      language: 'java',
      shouldDetect: true,
      description: 'Java: ALTER TABLE with concatenation (detected)',
    },
    {
      code: 'StringBuilder sb = new StringBuilder("SELECT * FROM users WHERE id = ").append(userId);',
      language: 'java',
      shouldDetect: false,
      description: 'Java: StringBuilder pattern (not detected by current regex)',
    },
    {
      code: 'String message = String.format("Hello %s, welcome!", userName);',
      language: 'java',
      shouldDetect: false,
      description: 'Java: String.format without SQL keywords (safe)',
    },

    // PHP - Additional Edge Cases
    {
      code: '$query = "DROP DATABASE " . $dbName . "; CREATE DATABASE " . $newDb;',
      language: 'php',
      shouldDetect: true,
      description: 'PHP: Multiple database operations with concatenation (detected)',
    },
    {
      code: '$sql = "TRUNCATE TABLE {$tableName}; INSERT INTO logs VALUES ({$logData})";',
      language: 'php',
      shouldDetect: true,
      description: 'PHP: Multiple operations with brace interpolation (detected)',
    },
    {
      code: '$query = \'SELECT * FROM users WHERE name = \' . $userName . \' AND active = 1\';',
      language: 'php',
      shouldDetect: true,
      description: 'PHP: Single quotes with concatenation (detected)',
    },
    {
      code: '$message = "Hello $userName, your order #$orderId is ready";',
      language: 'php',
      shouldDetect: false,
      description: 'PHP: String interpolation without SQL keywords (safe)',
    },
    {
      code: '$stmt = $pdo->prepare("INSERT INTO users (name, email) VALUES (?, ?)");',
      language: 'php',
      shouldDetect: false,
      description: 'PHP: INSERT with prepared statement placeholders (safe)',
    },

    // Cross-language SQL Keywords Testing
    {
      code: 'const query = `GRANT ALL PRIVILEGES ON database.* TO ${username}@${host}`;',
      language: 'javascript',
      shouldDetect: false,
      description: 'JS: GRANT statement (not in current keyword list)',
    },
    {
      code: 'query = f"REVOKE SELECT ON {table_name} FROM {user_name}"',
      language: 'python',
      shouldDetect: false,
      description: 'Python: REVOKE statement (not in current keyword list)',
    },

    // Case sensitivity tests
    {
      code: 'const query = `select * from users where id = ${userId}`;',
      language: 'javascript',
      shouldDetect: true,
      description: 'JS: Lowercase SQL keywords (detected)',
    },
    {
      code: 'query = f"Insert Into logs (message) Values ({log_msg})"',
      language: 'python',
      shouldDetect: true,
      description: 'Python: Mixed case SQL keywords (detected)',
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