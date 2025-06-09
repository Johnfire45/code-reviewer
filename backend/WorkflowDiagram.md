# Secure Code Review Workflow Diagram

Below is a mermaid diagram illustrating the workflow of our secure code review backend:

```mermaid
graph TD
    A[User Uploads Code or Repo Link] --> B[POST /api/review]
    B --> C[Code Review Service]
    C --> D[Vulnerabilities Module]
    D --> D1[OWASP A1: Injection (injection.ts)]
    D --> D2[OWASP A2: Broken Auth (brokenAuth.ts)]
    D --> D3[OWASP A3: Sensitive Data Exposure (sensitiveData.ts)]
    D --> D4[OWASP A4: XXE (xxe.ts)]
    D --> D5[OWASP A5: Broken Access Control (brokenAccess.ts)]
    D --> D6[OWASP A6: Security Misconfiguration (misconfig.ts)]
    D --> D7[OWASP A7: XSS (xss.ts)]
    D --> D8[OWASP A8: Insecure Deserialization (deserialization.ts)]
    D --> D9[OWASP A9: Using Components with Known Vulnerabilities (dependencyMgmt.ts)]
    D --> D10[OWASP A10: Insufficient Logging (logging.ts)]
    D --> D11[Additional Checks (e.g., csrf.ts, codeExecution.ts, businessLogic.ts, codeQuality.ts)]
    D1 --> E[Aggregate Scan Results]
    D2 --> E
    D3 --> E
    D4 --> E
    D5 --> E
    D6 --> E
    D7 --> E
    D8 --> E
    D9 --> E
    D10 --> E
    D11 --> E
    E --> F[Store Scan Results (ScanResult Model)]
    F --> G[Redirect User to Results Page (GET /api/review/:id)]
    G --> H[User Views Scan Summary & Log]
    H --> I[Generate PDF Report (GET /api/review/:id/report)]
    I --> J[User Downloads PDF Report]
``` 