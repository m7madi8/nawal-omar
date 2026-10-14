import {
  readExplicitDeploymentModeEnv,
  resolveDeploymentMode,
  validateDeploymentModeForPayments,
} from '../../deployment-mode.js';
import { getHypPayConfig, isHypPayConfigured, isHypTestTerminal } from './config.js';

/**
 * Hyp Pay staging/production terminal guard (uses existing isHypTestTerminal — Masof prefix 00100).
 * Does not trust HYP_ENVIRONMENT alone.
 *
 * @returns {{ ok: true } | { ok: false, code: string }}
 */
export function validateHypTerminalForDeployment() {
  if (!isHypPayConfigured()) {
    return { ok: false, code: 'HYP_NOT_CONFIGURED' };
  }

  const deployment = validateDeploymentModeForPayments();
  if (!deployment.ok) {
    return { ok: false, code: deployment.code };
  }

  const mode = deployment.mode;
  const { masof } = getHypPayConfig();
  const testTerminal = isHypTestTerminal(masof);

  if (mode === 'staging' || mode === 'development') {
    if (!testTerminal) {
      return { ok: false, code: 'HYP_LIVE_TERMINAL_FORBIDDEN' };
    }
    return { ok: true };
  }

  if (mode === 'production') {
    if (testTerminal) {
      return { ok: false, code: 'HYP_TEST_TERMINAL_IN_PRODUCTION' };
    }
    return { ok: true };
  }

  return { ok: false, code: 'DEPLOYMENT_MODE_INVALID' };
}

export function assertHypPaymentDeploymentAllowed() {
  const result = validateHypTerminalForDeployment();
  if (!result.ok) {
    const error = new Error('Hyp Pay is not allowed in this deployment configuration');
    error.code = result.code;
    throw error;
  }
}

export function describeHypDeploymentGuard() {
  return {
    deploymentMode: resolveDeploymentMode(),
    explicitDeploymentMode: readExplicitDeploymentModeEnv(),
    testTerminal: isHypTestTerminal(getHypPayConfig().masof),
  };
}
