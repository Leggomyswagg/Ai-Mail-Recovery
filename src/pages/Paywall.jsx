import { ChevronLeft, Lock, Zap, CheckCircle, ShieldCheck, Mail } from 'lucide-react'

const PROBLEM_LABELS = {
  forgot_password: 'Forgot Password',
  account_hacked: 'Account Hacked',
  lost_2fa: 'Lost 2FA / Phone Access',
  account_locked: 'Account Locked',
  other: 'Access Issue',
}

const FEATURES = [
  'Step-by-step AI-personalized recovery plan',
  'Specific instructions for ' + 'your provider',
  'Troubleshooting tips if steps fail',
  'Security hardening advice post-recovery',
  'Instant access — no waiting',
]

export default function Paywall({ provider, formData, onUnlock, onBack }) {
  const problemLabel = PROBLEM_LABELS[formData?.problem] ?? 'Access Issue'

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
        <div className="w-full max-w-md">
          {/* Tease preview */}
          <div className="relative mb-8 rounded-2xl border border-slate-700/60 bg-[#1e293b]/70 overflow-hidden">
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-electric-400" />
                <span className="text-sm font-semibold text-electric-400 uppercase tracking-wide">
                  Your Recovery Plan
                </span>
              </div>
              {[
                'Verify your identity through account recovery page…',
                'Check your backup recovery email or phone…',
                'Submit a support request with proof of ownership…',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 opacity-60">
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-electric-500/20 text-electric-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-slate-300 text-sm leading-relaxed line-clamp-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Blur overlay */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-end pb-5"
              style={{
                background:
                  'linear-gradient(to bottom, transparent 15%, #0f172a 65%)',
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#1e293b] border border-slate-600 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-slate-400 text-sm">
                  {provider} · {problemLabel}
                </p>
              </div>
            </div>
          </div>

          {/* Paywall card */}
          <div
            className="rounded-2xl border p-6 mb-6"
            style={{
              background: 'rgba(30,41,59,0.8)',
              borderColor: 'rgba(59,130,246,0.3)',
              boxShadow: '0 0 40px rgba(59,130,246,0.12)',
            }}
          >
            <div className="text-center mb-6">
              <p className="text-slate-400 text-sm mb-1">One-time payment</p>
              <div className="flex items-end justify-center gap-1">
                <span className="text-5xl font-extrabold text-white">$9</span>
                <span className="text-2xl font-bold text-white mb-1">.99</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-2">
                Unlock Your Full Recovery Plan
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Personalized for your {provider} account
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-6">
              {FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-slate-300 text-sm">
                    {i === 1 ? f.replace('your provider', provider) : f}
                  </span>
                </li>
              ))}
            </ul>

            {/* Stripe placeholder button */}
            <button
              onClick={onUnlock}
              className="w-full py-4 rounded-xl font-bold text-lg text-white flex items-center justify-center gap-2.5 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                boxShadow: '0 0 28px rgba(59,130,246,0.45)',
              }}
            >
              <Lock className="w-5 h-5" />
              Pay $9.99 &amp; Get Instant Access
            </button>

            <p className="text-center text-slate-500 text-xs mt-3 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secured by Stripe · 30-day money-back guarantee
            </p>
          </div>

          <p className="text-center text-slate-600 text-xs">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </main>
    </div>
  )
}
