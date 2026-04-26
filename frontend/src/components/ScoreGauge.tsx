import { motion } from 'framer-motion'

interface ScoreGaugeProps {
  score: number
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? '#16a34a' : score >= 40 ? '#d97706' : '#dc2626'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#f0f0f0" strokeWidth="10" />
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
        <text x="70" y="70" textAnchor="middle" dy="0.35em" fill="#0a0a0a" fontSize="28" fontWeight="800" fontFamily="Inter, sans-serif">
          {score}
        </text>
      </svg>
      <span style={{ color: '#aaa', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
        Compliance Score
      </span>
    </div>
  )
}
