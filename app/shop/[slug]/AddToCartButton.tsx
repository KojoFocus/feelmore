'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { addToCart } from '@/lib/cart'
import Link from 'next/link'

type Props = { productId: string; name: string; price: number; currency: string; image: string | null }

export default function AddToCartButton({ productId, name, price, currency, image }: Props) {
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addToCart({ id: productId, productId, name, price, currency, image })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (added) {
    return (
      <div className="flex gap-3 mb-6">
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
    <button
      onClick={handleAdd}
      className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl mb-6"
      style={{ backgroundColor: '#A66A86' }}
    >
      <ShoppingCart size={16} color="#0D0A08" strokeWidth={2} />
      <span style={{ color: '#0D0A08', fontSize: 14, fontWeight: 700 }}>Add to cart</span>
    </button>
  )
}
