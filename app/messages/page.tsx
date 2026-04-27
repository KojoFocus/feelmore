'use client'

import Link from 'next/link'
import { ChevronLeft, Search, Phone, Video } from 'lucide-react'

const THREADS = [
  {
    id: 'support',
    name: 'feelmore. Support',
    avatar: 'F',
    preview: 'How can we help you today? 💜',
    time: 'Now',
    unread: 1,
    online: true,
  },
]

export default function MessagesPage() {
  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0C0A0E', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{
        padding: 'max(52px, env(safe-area-inset-top, 52px)) 20px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div className="flex items-center justify-between">
          <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
            <ChevronLeft size={18} strokeWidth={1.5} />
            Back
          </Link>
          <h1 style={{ color: '#ffffff', fontSize: 17, fontWeight: 600 }}>Messages</h1>
          <div style={{ width: 60 }} />
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 16px 4px' }}>
        <div style={{
          backgroundColor: '#1A1720', borderRadius: 12,
          padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Search size={15} color="rgba(255,255,255,0.2)" />
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>Search</span>
        </div>
      </div>

      {/* Thread list */}
      <div style={{ flex: 1, paddingTop: 8 }}>
        {THREADS.map(t => (
          <Link
            key={t.id}
            href={`/messages/${t.id}`}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px', textDecoration: 'none' }}
          >
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                backgroundColor: 'rgba(166,106,134,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#A66A86', fontSize: 20, fontWeight: 700 }}>{t.avatar}</span>
              </div>
              {t.online && (
                <div style={{
                  position: 'absolute', bottom: 2, right: 2,
                  width: 12, height: 12, borderRadius: '50%',
                  backgroundColor: '#22c55e', border: '2.5px solid #0C0A0E',
                }} />
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <p style={{ color: '#ffffff', fontSize: 15, fontWeight: 600 }}>{t.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, flexShrink: 0 }}>{t.time}</p>
              </div>
              <p style={{
                color: 'rgba(255,255,255,0.35)', fontSize: 13,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {t.preview}
              </p>
            </div>

            {/* Unread badge */}
            {t.unread > 0 && (
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                backgroundColor: '#A66A86', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>{t.unread}</span>
              </div>
            )}
          </Link>
        ))}
      </div>

    </div>
  )
}
