import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export interface FadeUpProps {
  children: ReactNode
  delay?: number
  duration?: number
  distance?: number
  className?: string
}

export function FadeUp({ children, delay = 0, duration = 0.3, distance = 20, className = '' }: FadeUpProps) {
  const variants = {
    hidden: {
      opacity: 0,
      y: distance,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration,
        delay: delay,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={variants} className={className}>
      {children}
    </motion.div>
  )
}
