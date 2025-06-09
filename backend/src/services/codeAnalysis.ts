import { VulnerabilityCheck } from '../types/vulnerability';
import { checkSQLInjection } from './checks/sqlInjection';
import { checkXSS } from './checks/xss';
import { checkCSRF } from './checks/csrf';
import { checkInsecureDeserialization } from './checks/insecureDeserialization';
import { checkBrokenAuth } from './checks/brokenAuth';
import { checkSensitiveDataExposure } from './checks/sensitiveDataExposure';
import { checkMissingAccessControl } from './checks/missingAccessControl';
import { checkSecurityMisconfiguration } from './checks/securityMisconfiguration';
import { checkInsecureDependencies } from './checks/insecureDependencies';
import { checkInsufficientLogging } from './checks/insufficientLogging';

export interface AnalysisResult {
  vulnerabilities: VulnerabilityCheck[];
  summary: {
    totalIssues: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
  };
}

export async function analyzeCode(code: string, language: string): Promise<AnalysisResult> {
  // Run all vulnerability checks in parallel
  const vulnerabilityChecks = await Promise.all([
    checkSQLInjection(code, language),
    checkXSS(code, language),
    checkCSRF(code, language),
    checkInsecureDeserialization(code, language),
    checkBrokenAuth(code, language),
    checkSensitiveDataExposure(code, language),
    checkMissingAccessControl(code, language),
    checkSecurityMisconfiguration(code, language),
    checkInsecureDependencies(code, language),
    checkInsufficientLogging(code, language)
  ]);

  // Filter out null results (checks that don't apply to the language)
  const vulnerabilities = vulnerabilityChecks.filter((check): check is VulnerabilityCheck => check !== null);

  // Calculate summary statistics
  const summary = {
    totalIssues: vulnerabilities.length,
    criticalIssues: vulnerabilities.filter(v => v.severity === 'critical').length,
    highIssues: vulnerabilities.filter(v => v.severity === 'high').length,
    mediumIssues: vulnerabilities.filter(v => v.severity === 'medium').length,
    lowIssues: vulnerabilities.filter(v => v.severity === 'low').length
  };

  return {
    vulnerabilities,
    summary
  };
} 