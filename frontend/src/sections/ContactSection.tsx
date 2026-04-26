import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle, Mail, MapPin, Clock } from 'lucide-react'

const INFO = [
  { icon: Mail,    label: 'Email',    value: 'hello@fida.ai' },
  { icon: MapPin,  label: 'Location', value: 'San Francisco, CA' },
  { icon: Clock,   label: 'Response', value: 'Within 24 hours' },
]

export function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
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

  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = '#0ea5e9'
      e.currentTarget.style.backgroundColor = '#fff'
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = '#e5e7eb'
      e.currentTarget.style.backgroundColor = '#fafafa'
    },
  }

  return (
    <section
      id="contact"
      style={{ backgroundColor: '#fff', padding: '7rem 2rem 5rem', scrollMarginTop: '80px' }}
    >
      <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', alignItems: 'start' }}>

        {/* Left: info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <p style={{ color: '#0ea5e9', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 700, marginBottom: '0.75rem' }}>
            Get in Touch
          </p>
          <h2 style={{ color: '#0a0a0a', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.035em', margin: '0 0 1.25rem' }}>
            Contact Us
          </h2>
          <p style={{ color: '#777', fontSize: '1.0625rem', lineHeight: 1.7, margin: '0 0 2.5rem' }}>
            Questions about a scan result, interested in enterprise access, or want to integrate FIDA into your procurement workflow? We'd love to hear from you.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {INFO.map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', backgroundColor: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: '1.125rem', height: '1.125rem', color: '#0ea5e9' }} />
                </div>
                <div>
                  <p style={{ color: '#aaa', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, margin: '0 0 0.15rem' }}>{label}</p>
                  <p style={{ color: '#333', fontSize: '0.9375rem', fontWeight: 600, margin: 0 }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  borderRadius: '1.5rem',
                  border: '1.5px solid #bbf7d0',
                  backgroundColor: '#f0fdf4',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <CheckCircle style={{ width: '2.5rem', height: '2.5rem', color: '#16a34a' }} />
                <h3 style={{ color: '#0a0a0a', fontWeight: 800, fontSize: '1.25rem', margin: 0 }}>Message sent!</h3>
                <p style={{ color: '#666', fontSize: '0.9375rem', margin: 0, lineHeight: 1.6 }}>
                  Thanks, {form.name}. We'll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
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
                  <label style={labelStyle}>Your Name</label>
                  <input name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Jane Smith" style={inputStyle} {...focusHandlers} />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="jane@company.com" style={inputStyle} {...focusHandlers} />
                </div>
                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us what you're looking for…"
                    style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#0ea5e9'; e.currentTarget.style.backgroundColor = '#fff' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.backgroundColor = '#fafafa' }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#0a0a0a',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    borderRadius: '0.875rem',
                    padding: '1rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    letterSpacing: '0.01em',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#222')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0a0a0a')}
                >
                  <Send style={{ width: '1rem', height: '1rem' }} />
                  Send Message
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
