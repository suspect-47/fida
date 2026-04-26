import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Menu, X } from 'lucide-react'
import { ShinyText } from './ShinyText'

const NAV_LINKS = ['Home', 'How It Works', 'FDA Data', 'AI Research', 'Reports']

export function HeroSection() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <section
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      {/* Video */}
      <video
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.45,
        }}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Bottom fade to black */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 40%, #000 100%)',
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
          padding: '0 2rem',
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
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                border: '2px solid #fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: '0.6rem', height: '0.6rem', borderRadius: '50%', backgroundColor: '#fff' }} />
            </div>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.05em' }}>
              FIDA
            </span>
          </div>

          {/* Desktop nav pill */}
          <div
            className="hidden-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.125rem',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '9999px',
              padding: '0.375rem 0.75rem',
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(0,0,0,0.25)',
            }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '0.8125rem',
                  padding: '0.25rem 0.875rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
              >
                {link}
              </a>
            ))}
            <a
              href="#scan"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                color: 'rgba(255,255,255,0.75)',
                fontSize: '0.8125rem',
                padding: '0.25rem 0.875rem',
                textDecoration: 'none',
                transition: 'color 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
            >
              Contact us <ArrowRight style={{ width: '0.8rem', height: '0.8rem' }} />
            </a>
          </div>

          {/* Hamburger */}
          <button
            style={{
              color: '#fff',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
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
                backgroundColor: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(12px)',
                borderRadius: '1rem',
                padding: '1rem',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {[...NAV_LINKS, 'Scan a Supplier'].map((link) => (
                <a
                  key={link}
                  href={link === 'Scan a Supplier' ? '#scan' : '#'}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    color: 'rgba(255,255,255,0.75)',
                    fontSize: '0.875rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                  }}
                >
                  {link}
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
            marginTop: '2.5rem',
          }}
        >
          <p
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.875rem',
              maxWidth: '22rem',
              lineHeight: 1.6,
            }}
          >
            We deliver instant compliance intelligence, combining real-time FDA enforcement
            records with autonomous AI web research to protect your supply chain.
          </p>
          <p
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.875rem',
              textAlign: 'right',
              whiteSpace: 'nowrap',
            }}
          >
            10M+ FDA Records · Real-time AI Analysis
          </p>
        </div>

        {/* Center hero */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            textAlign: 'center',
            paddingBottom: '4rem',
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >
            AI-Powered Supplier Intelligence · Always On
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontWeight: 500,
              lineHeight: 0.88,
              letterSpacing: '-0.04em',
              fontSize: 'clamp(3.5rem, 12vw, 9rem)',
              margin: 0,
            }}
          >
            <span style={{ color: '#fff', display: 'block' }}>Verify</span>
            <ShinyText text="Every Supplier." />
          </motion.h1>

          <motion.a
            href="#scan"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: '2.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#000',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '9999px',
              padding: '0.875rem 2rem',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'background-color 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.backgroundColor = '#111'
              el.style.borderColor = 'rgba(255,255,255,0.4)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.backgroundColor = '#000'
              el.style.borderColor = 'rgba(255,255,255,0.25)'
            }}
          >
            Scan a Supplier Now
            <ArrowRight style={{ width: '1rem', height: '1rem' }} />
          </motion.a>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .hidden-mobile { display: none !important; }
        }
        @media (min-width: 1024px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </section>
  )
}
