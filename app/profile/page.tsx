import Header from '@/components/layout/Header'
import { User, Package, Heart, ChevronRight, LogIn } from 'lucide-react'

export default function ProfilePage() {
  return (
    <div className="pb-28">
      <Header />

      <div className="px-5">
        {/* Avatar */}
        <div className="flex flex-col items-center py-10 gap-3">
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#12080e', border: '1px solid rgba(191,86,125,0.2)' }}
          >
            <User size={26} color="rgba(255,255,255,0.2)" strokeWidth={1.5} />
          </div>
          <p className="text-gray-600 text-[12px]">Not signed in</p>
        </div>

        {/* Auth buttons */}
        <div className="space-y-2.5">
          <button
            className="w-full text-white font-semibold py-3.5 rounded-2xl text-[13px] flex items-center justify-center gap-2"
            style={{ backgroundColor: '#BF567D' }}
          >
            <LogIn size={14} strokeWidth={1.5} />
            Sign in
          </button>
          <button
            className="w-full text-gray-400 font-medium py-3.5 rounded-2xl text-[13px]"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            Create account
          </button>
        </div>

        {/* Menu items */}
        <div className="mt-10">
          {[
            { icon: Package, label: 'My orders' },
            { icon: Heart, label: 'Wishlist' },
          ].map(({ icon: Icon, label }, i) => (
            <button
              key={label}
              className="w-full flex items-center gap-4 py-4 text-left"
              style={{ borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            >
              <Icon size={16} color="rgba(255,255,255,0.25)" strokeWidth={1.5} />
              <span className="text-[13px] text-gray-400 flex-1 font-normal">{label}</span>
              <ChevronRight size={14} color="rgba(255,255,255,0.15)" />
            </button>
          ))}
        </div>

        {/* App info */}
        <div className="mt-16 text-center">
          <p className="text-[10px] text-gray-700">feelmore. v1.0</p>
          <p className="text-[10px] text-gray-700 mt-1">Discreet. Safe. Always.</p>
        </div>
      </div>
    </div>
  )
}
