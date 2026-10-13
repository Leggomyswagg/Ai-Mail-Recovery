import { CheckCircle2 } from 'lucide-react'

export default function StepCard({ index, text, checked, onToggle }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={`Step ${index + 1}: ${text}`}
      onClick={onToggle}
      className="group w-full text-left flex items-start gap-4 p-5 rounded-xl border cursor-pointer transition-all duration-200 select-none focus-visible:outline focus-visible:outline-electric-500"
      style={{
        background: checked
          ? 'rgba(16,185,129,0.06)'
          : 'rgba(30,41,59,0.6)',
        borderColor: checked
          ? 'rgba(16,185,129,0.35)'
          : 'rgba(51,65,85,0.7)',
        boxShadow: checked ? '0 0 12px rgba(16,185,129,0.08)' : 'none',
      }}
    >
      {/* Step number / check icon */}
      <div className="shrink-0 mt-0.5">
        {checked ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-400 transition-transform duration-150 scale-110" />
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-electric-500/50 bg-electric-500/10 flex items-center justify-center group-hover:border-electric-500 transition-colors">
            <span className="text-xs font-bold text-electric-400">
              {index + 1}
            </span>
          </div>
        )}
      </div>

      {/* Step text */}
      <p
        className="min-w-0 break-words text-sm sm:text-base leading-relaxed transition-colors"
        style={{
          color: checked ? 'rgb(100 116 139)' : 'rgb(226 232 240)',
          textDecoration: checked ? 'line-through' : 'none',
        }}
      >
        {text}
      </p>
    </button>
  )
}
