
// components/page-transition.jsx
'use client'
import { motion, Transition } from 'framer-motion'

const pageVariants = {
  initial: {
    opacity: 0,
    x: -100,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: 100,
  }
}

const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
}

export default function PageTransition({ children, direction = 'left' }: { children: React.ReactNode, direction?: 'left' | 'right' | 'top' | 'bottom' }) {
  const variants = {
    initial: {
      opacity: 0,
      x: direction === 'left' ? -100 : 100,
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: direction === 'left' ? 100 : -100,
    }
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      transition={pageTransition}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

// Alternative: Slide from different directions
export function SlideFromLeft({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

export function SlideFromRight({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

export function SlideFromTop({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

export function SlideFromBottom({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}