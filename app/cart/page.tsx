'use client'

import { useEffect, useState } from 'react'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { getCart, updateQty, removeFromCart, clearCart, cartTotal, type CartItem } from '@/lib/cart'
import Link from 'next/link'

const WA_NUMBER = '233540484052'

function buildWhatsAppMessage(items: CartItem[], name: string, phone: string, location: string) {
  const lines = items.map(i => `• ${i.qty}x ${i.name} — ${i.currency} ${(i.price * i.qty).toLocaleString()}`)
  const total = cartTotal(items)
  const currency = items[0]?.currency ?? 'GHS'
  return [
    '🛍️ *New Order — Feelmore*',
    '',
    `*Name:* ${name}`,
    `*Phone:* ${phone}`,
    `*Location:* ${location}`,
    '',
    '*Items:*',
    ...lines,
    '',
    `*Total:* ${currency} ${total.toLocaleString()}`,
    '',
    'Please confirm my order 🙏',
  ].join('\n')
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [step, setStep] = useState<'cart' | 'checkout'>('cart')
  const [form, setForm] = useState({ name: '', phone: '', location: '' })

  useEffect(() => {
    setItems(getCart())
    const handler = () => setItems(getCart())
    window.addEventListener('fm_cart_update', handler)
    return () => window.removeEventListener('fm_cart_update', handler)
  }, [])

  const qty = (productId: string, delta: number) => {
    const item = items.find(i => i.productId === productId)
    if (!item) return
    updateQty(productId, item.qty + delta)
    setItems(getCart())
  }

  const remove = (productId: string) => {
    removeFromCart(productId)
    setItems(getCart())
  }

  const total = cartTotal(items)
  const currency = items[0]?.currency ?? 'GHS'

  const placeOrder = async () => {
    const msg = buildWhatsAppMessage(items, form.name, form.phone, form.location)
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`

    // Save order to DB (best-effort — don't block checkout if it fails)
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, total, currency }),
    }).catch(() => {})

    clearCart()
    setItems([])
    window.open(url, '_blank')
  }

  if (items.length === 0 && step === 'cart') {
    return (
      <div style={{ minHeight: '100dvh', backgroundColor: '#08090D', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 24px' }}>
        <ShoppingBag size={40} color="rgba(255,255,255,0.08)" />
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Your cart is empty</p>
        <Link href="/shop" style={{ color: '#A66A86', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Browse products →</Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#08090D', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {step === 'checkout' && (
            <button onClick={() => setStep('cart')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', padding: 4, marginLeft: -4 }}>
              ←
            </button>
          )}
          <p style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{step === 'cart' ? 'Your cart' : 'Checkout'}</p>
          {step === 'cart' && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>({items.length} item{items.length !== 1 ? 's' : ''})</span>}
        </div>
      </div>

      {step === 'cart' && (
        <div style={{ padding: '0 20px' }}>
          {/* Items */}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map(item => (
              <div key={item.productId} style={{
                display: 'flex', gap: 12, alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14, padding: '12px 14px',
              }}>
                {item.image && (
                  <img src={item.image} alt={item.name} style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{item.name}</p>
                  <p style={{ color: '#A66A86', fontSize: 13, fontWeight: 700 }}>{item.currency} {(item.price * item.qty).toLocaleString()}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <button onClick={() => remove(item.productId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)', display: 'flex' }}>
                    <Trash2 size={13} />
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => qty(item.productId, -1)} style={{ width: 26, height: 26, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Minus size={11} color="#fff" />
                    </button>
                    <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, minWidth: 16, textAlign: 'center' }}>{item.qty}</span>
                    <button onClick={() => qty(item.productId, 1)} style={{ width: 26, height: 26, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Plus size={11} color="#fff" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total + proceed */}
          <div style={{ marginTop: 24, padding: '16px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Total</span>
              <span style={{ color: '#A66A86', fontSize: 18, fontWeight: 700 }}>{currency} {total.toLocaleString()}</span>
            </div>
            <button
              onClick={() => setStep('checkout')}
              style={{ width: '100%', backgroundColor: '#A66A86', border: 'none', borderRadius: 12, padding: '14px', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      )}

      {step === 'checkout' && (
        <div style={{ padding: '20px 20px 0' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginBottom: 20 }}>
            Your order will be sent to us via WhatsApp and we&apos;ll confirm delivery with you directly.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Your name</label>
              <input type="text" value={form.name} required placeholder="Full name"
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={inputStyle} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Phone number</label>
              <input type="tel" value={form.phone} required placeholder="e.g. 0241234567"
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                style={inputStyle} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>Delivery location</label>
              <input type="text" value={form.location} required placeholder="e.g. East Legon, Accra"
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                style={inputStyle} />
            </div>
          </div>

          {/* Order summary */}
          <div style={{ marginTop: 24, padding: 14, backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12 }}>
            {items.map(i => (
              <div key={i.productId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{i.qty}× {i.name}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{i.currency} {(i.price * i.qty).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', margin: '10px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Total</span>
              <span style={{ color: '#A66A86', fontSize: 15, fontWeight: 700 }}>{currency} {total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            disabled={!form.name || !form.phone || !form.location}
            style={{
              marginTop: 20, width: '100%', border: 'none', borderRadius: 12, padding: '14px',
              backgroundColor: '#25D366', color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: (!form.name || !form.phone || !form.location) ? 'default' : 'pointer',
              opacity: (!form.name || !form.phone || !form.location) ? 0.5 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Send order via WhatsApp
          </button>
        </div>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10, padding: '12px 14px', color: '#ffffff', fontSize: 15, outline: 'none',
  boxSizing: 'border-box',
}
