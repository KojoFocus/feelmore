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
      title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
      style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        backgroundColor: wishlisted ? 'rgba(166,106,134,0.15)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${wishlisted ? 'rgba(166,106,134,0.3)' : 'rgba(255,255,255,0.08)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.2s',
      }}
    >
      <Heart
        size={17}
        color={wishlisted ? '#A66A86' : 'rgba(255,255,255,0.4)'}
        fill={wishlisted ? '#A66A86' : 'none'}
        strokeWidth={1.8}
      />
    </button>
  )
}
