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
        background: 'linear-gradient(100deg, #64CEFB 30%, #ffffff 50%, #64CEFB 70%)',
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
