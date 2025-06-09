import PDFDocument from 'pdfkit';
import { AnalysisResult } from './codeAnalysis';

export async function generateReport(analysisResult: AnalysisResult): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      // Collect PDF chunks
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Add title
      doc.fontSize(24).text('Security Code Review Report', { align: 'center' });
      doc.moveDown();

      // Add summary
      doc.fontSize(18).text('Summary');
      doc.fontSize(12);
      doc.text(`Total Issues: ${analysisResult.summary.totalIssues}`);
      doc.text(`Critical Issues: ${analysisResult.summary.criticalIssues}`);
      doc.text(`High Issues: ${analysisResult.summary.highIssues}`);
      doc.text(`Medium Issues: ${analysisResult.summary.mediumIssues}`);
      doc.text(`Low Issues: ${analysisResult.summary.lowIssues}`);
      doc.moveDown();

      // Add detailed findings
      doc.fontSize(18).text('Detailed Findings');
      doc.moveDown();

      analysisResult.vulnerabilities.forEach((vulnerability, index) => {
        doc.fontSize(14).text(`${index + 1}. ${vulnerability.name} (${vulnerability.severity.toUpperCase()})`);
        doc.fontSize(12);
        doc.text(`Category: ${vulnerability.category}`);
        if (vulnerability.owaspCategory) {
          doc.text(`OWASP Category: ${vulnerability.owaspCategory}`);
        }
        if (vulnerability.cweId) {
          doc.text(`CWE ID: ${vulnerability.cweId}`);
        }
        doc.moveDown();
        doc.text('Description:');
        doc.text(vulnerability.description);
        doc.moveDown();
        doc.text('Recommendation:');
        doc.text(vulnerability.recommendation);
        doc.moveDown();

        if (vulnerability.locations.length > 0) {
          doc.text('Vulnerable Locations:');
          vulnerability.locations.forEach((location, locIndex) => {
            doc.text(`Location ${locIndex + 1}:`);
            doc.text(`Line: ${location.line}, Column: ${location.column}`);
            doc.text('Code Snippet:');
            doc.text(location.snippet, { indent: 20 });
            doc.moveDown();
          });
        }

        doc.moveDown(2);
      });

      // Add footer
      const date = new Date().toLocaleDateString();
      doc.fontSize(10).text(`Generated on: ${date}`, { align: 'center' });

      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
} 