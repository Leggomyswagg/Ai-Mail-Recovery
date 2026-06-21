export default function ProgressBar({ progress, completed, total }) {
  const isComplete = progress === 100

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-400">
          Progress — {completed} of {total} steps done
        </span>
        <span
          className="text-sm font-bold tabular-nums transition-colors"
          style={{ color: isComplete ? '#34d399' : '#3b82f6' }}
        >
          {progress}%
        </span>
      </div>

      <div className="relative h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
        {/* Track glow */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: isComplete
              ? 'linear-gradient(90deg, #10b981, #34d399)'
              : 'linear-gradient(90deg, #2563eb, #3b82f6, #60a5fa)',
            boxShadow: isComplete
              ? '0 0 10px rgba(52,211,153,0.5)'
              : '0 0 10px rgba(59,130,246,0.5)',
          }}
        />
      </div>
    </div>
  )
}
