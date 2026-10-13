export const PROVIDERS = ['Gmail', 'iCloud', 'Yahoo']
export const PROBLEMS = ['forgot_password', 'account_hacked', 'lost_2fa', 'account_locked', 'other']

export function validateRequest(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid request')
  if (!PROVIDERS.includes(input.provider)) throw new Error('Select a supported provider')
  if (!PROBLEMS.includes(input.problem)) throw new Error('Select a supported problem')
  if (input.details !== undefined && (typeof input.details !== 'string' || input.details.length > 1000)) {
    throw new Error('Details must contain at most 1000 characters')
  }
  return { provider: input.provider, problem: input.problem, details: input.details?.trim() || '' }
}

export function parseRecoverySteps(text) {
  const cleaned = text.trim().replace(/^```(?:json)?\s*|\s*```$/g, '')
  let steps
  try { steps = JSON.parse(cleaned) }
  catch { steps = cleaned.split('\n').map(line => line.match(/^\s*\d+[.)]\s+(.+)/)?.[1]).filter(Boolean) }
  if (!Array.isArray(steps) || steps.length < 3 || steps.length > 12 || steps.some(step => typeof step !== 'string' || !step.trim() || step.length > 600)) {
    throw new Error('No usable recovery steps returned')
  }
  return steps.map(step => step.trim())
}

export function getFallbackSteps(provider, problem) {
  const guides = {
    Gmail: [
      'Open Google’s official recovery page: https://accounts.google.com/signin/recovery.',
      'Use a familiar device, browser, and location if possible. Enter the account you are trying to recover.',
      'Follow the verification options Google offers. Only enter codes on Google’s official website.',
      'If a recovery method is unavailable, choose another method when offered. See https://support.google.com/accounts/answer/7299973 for recovery tips.',
      'If access is restored, review https://myaccount.google.com/security-checkup, change your password, and update your recovery contact details.',
      'Review two-step verification and save backup codes securely. Google alone decides whether your account can be restored.',
    ],
    iCloud: [
      'Open Apple’s official recovery page: https://iforgot.apple.com.',
      'Enter your Apple Account and follow the reset or verification options Apple provides.',
      'If you still have a trusted Apple device, check whether you can reset your password in its account settings.',
      'If account recovery is offered, follow Apple’s waiting instructions. Check its status at https://iforgot.apple.com.',
      'When access is restored, review your account at https://account.apple.com and update trusted phone numbers and your password.',
      'Review two-factor authentication and recovery contacts. Apple alone decides whether your account can be restored.',
    ],
    Yahoo: [
      'Open Yahoo’s official Sign-in Helper: https://login.yahoo.com/forgot.',
      'Enter your account or recovery email address or phone number.',
      'Choose an available verification option. Only enter verification codes on Yahoo’s official website.',
      'If none of the listed methods is accessible, consult https://help.yahoo.com for the options available to your account and region.',
      'When access is restored, update your password and recovery information in Yahoo account security settings.',
      'Review connected apps and sign-in activity. Yahoo alone decides whether your account can be restored.',
    ],
  }
  const problemSteps = {
    account_hacked: 'If another person may control the account, also secure your recovery email and phone. After regaining access, review forwarding rules, sessions, and connected apps.',
    lost_2fa: 'Check for an already signed-in trusted device, recovery contact, or previously saved backup code. Never share passwords or codes with anyone offering to recover the account.',
    account_locked: 'If the provider says the account is suspended or disabled, follow its official appeal instructions. A password reset may not remove a suspension.',
  }
  const steps = guides[provider]
  if (!steps) throw new Error('Unsupported provider')
  return problemSteps[problem] ? [problemSteps[problem], ...steps] : [...steps]
}
