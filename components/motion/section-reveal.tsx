"use client"

import { motion, useInView } from "framer-motion"
import { type ReactNode, useRef } from "react"

interface SectionRevealProps {
  children: ReactNode
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  className?: string
}

export function SectionReveal({ children, delay = 0, direction = "up", className }: SectionRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 20 }
      case "down":
        return { opacity: 0, y: -20 }
      case "left":
        return { opacity: 0, x: 20 }
      case "right":
        return { opacity: 0, x: -20 }
      default:
        return { opacity: 0, y: 20 }
    }
  }

  const getFinalPosition = () => {
    return { opacity: 1, y: 0, x: 0 }
  }

  return (
    <motion.div
      ref={ref}
      initial={getInitialPosition()}
      animate={isInView ? getFinalPosition() : getInitialPosition()}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
