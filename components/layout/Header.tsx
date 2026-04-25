import { Bell } from 'lucide-react'

export default function Header() {
  return (
    <header
      className="flex items-center justify-between px-5"
      style={{ paddingTop: 'max(44px, env(safe-area-inset-top, 44px))', paddingBottom: 12 }}
    >
      <span className="text-[21px] font-bold tracking-tight" style={{ color: '#BF567D' }}>
        feelmore.
      </span>
      <button
        className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Bell size={14} strokeWidth={1.5} color="rgba(255,255,255,0.3)" />
      </button>
    </header>
  )
}
