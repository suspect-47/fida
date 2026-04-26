import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface FDARecord {
  recalling_firm: string
  reason_for_recall: string
  classification: string
  status: string
  report_date: string
  product_description: string
  state: string
  voluntary_mandated: string
}

const CLASS_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  'Class I':   { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  'Class II':  { color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  'Class III': { color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' },
}

function formatDate(raw: string) {
  if (!raw || raw.length < 8) return raw
  return `${raw.slice(4, 6)}/${raw.slice(6, 8)}/${raw.slice(0, 4)}`
}

export function FDADataSection() {
  const [records, setRecords] = useState<FDARecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        'https://api.fda.gov/food/enforcement.json?limit=12&sort=report_date:desc'
      )
      if (!res.ok) throw new Error(`FDA API returned ${res.status}`)
      const data = await res.json()
      setRecords(data.results ?? [])
      setLastFetched(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch FDA data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  return (
    <section
      id="fda-data"
      style={{ backgroundColor: '#fafafa', padding: '7rem 2rem', scrollMarginTop: '80px' }}
    >
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '2.5rem' }}
        >
          <div>
            <p style={{ color: '#dc2626', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 700, marginBottom: '0.75rem' }}>
              Live · FDA Enforcement Database
            </p>
            <h2 style={{ color: '#0a0a0a', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.035em', margin: '0 0 0.5rem' }}>
              Recent Food Recalls
            </h2>
            <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>
              {lastFetched ? `Last updated ${lastFetched.toLocaleTimeString()}` : 'Loading live data…'}
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#0a0a0a',
              color: '#fff',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.6rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              fontFamily: 'inherit',
            }}
          >
            <RefreshCw style={{ width: '0.9rem', height: '0.9rem', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: '5rem', backgroundColor: '#fff', borderRadius: '1rem', border: '1.5px solid #f0f0f0', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ borderRadius: '1rem', border: '1.5px solid #fecaca', backgroundColor: '#fef2f2', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle style={{ color: '#dc2626', width: '1.1rem', height: '1.1rem', flexShrink: 0 }} />
            <p style={{ color: '#b91c1c', fontSize: '0.9375rem', margin: 0, fontWeight: 500 }}>{error}</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && records.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
          >
            {records.map((rec, i) => {
              const cls = CLASS_STYLE[rec.classification] ?? CLASS_STYLE['Class III']
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '1rem',
                    border: '1.5px solid #f0f0f0',
                    padding: '1.25rem 1.5rem',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '1rem',
                    alignItems: 'start',
                    boxShadow: '0 1px 8px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ color: '#0a0a0a', fontWeight: 700, fontSize: '0.9375rem' }}>
                        {rec.recalling_firm}
                      </span>
                      {rec.state && (
                        <span style={{ color: '#aaa', fontSize: '0.775rem', fontWeight: 600 }}>{rec.state}</span>
                      )}
                    </div>
                    <p style={{ color: '#555', fontSize: '0.875rem', lineHeight: 1.5, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>
                      {rec.reason_for_recall}
                    </p>
                    <p style={{ color: '#bbb', fontSize: '0.775rem', margin: 0, fontWeight: 500 }}>
                      {rec.product_description?.slice(0, 80)}{rec.product_description?.length > 80 ? '…' : ''}
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: cls.color,
                        backgroundColor: cls.bg,
                        border: `1px solid ${cls.border}`,
                        borderRadius: '9999px',
                        padding: '0.2rem 0.7rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {rec.classification}
                    </span>
                    <span style={{ color: '#bbb', fontSize: '0.775rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {formatDate(rec.report_date)}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: rec.status === 'Ongoing' ? '#d97706' : '#888',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {rec.status}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:0.5 } 50% { opacity:1 } }
      `}</style>
    </section>
  )
}
