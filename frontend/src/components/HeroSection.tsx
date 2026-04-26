import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Menu, X } from 'lucide-react'
import { ShinyText } from './ShinyText'

const NAV_LINKS = [
  { label: 'Home',         href: '#home' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'FDA Data',     href: '#fda-data' },
  { label: 'AI Research',  href: '#ai-research' },
  { label: 'Reports',      href: '#reports' },
]

export function HeroSection() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#fff',
      }}
    >
      {/* Video — very faint, just adds subtle motion texture */}
      <video
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.07,
        }}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Bottom fade to white for smooth section transition */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 60%, #fff 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 2.5rem',
        }}
      >
        {/* Nav */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1.75rem',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '2.1rem',
                height: '2.1rem',
                borderRadius: '50%',
                border: '2px solid #111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: '0.65rem', height: '0.65rem', borderRadius: '50%', backgroundColor: '#111' }} />
            </div>
            <span style={{ color: '#111', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.06em' }}>
              FIDA
            </span>
          </div>

          {/* Desktop nav pill */}
          <div
            className="hidden-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0',
              border: '1.5px solid rgba(0,0,0,0.12)',
              borderRadius: '9999px',
              padding: '0.4rem 0.75rem',
              backgroundColor: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{
                  color: '#333',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  padding: '0.3rem 1rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#000')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#333')}
              >
                {label}
              </a>
            ))}
            <a
              href="#scan"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                color: '#333',
                fontWeight: 600,
                fontSize: '0.875rem',
                padding: '0.3rem 1rem',
                textDecoration: 'none',
                transition: 'color 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#000')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#333')}
            >
              Contact us <ArrowRight style={{ width: '0.8rem', height: '0.8rem' }} />
            </a>
          </div>

          {/* Hamburger */}
          <button
            style={{ color: '#111', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="show-mobile"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                backgroundColor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(12px)',
                borderRadius: '1rem',
                padding: '1rem',
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              }}
            >
              {[...NAV_LINKS.map(n => ({ label: n.label, href: n.href })), { label: 'Scan a Supplier', href: '#scan' }].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    color: '#111',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                  }}
                >
                  {label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Descriptor row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
            marginTop: '2.75rem',
          }}
        >
          <p
            style={{
              color: '#555',
              fontSize: '1rem',
              maxWidth: '24rem',
              lineHeight: 1.65,
              fontWeight: 400,
            }}
          >
            We deliver instant compliance intelligence, combining real-time FDA enforcement
            records with autonomous AI web research to protect your supply chain.
          </p>
          <p
            style={{
              color: '#555',
              fontSize: '1rem',
              textAlign: 'right',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            10M+ FDA Records · Real-time AI Analysis
          </p>
        </div>

        {/* Center hero content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            textAlign: 'center',
            paddingBottom: '5rem',
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              color: '#888',
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              fontWeight: 500,
            }}
          >
            AI-Powered Supplier Intelligence · Always On
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: '-0.045em',
              fontSize: 'clamp(4rem, 13vw, 10rem)',
              margin: 0,
            }}
          >
            <span style={{ color: '#0a0a0a', display: 'block' }}>Verify</span>
            <ShinyText text="Every Supplier." />
          </motion.h1>

          <motion.a
            href="#scan"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: '2.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#0a0a0a',
              borderRadius: '9999px',
              padding: '1rem 2.25rem',
              color: '#fff',
              fontSize: '0.9375rem',
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '0.01em',
              transition: 'background-color 0.2s, transform 0.2s',
              boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#222'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#0a0a0a'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Scan a Supplier Now
            <ArrowRight style={{ width: '1rem', height: '1rem' }} />
          </motion.a>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) { .hidden-mobile { display: none !important; } }
        @media (min-width: 1024px) { .show-mobile { display: none !important; } }
      `}</style>
    </section>
  )
}
