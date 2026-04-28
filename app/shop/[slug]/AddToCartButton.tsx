'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Check, Zap } from 'lucide-react'
import { addToCart } from '@/lib/cart'
import Link from 'next/link'

type Props = { productId: string; name: string; price: number; currency: string; image: string | null }

export default function AddToCartButton({ productId, name, price, currency, image }: Props) {
  const [added, setAdded] = useState(false)
  const router = useRouter()

  const handleAdd = () => {
    addToCart({ id: productId, productId, name, price, currency, image })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    addToCart({ id: productId, productId, name, price, currency, image })
    router.push('/cart')
  }

  if (added) {
    return (
      <div className="flex gap-3">
        <div className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl"
          style={{ backgroundColor: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <Check size={16} color="#22c55e" />
          <span style={{ color: '#22c55e', fontSize: 14, fontWeight: 700 }}>Added to cart</span>
        </div>
        <Link href="/cart" className="flex items-center justify-center px-5 rounded-2xl"
          style={{ backgroundColor: '#A66A86', fontSize: 13, fontWeight: 600, color: '#0D0A08', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          View cart →
        </Link>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={handleAdd}
        className="flex items-center justify-center gap-2 py-4 rounded-2xl"
        style={{ flex: '0 0 auto', paddingLeft: 20, paddingRight: 20, backgroundColor: 'rgba(166,106,134,0.12)', border: '1px solid rgba(166,106,134,0.25)' }}
      >
        <ShoppingCart size={16} color="#A66A86" strokeWidth={2} />
        <span style={{ color: '#A66A86', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' }}>Add to cart</span>
      </button>

      <button
        onClick={handleBuyNow}
        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl"
        style={{ backgroundColor: '#A66A86' }}
      >
        <Zap size={15} color="#0D0A08" strokeWidth={2.5} fill="#0D0A08" />
        <span style={{ color: '#0D0A08', fontSize: 14, fontWeight: 700 }}>Buy Now</span>
      </button>
    </div>
  )
}
