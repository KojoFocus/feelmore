export type CartItem = {
  id: string
  productId: string
  name: string
  price: number
  currency: string
  image: string | null
  qty: number
}

const KEY = 'fm_cart'

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { return [] }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('fm_cart_update'))
}

export function addToCart(item: Omit<CartItem, 'qty'>) {
  const cart = getCart()
  const idx = cart.findIndex(c => c.productId === item.productId)
  if (idx >= 0) {
    cart[idx].qty += 1
  } else {
    cart.push({ ...item, qty: 1 })
  }
  saveCart(cart)
}

export function removeFromCart(productId: string) {
  saveCart(getCart().filter(c => c.productId !== productId))
}

export function updateQty(productId: string, qty: number) {
  if (qty < 1) { removeFromCart(productId); return }
  const cart = getCart()
  const idx = cart.findIndex(c => c.productId === productId)
  if (idx >= 0) { cart[idx].qty = qty; saveCart(cart) }
}

export function clearCart() {
  saveCart([])
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((s, i) => s + i.price * i.qty, 0)
}
