import { useState } from 'react'
import Landing from './pages/Landing'
import ProblemForm from './pages/ProblemForm'
import Paywall from './pages/Paywall'
import RecoveryPlan from './pages/RecoveryPlan'

const PAGES = {
  LANDING: 'landing',
  PROBLEM_FORM: 'problem_form',
  PAYWALL: 'paywall',
  RECOVERY_PLAN: 'recovery_plan',
}

export default function App() {
  const [page, setPage] = useState(PAGES.LANDING)
  const [provider, setProvider] = useState(null)
  const [formData, setFormData] = useState(null)
  const [recoverySteps, setRecoverySteps] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)

  function handleProviderSelect(selectedProvider) {
    setProvider(selectedProvider)
    setPage(PAGES.PROBLEM_FORM)
  }

  async function handleFormSubmit(data) {
    setFormData(data)
    setPage(PAGES.PAYWALL)
  }

  async function handleUnlock() {
    setIsGenerating(true)
    setPage(PAGES.RECOVERY_PLAN)

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
      const prompt = buildPrompt(provider, formData)

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1500,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const json = await response.json()
      const text = json.content?.[0]?.text ?? ''
      const steps = parseSteps(text)
      setRecoverySteps(steps)
    } catch (err) {
      console.error('Recovery generation failed:', err)
      setRecoverySteps(getFallbackSteps(provider, formData?.problem))
    } finally {
      setIsGenerating(false)
    }
  }

  function handleRestart() {
    setPage(PAGES.LANDING)
    setProvider(null)
    setFormData(null)
    setRecoverySteps([])
    setIsGenerating(false)
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {page === PAGES.LANDING && (
        <Landing onProviderSelect={handleProviderSelect} />
      )}
      {page === PAGES.PROBLEM_FORM && (
        <ProblemForm
          provider={provider}
          onSubmit={handleFormSubmit}
          onBack={() => setPage(PAGES.LANDING)}
        />
      )}
      {page === PAGES.PAYWALL && (
        <Paywall
          provider={provider}
          formData={formData}
          onUnlock={handleUnlock}
          onBack={() => setPage(PAGES.PROBLEM_FORM)}
        />
      )}
      {page === PAGES.RECOVERY_PLAN && (
        <RecoveryPlan
          provider={provider}
          formData={formData}
          steps={recoverySteps}
          isGenerating={isGenerating}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}

function buildPrompt(provider, formData) {
  return `You are an expert email account recovery specialist. A user needs help recovering their ${provider} email account.

Problem type: ${formData?.problem}
Email address: ${formData?.email}
Additional details: ${formData?.details || 'None provided'}

Please provide a clear, numbered step-by-step recovery plan specifically for ${provider} with this exact problem.

Format your response as a numbered list (1. 2. 3. etc.) with each step on its own line. Be specific, actionable, and include any relevant URLs or contact information for ${provider}'s support. Aim for 6-10 practical steps. Do not include any introduction or conclusion — just the numbered steps.`
}

function parseSteps(text) {
  const lines = text.split('\n').filter(Boolean)
  const steps = []

  for (const line of lines) {
    const match = line.match(/^\s*(\d+)[.)]\s+(.+)/)
    if (match) {
      steps.push(match[2].trim())
    }
  }

  if (steps.length === 0) {
    const paragraphs = text.split('\n\n').filter(Boolean)
    return paragraphs.map((p) => p.replace(/^\s*[-•*]\s*/, '').trim())
  }

  return steps
}

function getFallbackSteps(provider, problem) {
  const base = {
    Gmail: [
      'Go to accounts.google.com/signin/recovery',
      "Click 'Forgot email?' or 'Forgot password?' depending on your situation",
      'Enter a recovery email address or phone number associated with your account',
      'Follow the verification steps Google sends to your recovery contact',
      'If you cannot access recovery options, click "Try another way"',
      "Complete Google's identity verification questions about your account history",
      "Once access is restored, immediately update your password to something strong and unique",
      'Enable 2-Factor Authentication to prevent future lockouts',
      'Review and update your recovery options under Security settings',
    ],
    iCloud: [
      'Visit iforgot.apple.com to begin the recovery process',
      'Enter your Apple ID email address and click Continue',
      'Choose a reset method: email, phone number, or security questions',
      'If those options fail, select "Unable to use these options?"',
      'Apply for Account Recovery — Apple will verify your identity over several days',
      'Ensure your trusted devices are nearby during the process',
      "Once recovered, go to appleid.apple.com to update your password",
      'Set up or review your trusted phone numbers and recovery email',
      'Enable two-factor authentication if not already active',
    ],
    Yahoo: [
      'Go to login.yahoo.com and click "Trouble signing in?"',
      'Enter your Yahoo email address and click Continue',
      "Choose 'I forgot my password' and select a verification method",
      'Check for a verification code sent to your recovery email or phone',
      'If you lack access to those, click "I don\'t have access to these"',
      "Use Yahoo's Account Key or answer your security questions",
      "Submit an account recovery request through Yahoo's help center if needed",
      'Once access is restored, change your password immediately',
      'Update your recovery phone number and email in account security settings',
      'Review connected apps and revoke any suspicious third-party access',
    ],
  }

  return base[provider] || base.Gmail
}
