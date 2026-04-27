'use client'

import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

const SEEN_KEY = 'fm_chat_seen'
const CONV_KEY = 'fm_conv_id'

function useHasUnread() {
  const [unread, setUnread] = useState(false)

  useEffect(() => {
    const check = async () => {
      try {
        const convId = localStorage.getItem(CONV_KEY)
        if (!convId) return setUnread(false)
        const res = await fetch(`/api/conversations/${convId}/messages`)
        if (!res.ok) return
        const msgs: { isFromAdmin: boolean; createdAt: string }[] = await res.json()
        const adminMsgs = msgs.filter(m => m.isFromAdmin)
        if (!adminMsgs.length) return setUnread(false)
        const lastAdmin = adminMsgs[adminMsgs.length - 1].createdAt
        const seen = localStorage.getItem(SEEN_KEY)
        setUnread(!seen || seen < lastAdmin)
      } catch {
        setUnread(false)
      }
    }
    check()
    const id = setInterval(check, 15000)
    return () => clearInterval(id)
  }, [])

  return unread
}

export default function Header() {
  const unread = useHasUnread()

  return (
    <header
      className="flex items-center justify-between px-5 flex-shrink-0"
      style={{ paddingTop: 'max(44px, env(safe-area-inset-top, 44px))', paddingBottom: 12 }}
    >
      <span className="text-[22px] font-bold tracking-tight">
        <span style={{ color: '#ffffff' }}>feel</span>
        <span style={{ color: '#A66A86' }}>more.</span>
      </span>

      <Link href="/messages/support" className="relative flex items-center justify-center p-1">
        <MessageCircle size={22} strokeWidth={1.5} color="rgba(255,255,255,0.7)" />
        {unread && (
          <span style={{
            position: 'absolute', top: 0, right: 0,
            width: 8, height: 8, borderRadius: '50%',
            backgroundColor: '#A66A86',
            border: '1.5px solid #0F0C09',
          }} />
        )}
      </Link>
    </header>
  )
}
