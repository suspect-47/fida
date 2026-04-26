import { motion } from 'framer-motion'

interface ShinyTextProps {
  text: string
  className?: string
}

export function ShinyText({ text, className = '' }: ShinyTextProps) {
  return (
    <motion.span
      className={className}
      style={{
        background: 'linear-gradient(100deg, #0c4a6e 30%, #38bdf8 50%, #0c4a6e 70%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        display: 'inline-block',
      }}
      animate={{ backgroundPosition: ['200% center', '-200% center'] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
    >
      {text}
    </motion.span>
  )
}
