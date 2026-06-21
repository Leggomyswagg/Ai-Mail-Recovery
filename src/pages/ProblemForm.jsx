import { useState } from 'react'
import { ChevronLeft, ChevronDown, Send, Mail } from 'lucide-react'

const PROBLEMS = [
  { value: 'forgot_password', label: 'Forgot password' },
  { value: 'account_hacked', label: 'Account hacked' },
  { value: 'lost_2fa', label: 'Lost access to phone / 2FA' },
  { value: 'account_locked', label: 'Account locked or suspended' },
  { value: 'other', label: 'Other' },
]

export default function ProblemForm({ provider, onSubmit, onBack }) {
  const [problem, setProblem] = useState('')
  const [email, setEmail] = useState('')
  const [details, setDetails] = useState('')
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!problem) e.problem = 'Please select what happened'
    if (!email) e.email = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = 'Enter a valid email address'
    return e
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      return
    }
    onSubmit({ problem, email, details })
  }

  const selectedLabel = PROBLEMS.find((p) => p.value === problem)?.label

  return (
    <div className="page-enter min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center px-6 py-5 max-w-2xl mx-auto w-full">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-2 mx-auto">
          <div className="w-7 h-7 rounded-lg bg-electric-500 flex items-center justify-center">
            <Mail className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white">
            Email<span className="text-electric-500">Rescue</span>
          </span>
        </div>
        <div className="w-16" />
      </nav>

      <main className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Provider badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-electric-500/15 border border-electric-500/30 text-electric-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-electric-500 animate-pulse-slow" />
            {provider} Recovery
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-2">
            Tell us what happened
          </h2>
          <p className="text-slate-400 mb-8">
            We'll use this to generate a personalized recovery plan for your
            account.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Problem dropdown */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                What happened? <span className="text-electric-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={problem}
                  onChange={(e) => {
                    setProblem(e.target.value)
                    setErrors((prev) => ({ ...prev, problem: undefined }))
                  }}
                  className="w-full appearance-none bg-[#1e293b] border border-slate-700 text-white rounded-xl px-4 py-3.5 pr-10 focus:outline-none focus:border-electric-500 focus:ring-1 focus:ring-electric-500 transition-colors cursor-pointer"
                >
                  <option value="" disabled>
                    Select the problem...
                  </option>
                  {PROBLEMS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              {errors.problem && (
                <p className="mt-1.5 text-sm text-rose-400">{errors.problem}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Your {provider} email address{' '}
                <span className="text-electric-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setErrors((prev) => ({ ...prev, email: undefined }))
                }}
                placeholder={`you@${provider.toLowerCase()}.com`}
                className="w-full bg-[#1e293b] border border-slate-700 text-white placeholder-slate-600 rounded-xl px-4 py-3.5 focus:outline-none focus:border-electric-500 focus:ring-1 focus:ring-electric-500 transition-colors"
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-rose-400">{errors.email}</p>
              )}
            </div>

            {/* Details */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Additional details{' '}
                <span className="text-slate-500 font-normal">(optional)</span>
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="E.g. I lost my old phone, my account was sending spam, I haven't logged in for 2 years..."
                rows={4}
                className="w-full bg-[#1e293b] border border-slate-700 text-white placeholder-slate-600 rounded-xl px-4 py-3.5 focus:outline-none focus:border-electric-500 focus:ring-1 focus:ring-electric-500 transition-colors resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-lg text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                boxShadow: '0 0 24px rgba(59,130,246,0.4)',
              }}
            >
              <Send className="w-5 h-5" />
              Get My Recovery Plan
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
