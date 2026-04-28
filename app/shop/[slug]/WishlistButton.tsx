'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'

export default function WishlistButton({ productId }: { productId: string }) {
  const [wishlisted, setWishlisted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/wishlist')
      .then(r => r.ok ? r.json() : [])
      .then((items: { product: { id: string } }[]) => {
        setWishlisted(items.some(i => i.product.id === productId))
      })
      .catch(() => {})
  }, [productId])

  const toggle = async () => {
    if (loading) return
    setLoading(true)
    const res = await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })
    if (res.ok) {
      const data = await res.json()
      setWishlisted(data.wishlisted)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      style={{
        width: 38, height: 38, borderRadius: '50%',
        backgroundColor: 'rgba(10,8,13,0.65)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <Heart
        size={16}
        color={wishlisted ? '#A66A86' : 'rgba(255,255,255,0.7)'}
        fill={wishlisted ? '#A66A86' : 'none'}
        strokeWidth={1.8}
      />
    </button>
  )
}
