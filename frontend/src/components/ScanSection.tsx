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
  'Clean':     { icon: CheckCircle,  color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  'Warning':   { icon: AlertTriangle, color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  'High Risk': { icon: XCircle,      color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
}

const REC_COLOR = {
  'Safe to use':      '#16a34a',
  'Use with caution': '#d97706',
  'Do not use':       '#dc2626',
}

function Metric({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div>
      <p style={{ color: '#999', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem', fontWeight: 600 }}>
        {label}
      </p>
      <p style={{ color: valueColor ?? '#222', fontSize: '0.9375rem', lineHeight: 1.45, fontWeight: 500 }}>
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
        borderRadius: '1.5rem',
        border: '1.5px solid #e5e7eb',
        backgroundColor: '#fff',
        overflow: 'hidden',
        boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
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
          padding: '1.75rem',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <div>
          <h3 style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '1.2rem', margin: 0 }}>{record.supplier_name}</h3>
          {record.location && (
            <p style={{ color: '#888', fontSize: '0.875rem', marginTop: '0.2rem', fontWeight: 500 }}>{record.location}</p>
          )}
          <p style={{ color: '#bbb', fontSize: '0.775rem', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 500 }}>
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
            border: `1.5px solid ${s.border}`,
            backgroundColor: s.bg,
            color: s.color,
            fontSize: '0.875rem',
            fontWeight: 700,
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
          gap: '1.75rem',
          padding: '1.75rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ScoreGauge score={report.score} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Metric
            label="FDA Violations"
            value={String(report.fda_violations)}
            valueColor={report.fda_violations > 0 ? '#dc2626' : '#16a34a'}
          />
          <Metric label="Last FDA Incident" value={report.last_fda_incident} />
          <Metric label="Certifications" value={report.certifications} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Metric label="Web Risk Signals" value={report.web_risk_signals} />
          <div>
            <p style={{ color: '#999', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem', fontWeight: 600 }}>
              Recommendation
            </p>
            <p style={{ color: REC_COLOR[report.recommendation], fontSize: '0.9375rem', fontWeight: 800 }}>
              {report.recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div style={{ padding: '0 1.75rem 1.75rem' }}>
        <p style={{ color: '#999', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem', fontWeight: 600 }}>
          Summary
        </p>
        <p style={{ color: '#444', fontSize: '0.9375rem', lineHeight: 1.7, fontWeight: 400 }}>
          {report.summary}
        </p>
      </div>

      {/* Data sources */}
      <div style={{ padding: '0 1.75rem 1.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {report.data_sources.map((src) => (
          <span
            key={src}
            style={{
              fontSize: '0.75rem',
              color: '#888',
              border: '1px solid #e5e7eb',
              borderRadius: '9999px',
              padding: '0.3rem 0.875rem',
              fontWeight: 600,
              backgroundColor: '#fafafa',
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
    backgroundColor: '#fafafa',
    border: '1.5px solid #e5e7eb',
    borderRadius: '0.875rem',
    padding: '1rem 1.125rem',
    color: '#111',
    fontSize: '1rem',
    fontWeight: 500,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, background-color 0.2s',
  }

  const labelStyle: React.CSSProperties = {
    color: '#888',
    fontSize: '0.72rem',
    textTransform: 'uppercase',
    letterSpacing: '0.11em',
    fontWeight: 700,
    display: 'block',
    marginBottom: '0.5rem',
  }

  return (
    <section
      id="scan"
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#f7f7f7',
        padding: '7rem 1.5rem 5rem',
      }}
    >
      {/* Subtle dot grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
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
          <p style={{ color: '#0ea5e9', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '0.875rem', fontWeight: 700 }}>
            Compliance Intelligence
          </p>
          <h2 style={{ color: '#0a0a0a', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.035em', margin: '0 0 0.875rem' }}>
            Scan a Supplier
          </h2>
          <p style={{ color: '#777', fontSize: '1rem', lineHeight: 1.7, maxWidth: '30rem', margin: '0 auto', fontWeight: 400 }}>
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
            borderRadius: '1.5rem',
            border: '1.5px solid #e5e7eb',
            backgroundColor: '#fff',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.125rem',
            boxShadow: '0 2px 24px rgba(0,0,0,0.05)',
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
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#0ea5e9'
                e.currentTarget.style.backgroundColor = '#fff'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.backgroundColor = '#fafafa'
              }}
            />
          </div>
          <div>
            <label style={labelStyle}>
              Location{' '}
              <span style={{ color: '#bbb', fontWeight: 500, fontSize: '0.7rem' }}>(optional)</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Chicago, IL"
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#0ea5e9'
                e.currentTarget.style.backgroundColor = '#fff'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb'
                e.currentTarget.style.backgroundColor = '#fafafa'
              }}
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
              backgroundColor: loading || !supplier.trim() ? '#e5e7eb' : '#0a0a0a',
              color: loading || !supplier.trim() ? '#aaa' : '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: '0.875rem',
              padding: '1rem',
              border: 'none',
              cursor: loading || !supplier.trim() ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s, transform 0.15s',
              fontFamily: 'inherit',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={(e) => {
              if (!loading && supplier.trim()) e.currentTarget.style.backgroundColor = '#222'
            }}
            onMouseLeave={(e) => {
              if (!loading && supplier.trim()) e.currentTarget.style.backgroundColor = '#0a0a0a'
            }}
          >
            {loading ? (
              <>
                <Loader2 style={{ width: '1.1rem', height: '1.1rem', animation: 'spin 1s linear infinite' }} />
                Analyzing supplier…
              </>
            ) : (
              <>
                <Search style={{ width: '1.1rem', height: '1.1rem' }} />
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
                borderRadius: '1rem',
                border: '1.5px solid #fecaca',
                backgroundColor: '#fef2f2',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <XCircle style={{ width: '1.1rem', height: '1.1rem', color: '#dc2626', flexShrink: 0, marginTop: '0.1rem' }} />
              <p style={{ color: '#b91c1c', fontSize: '0.9375rem', margin: 0, fontWeight: 500 }}>{error}</p>
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
              borderRadius: '1.5rem',
              border: '1.5px solid #e5e7eb',
              backgroundColor: '#fff',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {[72, 52, 88, 42, 65].map((w, i) => (
              <div
                key={i}
                style={{
                  height: '0.875rem',
                  backgroundColor: '#f0f0f0',
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
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
      `}</style>
    </section>
  )
}
