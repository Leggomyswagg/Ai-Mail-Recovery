import { useRef, useState } from 'react'
import Landing from './pages/Landing'
import ProblemForm from './pages/ProblemForm'
import Paywall from './pages/Paywall'
import RecoveryPlan from './pages/RecoveryPlan'
import { getFallbackSteps, parseRecoverySteps } from './lib/recovery'

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
  const [source, setSource] = useState('guide')
  const requestRef = useRef(null)

  function handleProviderSelect(selectedProvider) {
    setProvider(selectedProvider)
    setFormData(null)
    setPage(PAGES.PROBLEM_FORM)
  }

  async function handleFormSubmit(data) {
    setFormData(data)
    setPage(PAGES.PAYWALL)
  }

  async function handleUnlock() {
    setIsGenerating(true)
    setPage(PAGES.RECOVERY_PLAN)

    requestRef.current?.abort()
    const controller = new AbortController()
    requestRef.current = controller
    const timer = setTimeout(() => controller.abort(), 20000)
    let result = { steps: getFallbackSteps(provider, formData.problem), source: 'guide' }
    setRecoverySteps([])
    try {
      const response = await fetch('/api/recovery-plan', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        // The email address remains in this browser and is not sent to the AI.
        body: JSON.stringify({ provider, problem: formData.problem, details: formData.details }),
        signal: controller.signal,
      })
      if (response.ok) {
        const data = await response.json()
        result = { steps: parseRecoverySteps(JSON.stringify(data.steps)), source: data.source === 'ai' ? 'ai' : 'guide' }
      }
    } catch {
      // Static hosts, timeouts, and invalid AI responses use provider guidance.
    } finally {
      clearTimeout(timer)
      // Start Over or a newer request must not receive stale results.
      if (requestRef.current === controller) {
        setRecoverySteps(result.steps)
        setSource(result.source)
        setIsGenerating(false)
        requestRef.current = null
      }
    }
  }

  function handleRestart() {
    const request = requestRef.current
    requestRef.current = null
    request?.abort()
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
          initialData={formData}
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
          source={source}
          isGenerating={isGenerating}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}
