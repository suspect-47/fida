import { motion } from 'framer-motion'
import { Globe, ShieldCheck, Newspaper, Star, MessageSquareWarning, Award } from 'lucide-react'

const SIGNALS = [
  { icon: Newspaper,            label: 'News & Press',         desc: 'Recalls, lawsuits, safety incidents from the past 24 months across major food industry outlets.' },
  { icon: ShieldCheck,          label: 'FDA & USDA Filings',   desc: 'Cross-references official government enforcement databases beyond just recall notices.' },
  { icon: MessageSquareWarning, label: 'BBB Complaints',       desc: 'Business Bureau complaint history, response rate, and unresolved dispute patterns.' },
  { icon: Globe,                label: 'Website Audit',        desc: "Certifications claimed on the supplier's own website, verified against known registries." },
  { icon: Star,                 label: 'Industry Forums',      desc: 'Signals from food-industry forums, distributor boards, and trade publication commentary.' },
  { icon: Award,                label: 'Certification Check',  desc: 'SQF, BRC, FSSC 22000, USDA Organic, Non-GMO, Kosher, Halal — verified where possible.' },
]

const STATS = [
  { value: '24mo',  label: 'Research window' },
  { value: '6+',    label: 'Data sources' },
  { value: '45s',   label: 'Max research time' },
  { value: '100%',  label: 'Autonomous — no human in loop' },
]

export function AIResearch() {
  return (
    <section
      id="ai-research"
      style={{ backgroundColor: '#fff', padding: '7rem 2rem', scrollMarginTop: '80px' }}
    >
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <p style={{ color: '#7c3aed', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 700, marginBottom: '0.75rem' }}>
            Autonomous Intelligence
          </p>
          <h2 style={{ color: '#0a0a0a', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.035em', margin: '0 0 1rem' }}>
            What the AI Researches
          </h2>
          <p style={{ color: '#777', fontSize: '1.0625rem', lineHeight: 1.7, maxWidth: '36rem', margin: '0 auto' }}>
            FIDA's Hermes agent autonomously browses the web so you don't have to. Here's exactly what it looks for on every scan.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1px',
            backgroundColor: '#f0f0f0',
            borderRadius: '1.25rem',
            overflow: 'hidden',
            marginBottom: '3rem',
            border: '1.5px solid #f0f0f0',
          }}
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              style={{
                backgroundColor: '#fff',
                padding: '1.5rem',
                textAlign: 'center',
              }}
            >
              <p style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.04em', margin: '0 0 0.25rem' }}>{s.value}</p>
              <p style={{ color: '#999', fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Signal grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {SIGNALS.map((sig, i) => {
            const Icon = sig.icon
            return (
              <motion.div
                key={sig.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{
                  borderRadius: '1.25rem',
                  border: '1.5px solid #f0f0f0',
                  backgroundColor: '#fff',
                  padding: '1.5rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                  boxShadow: '0 1px 8px rgba(0,0,0,0.03)',
                }}
              >
                <div
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '0.75rem',
                    backgroundColor: '#faf5ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon style={{ width: '1.125rem', height: '1.125rem', color: '#7c3aed' }} />
                </div>
                <div>
                  <h4 style={{ color: '#0a0a0a', fontWeight: 700, fontSize: '0.9375rem', margin: '0 0 0.375rem' }}>{sig.label}</h4>
                  <p style={{ color: '#777', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>{sig.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            marginTop: '3rem',
            borderRadius: '1.25rem',
            border: '1.5px solid #ede9fe',
            backgroundColor: '#faf5ff',
            padding: '1.5rem 2rem',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#6d28d9', fontSize: '0.9375rem', fontWeight: 500, lineHeight: 1.6, margin: 0 }}>
            The AI agent runs independently of the FDA query — so even if a supplier has no official recall history, web signals can still surface early risk indicators.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
