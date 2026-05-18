'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Shield, Package, Eye } from 'lucide-react'

const INTERESTS = [
  { key: 'solo_wellness',      label: 'Solo wellness' },
  { key: 'couples_intimacy',   label: 'Couples intimacy' },
  { key: 'body_curiosity',     label: 'Body curiosity' },
  { key: 'relationship_growth',label: 'Relationship growth' },
  { key: 'just_browsing',      label: 'Just browsing' },
]

const LEARNING = [
  { key: 'long_reads',     label: 'Long reads' },
  { key: 'quick_tips',     label: 'Quick tips' },
  { key: 'video_audio',    label: 'Video / audio' },
  { key: 'community_talk', label: 'Community talk' },
]

function Pill({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        borderRadius: 999,
        border: `1.5px solid ${selected ? '#A66A86' : 'rgba(255,255,255,0.12)'}`,
        backgroundColor: selected ? 'rgba(166,106,134,0.15)' : 'transparent',
        color: selected ? '#A66A86' : 'rgba(255,255,255,0.6)',
        fontSize: 14,
        fontWeight: selected ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  function toggle(key: string) {
    setSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  function next() {
    setSelected([])
    setStep(s => s + 1)
  }

  async function finish() {
    setSaving(true)
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: selected }),
      })
    } catch {
      // non-blocking
    }
    router.push('/')
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0A080D',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 28px',
        overflowY: 'auto',
      }}
    >
      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, paddingTop: 60, paddingBottom: 48 }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              height: 3,
              width: i === step ? 28 : 10,
              borderRadius: 999,
              backgroundColor: i <= step ? '#A66A86' : 'rgba(255,255,255,0.12)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Screen 1 */}
      {step === 0 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontFamily: 'var(--font-playfair)', fontSize: 30, fontWeight: 600, color: '#fff', lineHeight: 1.3, marginBottom: 8 }}>
            What brings<br />you here?
          </p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 36 }}>
            Choose as many as feel true.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 'auto' }}>
            {INTERESTS.map(({ key, label }) => (
              <Pill
                key={key}
                label={label}
                selected={selected.includes(key)}
                onClick={() => toggle(key)}
              />
            ))}
          </div>
          <button
            onClick={next}
            style={{
              marginTop: 48,
              marginBottom: 40,
              width: '100%',
              padding: '16px 0',
              borderRadius: 14,
              backgroundColor: '#A66A86',
              border: 'none',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            Continue <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Screen 2 */}
      {step === 1 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontFamily: 'var(--font-playfair)', fontSize: 30, fontWeight: 600, color: '#fff', lineHeight: 1.3, marginBottom: 8 }}>
            How do you like<br />to learn?
          </p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 36 }}>
            We'll shape your feed around this.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 'auto' }}>
            {LEARNING.map(({ key, label }) => (
              <Pill
                key={key}
                label={label}
                selected={selected.includes(key)}
                onClick={() => toggle(key)}
              />
            ))}
          </div>
          <button
            onClick={next}
            style={{
              marginTop: 48,
              marginBottom: 40,
              width: '100%',
              padding: '16px 0',
              borderRadius: 14,
              backgroundColor: '#A66A86',
              border: 'none',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            Continue <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Screen 3 */}
      {step === 2 && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontFamily: 'var(--font-playfair)', fontSize: 30, fontWeight: 600, color: '#fff', lineHeight: 1.3, marginBottom: 8 }}>
            A few things we<br />want you to know.
          </p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 40 }}>
            This is a shame-free space. Always.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 'auto' }}>
            {[
              {
                icon: Eye,
                title: 'Your data is private.',
                body: 'We never sell or share what you browse, save, or buy.',
              },
              {
                icon: Package,
                title: 'Orders arrive in plain packaging.',
                body: 'Your order shows as FM Wellness on your bank statement.',
              },
              {
                icon: Shield,
                title: 'Only you see your activity.',
                body: 'Story views, saves, and searches stay between you and us.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: 'rgba(166,106,134,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color="#A66A86" strokeWidth={1.5} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{title}</p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={finish}
            disabled={saving}
            style={{
              marginTop: 48,
              marginBottom: 40,
              width: '100%',
              padding: '16px 0',
              borderRadius: 14,
              backgroundColor: '#A66A86',
              border: 'none',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'One moment...' : "I'm ready. Let me in."}
          </button>
        </div>
      )}
    </div>
  )
}
