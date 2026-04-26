'use client'

import { useState, useRef } from 'react'
import { Send } from 'lucide-react'

type Comment = {
  id: string
  body: string
  createdAt: string
  user: { name: string | null }
}

interface Props {
  episodeId: string
  initial: Comment[]
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

export default function CommentsSection({ episodeId, initial }: Props) {
  const [comments, setComments] = useState<Comment[]>(initial)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = async () => {
    const body = text.trim()
    if (!body || sending) return
    setSending(true)
    setText('')

    const optimistic: Comment = {
      id: `opt-${Date.now()}`,
      body,
      createdAt: new Date().toISOString(),
      user: { name: 'You' },
    }
    setComments(prev => [optimistic, ...prev])

    try {
      const res = await fetch(`/api/episodes/${episodeId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      })
      if (res.ok) {
        const saved = await res.json()
        setComments(prev => prev.map(c => c.id === optimistic.id ? saved : c))
      }
    } catch {
      setComments(prev => prev.filter(c => c.id !== optimistic.id))
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      <p className="text-[11px] font-medium text-gray-600 uppercase tracking-widest mb-5">
        Comments {comments.length > 0 && <span className="text-gray-700 font-normal normal-case tracking-normal">({comments.length})</span>}
      </p>

      {/* Input */}
      <div
        className="flex items-center gap-3 mb-7 px-4 rounded-2xl"
        style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <input
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder="Share your thoughts…"
          className="flex-1 bg-transparent text-white/80 text-[13px] py-3.5 outline-none placeholder:text-gray-700"
        />
        <button
          onClick={submit}
          disabled={!text.trim() || sending}
          style={{ opacity: text.trim() ? 1 : 0.3, transition: 'opacity 0.15s' }}
        >
          <Send size={14} color="#C9923A" />
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-5">
        {comments.map(c => (
          <div key={c.id} className="flex gap-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-semibold"
              style={{ backgroundColor: 'rgba(201,146,58,0.15)', color: '#C9923A' }}
            >
              {(c.user.name ?? 'A')[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[12px] font-medium text-white/70">{c.user.name ?? 'Anonymous'}</span>
                <span className="text-[10px] text-gray-700">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="text-[13px] text-gray-500 leading-relaxed">{c.body}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-[12px] text-gray-700 text-center py-8">Be the first to comment</p>
        )}
      </div>
    </div>
  )
}
