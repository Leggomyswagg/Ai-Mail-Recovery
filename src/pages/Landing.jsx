import { Shield, Mail, ArrowRight, CheckCircle, Zap, Lock } from 'lucide-react'
import { useState } from 'react'

const PROVIDERS = [
  {
    name: 'Gmail',
    color: '#EA4335',
    bg: 'rgba(234,67,53,0.12)',
    border: 'rgba(234,67,53,0.35)',
    icon: GmailIcon,
  },
  {
    name: 'iCloud',
    color: '#157EFB',
    bg: 'rgba(21,126,251,0.12)',
    border: 'rgba(21,126,251,0.35)',
    icon: IcloudIcon,
  },
  {
    name: 'Yahoo',
    color: '#720e9e',
    bg: 'rgba(114,14,158,0.12)',
    border: 'rgba(114,14,158,0.35)',
    icon: YahooIcon,
  },
]

const TRUST_ITEMS = [
  { icon: Zap, text: 'Free recovery guide' },
  { icon: Shield, text: 'Official recovery options' },
  { icon: Lock, text: 'No passwords requested' },
]

export default function Landing({ onProviderSelect }) {
  const [selected, setSelected] = useState(null)

  function handleStart() {
    if (selected) onProviderSelect(selected)
  }

  return (
    <div className="page-enter min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-electric-500 flex items-center justify-center glow-blue-sm">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Email<span className="text-electric-500">Rescue</span>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-sm text-slate-400">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Trusted by 50,000+ users</span>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-electric-500/30 bg-electric-500/10 text-electric-400 text-sm font-medium mb-8">
          <Zap className="w-3.5 h-3.5" />
          AI-Powered Recovery · Works in Minutes
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5 max-w-3xl">
          Get an Email Account{' '}
          <span className="text-electric-500">Recovery Guide</span>
        </h1>

        <p className="text-slate-400 text-lg sm:text-xl max-w-xl mb-12 leading-relaxed">
          Find recovery steps for your provider and situation. Your email
          provider controls verification and whether access can be restored.
        </p>

        {/* Provider cards */}
        <div className="mb-10 w-full max-w-lg">
          <p className="text-slate-400 text-sm font-medium mb-4 uppercase tracking-widest">
            Select your email provider
          </p>
          <div className="grid grid-cols-3 gap-4">
            {PROVIDERS.map((p) => {
              const Icon = p.icon
              const isSelected = selected === p.name
              return (
                <button
                  key={p.name}
                  onClick={() => setSelected(p.name)}
                  className="relative flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all duration-200 cursor-pointer group"
                  style={{
                    background: isSelected ? p.bg : 'rgba(30,41,59,0.5)',
                    borderColor: isSelected ? p.border : 'rgba(51,65,85,0.6)',
                    boxShadow: isSelected
                      ? `0 0 20px ${p.color}30`
                      : 'none',
                  }}
                >
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-electric-500 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <Icon size={36} />
                  <span className="text-sm font-semibold text-slate-200">
                    {p.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleStart}
          disabled={!selected}
          className="group flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: selected
              ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
              : '#1e293b',
            boxShadow: selected ? '0 0 28px rgba(59,130,246,0.45)' : 'none',
          }}
        >
          Start Recovery
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Trust bar */}
        <div className="flex flex-wrap justify-center gap-6 mt-14 text-slate-500 text-sm">
          {TRUST_ITEMS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5">
              <Icon className="w-4 h-4 text-electric-400" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-slate-600 text-xs py-6">
        © 2025 EmailRescue. Not affiliated with Google, Apple, or Yahoo.
      </footer>
    </div>
  )
}

function GmailIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M6 12l18 12L42 12" stroke="#EA4335" strokeWidth="3" strokeLinejoin="round" />
      <rect x="6" y="12" width="36" height="26" rx="2" stroke="#EA4335" strokeWidth="3" fill="none" />
      <path d="M6 12l18 12 18-12" fill="#EA4335" fillOpacity="0.15" />
    </svg>
  )
}

function IcloudIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M36 34H14a8 8 0 110-16 8 8 0 0115.5-3A8 8 0 1136 34z"
        stroke="#157EFB"
        strokeWidth="3"
        fill="none"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function YahooIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <text x="50%" y="72%" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#720e9e" fontFamily="Arial, sans-serif">
        Y!
      </text>
    </svg>
  )
}
