import express, { Request, Response } from 'express';
import { analyzeCode } from '../services/codeAnalysis';
import { generateReport } from '../services/reportGenerator';

const router = express.Router();

// POST /api/code-review/analyze
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { code, language } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Code and language are required'
      });
    }

    const analysisResults = await analyzeCode(code, language);
    res.json(analysisResults);
  } catch (error) {
    console.error('Error analyzing code:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

// POST /api/code-review/generate-report
router.post('/generate-report', async (req: Request, res: Response) => {
  try {
    const { analysisResults } = req.body;
    
    if (!analysisResults) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Analysis results are required'
      });
    }

    const reportBuffer = await generateReport(analysisResults);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=security-report.pdf');
    res.send(reportBuffer);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

export const codeReviewRouter = router; 