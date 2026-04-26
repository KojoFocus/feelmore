import { MessageCircle } from 'lucide-react'

export default function Header() {
  return (
    <header
      className="flex items-center justify-between px-5 flex-shrink-0"
      style={{ paddingTop: 'max(44px, env(safe-area-inset-top, 44px))', paddingBottom: 12 }}
    >
      <span className="text-[22px] font-bold tracking-tight">
        <span style={{ color: '#ffffff' }}>feel</span>
        <span style={{ color: '#C9923A' }}>more.</span>
      </span>
      <button className="flex items-center justify-center">
        <MessageCircle size={22} strokeWidth={1.5} color="rgba(255,255,255,0.7)" />
      </button>
    </header>
  )
}
