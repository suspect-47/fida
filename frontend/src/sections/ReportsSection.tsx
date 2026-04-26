import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, Clock, Inbox } from 'lucide-react'

interface Report {
  score: number
  status: 'Clean' | 'Warning' | 'High Risk'
  fda_violations: number
  recommendation: 'Safe to use' | 'Use with caution' | 'Do not use'
  summary: string
}

interface ScanRecord {
  supplier_name: string
  location: string | null
  scanned_at: string
  report: Report
}

const STATUS = {
  'Clean':     { icon: CheckCircle,   color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  'Warning':   { icon: AlertTriangle, color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  'High Risk': { icon: XCircle,       color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
}

const REC_COLOR = {
  'Safe to use':      '#16a34a',
  'Use with caution': '#d97706',
  'Do not use':       '#dc2626',
}

export function ReportsSection() {
  const [records, setRecords] = useState<ScanRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/recent')
      .then((r) => r.json())
      .then((data) => { setRecords(data); setLoading(false) })
      .catch(() => { setError('Could not reach backend — start the FastAPI server.'); setLoading(false) })
  }, [])

  return (
    <section
      id="reports"
      style={{ backgroundColor: '#fafafa', padding: '7rem 2rem', scrollMarginTop: '80px' }}
    >
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <p style={{ color: '#059669', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 700, marginBottom: '0.75rem' }}>
            Session History
          </p>
          <h2 style={{ color: '#0a0a0a', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.035em', margin: '0 0 1rem' }}>
            Recent Reports
          </h2>
          <p style={{ color: '#777', fontSize: '1.0625rem', lineHeight: 1.7, maxWidth: '32rem', margin: '0 auto' }}>
            The last 5 compliance scans run in this session. Results reset when the server restarts.
          </p>
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: '7rem', backgroundColor: '#fff', borderRadius: '1.25rem', border: '1.5px solid #f0f0f0', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ borderRadius: '1rem', border: '1.5px solid #fde68a', backgroundColor: '#fffbeb', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle style={{ color: '#d97706', width: '1.1rem', height: '1.1rem', flexShrink: 0 }} />
            <p style={{ color: '#92400e', fontSize: '0.9375rem', margin: 0, fontWeight: 500 }}>{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && records.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              borderRadius: '1.5rem',
              border: '1.5px dashed #e5e7eb',
              backgroundColor: '#fff',
            }}
          >
            <Inbox style={{ width: '2.5rem', height: '2.5rem', color: '#d1d5db', margin: '0 auto 1rem' }} />
            <h3 style={{ color: '#555', fontWeight: 700, fontSize: '1.0625rem', margin: '0 0 0.5rem' }}>No scans yet</h3>
            <p style={{ color: '#aaa', fontSize: '0.9rem', margin: '0 0 1.5rem' }}>
              Run your first compliance scan and it will appear here.
            </p>
            <a
              href="#scan"
              style={{
                display: 'inline-block',
                backgroundColor: '#0a0a0a',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.875rem',
                borderRadius: '9999px',
                padding: '0.75rem 1.75rem',
                textDecoration: 'none',
              }}
            >
              Scan a Supplier
            </a>
          </motion.div>
        )}

        {/* Records */}
        {!loading && !error && records.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {records.map((rec, i) => {
              const s = STATUS[rec.report.status]
              const Icon = s.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '1.25rem',
                    border: '1.5px solid #f0f0f0',
                    padding: '1.5rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '1.5rem',
                    alignItems: 'center',
                    boxShadow: '0 1px 8px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <h3 style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '1.0625rem', margin: 0 }}>{rec.supplier_name}</h3>
                      {rec.location && <span style={{ color: '#aaa', fontSize: '0.8rem', fontWeight: 500 }}>{rec.location}</span>}
                    </div>
                    <p style={{ color: '#777', fontSize: '0.875rem', lineHeight: 1.55, margin: 0 }}>
                      {rec.report.summary?.slice(0, 120)}{rec.report.summary?.length > 120 ? '…' : ''}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                      <span style={{ color: '#bbb', fontSize: '0.775rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock style={{ width: '0.75rem', height: '0.75rem' }} />
                        {new Date(rec.scanned_at).toLocaleString()}
                      </span>
                      <span style={{ color: REC_COLOR[rec.report.recommendation], fontSize: '0.775rem', fontWeight: 700 }}>
                        {rec.report.recommendation}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.4rem 0.9rem',
                        borderRadius: '9999px',
                        border: `1.5px solid ${s.border}`,
                        backgroundColor: s.bg,
                        color: s.color,
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Icon style={{ width: '0.85rem', height: '0.85rem' }} />
                      {rec.report.status}
                    </div>
                    <span
                      style={{
                        fontSize: '2rem',
                        fontWeight: 800,
                        color: s.color,
                        letterSpacing: '-0.04em',
                        lineHeight: 1,
                      }}
                    >
                      {rec.report.score}
                    </span>
                    <span style={{ color: '#ccc', fontSize: '0.7rem', fontWeight: 600 }}>SCORE</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:.5} 50%{opacity:1} }`}</style>
    </section>
  )
}
