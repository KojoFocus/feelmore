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
      <div className="flex gap-3 mb-5">
        <div className="flex-1 flex items-center justify-center gap-2 rounded-2xl" style={{ height: 52, backgroundColor: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <Check size={15} color="#22c55e" />
          <span style={{ color: '#22c55e', fontSize: 14, fontWeight: 700 }}>Added!</span>
        </div>
        <Link href="/cart" className="flex items-center justify-center px-5 rounded-2xl" style={{ height: 52, backgroundColor: '#A66A86', fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          View cart →
        </Link>
      </div>
    )
  }

  return (
    <div className="flex gap-3 mb-5">
      <button
        onClick={handleAdd}
        className="flex-1 flex items-center justify-center gap-2 rounded-2xl"
        style={{ height: 52, backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <ShoppingCart size={16} color="rgba(255,255,255,0.7)" strokeWidth={1.8} />
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: 600 }}>Add to cart</span>
      </button>

      <button
        onClick={handleBuyNow}
        className="flex-1 flex items-center justify-center gap-2 rounded-2xl"
        style={{ height: 52, backgroundColor: '#A66A86' }}
      >
        <Zap size={15} color="#fff" strokeWidth={2.5} fill="#fff" />
        <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>Buy Now</span>
      </button>
    </div>
  )
}
