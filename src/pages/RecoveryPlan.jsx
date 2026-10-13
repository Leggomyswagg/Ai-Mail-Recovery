import { useState } from 'react'
import { RotateCcw, Download, Zap, CheckCircle2, Mail } from 'lucide-react'
import ProgressBar from '../components/ProgressBar'
import StepCard from '../components/StepCard'

const PROBLEM_LABELS = {
  forgot_password: 'Forgot Password',
  account_hacked: 'Account Hacked',
  lost_2fa: 'Lost 2FA / Phone Access',
  account_locked: 'Account Locked',
  other: 'Access Issue',
}

export default function RecoveryPlan({
  provider,
  formData,
  steps,
  source,
  isGenerating,
  onRestart,
}) {
  const [checked, setChecked] = useState({})

  const completedCount = Object.values(checked).filter(Boolean).length
  const total = steps.length
  const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0
  const allDone = total > 0 && completedCount === total

  function toggleStep(index) {
    setChecked((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const problemLabel = PROBLEM_LABELS[formData?.problem] ?? 'Access Issue'

  return (
    <div className="page-enter min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center px-6 py-5 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-electric-500 flex items-center justify-center">
            <Mail className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white">
            Email<span className="text-electric-500">Rescue</span>
          </span>
        </div>
        <button
          onClick={onRestart}
          className="ml-auto flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </button>
      </nav>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-electric-500/15 border border-electric-500/30 text-electric-400 text-sm font-medium mb-4">
            <Zap className="w-3.5 h-3.5" />
            {provider} · {problemLabel}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
            Your Recovery Plan
          </h2>
          <p className="text-slate-400 text-sm">
            {formData?.email} &mdash; Follow each step in order and check them
            off as you go.
          </p>
          {!isGenerating && <p className="mt-3 text-xs text-slate-400">{source === 'ai' ? 'AI-generated guidance — review each step on your provider’s official website.' : 'Provider recovery guidance — a general checklist for your selected problem.'} Only your email provider can restore access.</p>}
        </div>

        {/* Progress */}
        {!isGenerating && total > 0 && (
          <div className="mb-8">
            <ProgressBar progress={progress} completed={completedCount} total={total} />
          </div>
        )}

        {/* Completion banner */}
        {allDone && (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 mb-6 animate-fade-in">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <p className="font-semibold text-emerald-300">
                All steps completed!
              </p>
              <p className="text-emerald-400/70 text-sm">
                This checklist does not confirm account access. If recovery
                succeeded, update your password and review two-factor authentication.
              </p>
            </div>
          </div>
        )}

        {/* Steps */}
        {isGenerating ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-3">
            {steps.map((step, i) => (
              <StepCard
                key={i}
                index={i}
                text={step}
                checked={!!checked[i]}
                onToggle={() => toggleStep(i)}
              />
            ))}
          </div>
        )}

        {/* Footer actions */}
        {!isGenerating && total > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onRestart}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition-colors font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              New Recovery
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-electric-500/40 text-electric-400 hover:border-electric-500 hover:bg-electric-500/10 transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              Save / Print
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-4 p-5 rounded-xl bg-[#1e293b]/60 border border-slate-800"
        >
          <div className="w-8 h-8 rounded-full bg-slate-700 shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div
              className="h-3 rounded bg-slate-700"
              style={{ width: `${65 + (i % 3) * 10}%` }}
            />
            <div
              className="h-3 rounded bg-slate-800"
              style={{ width: `${40 + (i % 4) * 8}%` }}
            />
          </div>
        </div>
      ))}
      <p className="text-center text-slate-500 text-sm pt-2 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-electric-500 animate-bounce" />
        Generating your personalized recovery plan…
      </p>
    </div>
  )
}
