'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { TextEffectPerChar } from '@/components/ui/text-effect'
import Main from './main' 


export default function Personal() {
  const [showIntro, setShowIntro] = useState(true)

  // Total animation duration calculation
  const introText = "Joonbo Shim Portfolio"
  const perChar = introText.length
  const speedReveal = 1.2 // seconds per character
  const totalDuration = perChar * speedReveal * 55 // in ms

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), totalDuration + 300) // add small buffer
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div
            key="intro"
            className="fixed inset-0 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 z-50"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TextEffectPerChar
              per="char"
              preset="fade-in-blur"
              speedReveal={1.2}
              speedSegment={1}
              onAnimationComplete={() => {
                setTimeout(() => setShowIntro(false), 300)
              }}
              className="text-4xl font-bold text-zinc-900 dark:text-zinc-50"
            >
              {introText}
            </TextEffectPerChar>
          </motion.div>
        )}
      </AnimatePresence>

      {!showIntro && (
        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Main />
        </motion.div>
      )}
    </>
  )
}
