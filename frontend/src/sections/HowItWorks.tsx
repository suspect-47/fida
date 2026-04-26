import { motion } from 'framer-motion'
import { Database, Bot, FileText } from 'lucide-react'

const STEPS = [
  {
    number: '01',
    icon: Database,
    title: 'FDA Database Query',
    description:
      'We query the FDA Food Enforcement database in real time, pulling every recall, warning, and enforcement action tied to the supplier — going back years.',
    detail: 'Source: api.fda.gov/food/enforcement',
    color: '#0ea5e9',
    bg: '#f0f9ff',
  },
  {
    number: '02',
    icon: Bot,
    title: 'Autonomous AI Web Research',
    description:
      'A Hermes AI agent independently scans news, BBB complaints, food industry forums, and the supplier\'s own website for recalls, lawsuits, and certification claims.',
    detail: 'Covers last 24 months · 45s timeout',
    color: '#7c3aed',
    bg: '#faf5ff',
  },
  {
    number: '03',
    icon: FileText,
    title: 'LLM Compliance Synthesis',
    description:
      'Both data streams are fed to a large language model that cross-references findings, resolves conflicts, and produces a scored, structured compliance report.',
    detail: 'Model: qwen/qwen3.5-9b via TokenRouter',
    color: '#059669',
    bg: '#f0fdf4',
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{ backgroundColor: '#fff', padding: '7rem 2rem', scrollMarginTop: '80px' }}
    >
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <p style={{ color: '#0ea5e9', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 700, marginBottom: '0.75rem' }}>
            The Process
          </p>
          <h2 style={{ color: '#0a0a0a', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.035em', margin: '0 0 1rem' }}>
            How It Works
          </h2>
          <p style={{ color: '#777', fontSize: '1.0625rem', lineHeight: 1.7, maxWidth: '34rem', margin: '0 auto' }}>
            Three data pipelines run in parallel the moment you submit a supplier name. The whole process typically completes in under 60 seconds.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                style={{
                  borderRadius: '1.5rem',
                  border: '1.5px solid #f0f0f0',
                  backgroundColor: '#fff',
                  padding: '2rem',
                  boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '0.875rem',
                      backgroundColor: step.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon style={{ width: '1.375rem', height: '1.375rem', color: step.color }} />
                  </div>
                  <span style={{ color: '#ddd', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.04em' }}>
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 style={{ color: '#0a0a0a', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 0.5rem', letterSpacing: '-0.02em' }}>
                    {step.title}
                  </h3>
                  <p style={{ color: '#666', fontSize: '0.9375rem', lineHeight: 1.65, margin: 0 }}>
                    {step.description}
                  </p>
                </div>
                <p style={{ color: step.color, fontSize: '0.75rem', fontWeight: 600, margin: 0, fontFamily: 'monospace' }}>
                  {step.detail}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
