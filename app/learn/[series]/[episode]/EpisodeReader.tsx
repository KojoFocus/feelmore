'use client'

import { motion } from 'framer-motion'

export default function EpisodeReader({ body }: { body: string }) {
  const paragraphs = body.split('\n').filter(p => p.trim())

  return (
    <div>
      {paragraphs.map((para, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.04, ease: 'easeOut' }}
          style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.85,
            marginBottom: 20,
            fontFamily: 'var(--font-inter)',
          }}
        >
          {para}
        </motion.p>
      ))}
    </div>
  )
}
