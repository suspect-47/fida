import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, AlertTriangle, CheckCircle, XCircle, Loader2, Clock } from 'lucide-react'
import { ScoreGauge } from './ScoreGauge'

interface Report {
  score: number
  status: 'Clean' | 'Warning' | 'High Risk'
  fda_violations: number
  last_fda_incident: string
  web_risk_signals: string
  certifications: string
  summary: string
  recommendation: 'Safe to use' | 'Use with caution' | 'Do not use'
  data_sources: string[]
}

interface ScanRecord {
  supplier_name: string
  location: string | null
  scanned_at: string
  report: Report
}

const STATUS = {
  'Clean':    { icon: CheckCircle, color: '#4ade80', bg: 'rgba(74,222,128,0.08)',   border: 'rgba(74,222,128,0.2)' },
  'Warning':  { icon: AlertTriangle, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)' },
  'High Risk':{ icon: XCircle, color: '#f87171', bg: 'rgba(248,113,113,0.08)',      border: 'rgba(248,113,113,0.2)' },
}

const REC_COLOR = {
  'Safe to use':      '#4ade80',
  'Use with caution': '#fbbf24',
  'Do not use':       '#f87171',
}

function Metric({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
        {label}
      </p>
      <p style={{ color: valueColor ?? 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: 1.4 }}>
        {value}
      </p>
    </div>
  )
}

function ResultCard({ record }: { record: ScanRecord }) {
  const { report } = record
  const s = STATUS[report.status]
  const Icon = s.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        marginTop: '2rem',
        borderRadius: '1.25rem',
        border: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          padding: '1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div>
          <h3 style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem', margin: 0 }}>{record.supplier_name}</h3>
          {record.location && (
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{record.location}</p>
          )}
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock style={{ width: '0.75rem', height: '0.75rem' }} />
            {new Date(record.scanned_at).toLocaleString()}
          </p>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1.25rem',
            borderRadius: '9999px',
            border: `1px solid ${s.border}`,
            backgroundColor: s.bg,
            color: s.color,
            fontSize: '0.8125rem',
            fontWeight: 500,
          }}
        >
          <Icon style={{ width: '0.9rem', height: '0.9rem' }} />
          {report.status}
        </div>
      </div>

      {/* Score + metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ScoreGauge score={report.score} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Metric
            label="FDA Violations"
            value={String(report.fda_violations)}
            valueColor={report.fda_violations > 0 ? '#f87171' : '#4ade80'}
          />
          <Metric label="Last FDA Incident" value={report.last_fda_incident} />
          <Metric label="Certifications" value={report.certifications} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Metric label="Web Risk Signals" value={report.web_risk_signals} />
          <div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
              Recommendation
            </p>
            <p style={{ color: REC_COLOR[report.recommendation], fontSize: '0.875rem', fontWeight: 600 }}>
              {report.recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div style={{ padding: '0 1.5rem 1.5rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
          Summary
        </p>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', lineHeight: 1.65 }}>
          {report.summary}
        </p>
      </div>

      {/* Data sources */}
      <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {report.data_sources.map((src) => (
          <span
            key={src}
            style={{
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.3)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '9999px',
              padding: '0.25rem 0.75rem',
            }}
          >
            {src}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export function ScanSection() {
  const [supplier, setSupplier] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScanRecord | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleScan(e: React.FormEvent) {
    e.preventDefault()
    if (!supplier.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplier_name: supplier.trim(), location: location.trim() || null }),
      })
      const text = await res.text()
      if (!text) throw new Error(`Server returned empty response (HTTP ${res.status}) — is the backend running?`)
      let data: ScanRecord
      try { data = JSON.parse(text) } catch { throw new Error(`Backend error: ${text.slice(0, 120)}`) }
      if (!res.ok) throw new Error((data as unknown as { detail?: string }).detail ?? `HTTP ${res.status}`)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '0.75rem',
    padding: '0.875rem 1rem',
    color: '#fff',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  }

  const labelStyle: React.CSSProperties = {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.65rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    display: 'block',
    marginBottom: '0.5rem',
  }

  return (
    <section
      id="scan"
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#000',
        padding: '7rem 1.5rem 5rem',
      }}
    >
      {/* Subtle grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', maxWidth: '44rem', margin: '0 auto' }}>

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <p style={{ color: '#64CEFB', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>
            Compliance Intelligence
          </p>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 500, letterSpacing: '-0.03em', margin: '0 0 0.75rem' }}>
            Scan a Supplier
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', lineHeight: 1.65, maxWidth: '28rem', margin: '0 auto' }}>
            Enter a supplier name and we'll cross-reference FDA enforcement records with live AI web research to generate an instant compliance report.
          </p>
        </motion.div>

        {/* Form card */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          onSubmit={handleScan}
          style={{
            borderRadius: '1.25rem',
            border: '1px solid rgba(255,255,255,0.08)',
            backgroundColor: 'rgba(255,255,255,0.03)',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div>
            <label style={labelStyle}>Supplier Name *</label>
            <input
              type="text"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="e.g. Acme Foods Inc."
              required
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(100,206,251,0.4)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>
          <div>
            <label style={labelStyle}>
              Location{' '}
              <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 400, fontSize: '0.65rem' }}>(optional)</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Chicago, IL"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(100,206,251,0.4)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !supplier.trim()}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              backgroundColor: loading || !supplier.trim() ? 'rgba(255,255,255,0.06)' : '#64CEFB',
              color: loading || !supplier.trim() ? 'rgba(255,255,255,0.25)' : '#000',
              fontWeight: 600,
              fontSize: '0.875rem',
              borderRadius: '0.75rem',
              padding: '0.9rem',
              border: 'none',
              cursor: loading || !supplier.trim() ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              fontFamily: 'inherit',
            }}
          >
            {loading ? (
              <>
                <Loader2 style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} />
                Analyzing supplier…
              </>
            ) : (
              <>
                <Search style={{ width: '1rem', height: '1rem' }} />
                Run Compliance Scan
              </>
            )}
          </button>
        </motion.form>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                marginTop: '1rem',
                borderRadius: '0.875rem',
                border: '1px solid rgba(248,113,113,0.2)',
                backgroundColor: 'rgba(248,113,113,0.08)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <XCircle style={{ width: '1rem', height: '1rem', color: '#f87171', flexShrink: 0, marginTop: '0.1rem' }} />
              <p style={{ color: '#fca5a5', fontSize: '0.875rem', margin: 0 }}>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading skeleton */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              marginTop: '1.5rem',
              borderRadius: '1.25rem',
              border: '1px solid rgba(255,255,255,0.06)',
              backgroundColor: 'rgba(255,255,255,0.02)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {[75, 55, 88, 45, 65].map((w, i) => (
              <div
                key={i}
                style={{
                  height: '0.75rem',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '9999px',
                  width: `${w}%`,
                  animation: 'pulse 1.5s ease-in-out infinite',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Result */}
        <AnimatePresence>
          {result && <ResultCard record={result} />}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
      `}</style>
    </section>
  )
}
