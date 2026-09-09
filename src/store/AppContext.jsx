import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import {
  ADDRESSES,
  COUPONS,
  DELIVERY_FEE_INSIDE_CITY,
  ORDER_STAGES,
  PRODUCTS,
  SEED_ORDERS,
  STAGE_INDEX,
  productById,
} from '../data/mock'

// ─────────────────────────────────────────────────────────────
//  App State (Context + useReducer)
//  يحاكي التطبيق الحقيقي: التنقل، السلة (حساب رياضي صحيح)،
//  المفضلة، الطلبات ودورة حياتها، المصادقة (OTP من 4 أرقام).
// ─────────────────────────────────────────────────────────────

const AppContext = createContext(null)

export const OTP_LENGTH = 4 // ← موحّد في كل الشاشات
export const OTP_MAX_ATTEMPTS = 3
export const DEMO_OTP = '1234'

const initialState = {
  // التنقل: مكدس شاشات يسمح بالرجوع
  stack: [{ name: 'splash' }],
  // المصادقة
  auth: { status: 'guest', accountType: 'customer', email: '', otpAttempts: 0, lockedUntil: null },
  // السلة: { productId: qty }
  cart: {},
  coupon: null,
  favorites: new Set(['p-headphones']),
  addressId: 'a1',
  addresses: ADDRESSES,
  orders: SEED_ORDERS,
  orderCounter: 984210,
  // التاجر
  merchantProducts: PRODUCTS.filter((p) => p.storeId === 'st-tech').map((p) => p.id),
  merchantStatus: 'approved', // none | pending | approved | rejected
  seenNotifications: false,
  catalogVersion: 0, // يزداد عند تعديل كتالوج المنتجات لإعادة حساب السلة
}

function reducer(state, action) {
  switch (action.type) {
    // ── التنقل ────────────────────────────────────────────────
    case 'NAVIGATE': {
      const { screen, replace, resetTo } = action
      if (resetTo) return { ...state, stack: [screen] }
      if (replace) return { ...state, stack: [...state.stack.slice(0, -1), screen] }
      return { ...state, stack: [...state.stack, screen] }
    }
    case 'BACK': {
      if (state.stack.length <= 1) return state
      return { ...state, stack: state.stack.slice(0, -1) }
    }
    case 'SWITCH_TAB': {
      // التبويبات جذرية: استبدل المكدس كله بشاشة التبويب
      return { ...state, stack: [{ name: action.tab }] }
    }

    // ── المصادقة ──────────────────────────────────────────────
    case 'SET_ACCOUNT_TYPE':
      return { ...state, auth: { ...state.auth, accountType: action.accountType } }
    case 'SET_EMAIL':
      return { ...state, auth: { ...state.auth, email: action.email, otpAttempts: 0 } }
    case 'OTP_FAIL': {
      const attempts = state.auth.otpAttempts + 1
      const locked = attempts >= OTP_MAX_ATTEMPTS
      return { ...state, auth: { ...state.auth, otpAttempts: attempts, lockedUntil: locked ? Date.now() + 15 * 60 * 1000 : null } }
    }
    case 'OTP_RESET':
      return { ...state, auth: { ...state.auth, otpAttempts: 0, lockedUntil: null } }
    case 'LOGIN':
      return { ...state, auth: { ...state.auth, status: 'authenticated', otpAttempts: 0, lockedUntil: null } }
    case 'LOGOUT':
      return { ...initialState, stack: [{ name: 'login' }], orders: state.orders }

    // ── السلة ─────────────────────────────────────────────────
    case 'ADD_TO_CART': {
      const p = productById(action.productId)
      if (!p || p.stock <= 0) return state
      const current = state.cart[action.productId] || 0
      const next = Math.min(current + (action.qty || 1), p.stock)
      return { ...state, cart: { ...state.cart, [action.productId]: next } }
    }
    case 'SET_QTY': {
      const p = productById(action.productId)
      const qty = Math.max(0, Math.min(action.qty, p ? p.stock : action.qty))
      const cart = { ...state.cart }
      if (qty === 0) delete cart[action.productId]
      else cart[action.productId] = qty
      return { ...state, cart }
    }
    case 'REMOVE_FROM_CART': {
      const cart = { ...state.cart }
      delete cart[action.productId]
      return { ...state, cart }
    }
    case 'CLEAR_CART':
      return { ...state, cart: {}, coupon: null }
    case 'APPLY_COUPON':
      return { ...state, coupon: action.code }
    case 'REMOVE_COUPON':
      return { ...state, coupon: null }

    // ── المفضلة ───────────────────────────────────────────────
    case 'TOGGLE_FAVORITE': {
      const favorites = new Set(state.favorites)
      favorites.has(action.productId) ? favorites.delete(action.productId) : favorites.add(action.productId)
      return { ...state, favorites }
    }

    // ── العناوين ──────────────────────────────────────────────
    case 'SET_ADDRESS':
      return { ...state, addressId: action.addressId }
    case 'ADD_ADDRESS': {
      const id = action.address.id || `a${Date.now()}`
      if (state.addresses.some((a) => a.id === id)) return state
      return { ...state, addresses: [...state.addresses, { ...action.address, id }], addressId: id }
    }

    // ── الطلبات ───────────────────────────────────────────────
    case 'PLACE_ORDER': {
      const counter = state.orderCounter
      const order = { ...action.order, id: `JD-${counter}`, stage: 'new', createdAt: 'الآن' }
      return { ...state, orders: [order, ...state.orders], orderCounter: counter + 1, cart: {}, coupon: null }
    }
    case 'SET_ORDER_STAGE': {
      return {
        ...state,
        orders: state.orders.map((o) => (o.id === action.orderId ? { ...o, stage: action.stage } : o)),
      }
    }
    case 'CANCEL_ORDER':
      return { ...state, orders: state.orders.map((o) => (o.id === action.orderId ? { ...o, stage: 'cancelled' } : o)) }
    case 'REJECT_ORDER':
      return { ...state, orders: state.orders.map((o) => (o.id === action.orderId ? { ...o, stage: 'rejected' } : o)) }

    // ── التاجر ────────────────────────────────────────────────
    case 'MERCHANT_STATUS':
      return { ...state, merchantStatus: action.status }
    case 'MERCHANT_DELETE_PRODUCT': {
      const cart = { ...state.cart }
      delete cart[action.productId]
      const favorites = new Set(state.favorites)
      favorites.delete(action.productId)
      return { ...state, cart, favorites, merchantProducts: state.merchantProducts.filter((id) => id !== action.productId), catalogVersion: state.catalogVersion + 1 }
    }
    case 'MERCHANT_ADD_PRODUCT':
      return { ...state, merchantProducts: [action.product.id, ...state.merchantProducts.filter((id) => id !== action.product.id)], catalogVersion: state.catalogVersion + 1 }
    case 'MERCHANT_UPDATE_PRODUCT':
      return { ...state, catalogVersion: state.catalogVersion + 1 }
    case 'MARK_NOTIFICATIONS_SEEN':
      return { ...state, seenNotifications: true }
    default:
      return state
  }
}

// ─────────────────────────────────────────────────────────────
//  حساب السلة — رياضي صحيح وموحّد
// ─────────────────────────────────────────────────────────────
export function computeCart(cart, couponCode) {
  const lines = Object.entries(cart)
    .map(([productId, qty]) => {
      const p = productById(productId)
      if (!p) return null
      return { product: p, qty, lineTotal: p.price * qty }
    })
    .filter(Boolean)

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0)
  const itemCount = lines.reduce((s, l) => s + l.qty, 0)

  let discount = 0
  const coupon = couponCode ? COUPONS[couponCode] : null
  if (coupon) {
    discount = coupon.type === 'percent' ? Math.round((subtotal * coupon.value) / 100) : Math.min(coupon.value, subtotal)
  }
  const deliveryFee = lines.length ? DELIVERY_FEE_INSIDE_CITY : 0
  const total = Math.max(0, subtotal - discount + deliveryFee)

  return { lines, subtotal, itemCount, discount, coupon, couponCode: coupon ? couponCode : null, deliveryFee, total }
}

// تعديلات كتالوج المنتجات المشترك تتم هنا (خارج الـ reducer النقي) وبشكل idempotent
function applyCatalogSideEffects(action) {
  if (action.type === 'MERCHANT_ADD_PRODUCT' && !PRODUCTS.some((p) => p.id === action.product.id)) PRODUCTS.push({ ...action.product, deleted: false })
  if (action.type === 'MERCHANT_DELETE_PRODUCT') {
    const p = productById(action.productId)
    if (p) p.deleted = true
  }
  if (action.type === 'MERCHANT_UPDATE_PRODUCT') {
    const p = productById(action.productId)
    if (p) Object.assign(p, action.patch)
  }
}

// إنشاء حالة ابتدائية مع تجاوزات (يستخدمه معرض الشاشات لعرض كل شاشة بحالة محددة ومعزولة)
export const createInitialState = (overrides = {}) => ({ ...initialState, ...overrides })

export function AppProvider({ children, initial, autoAdvance = true }) {
  const [state, rawDispatch] = useReducer(reducer, initial, (init) => createInitialState(init || {}))
  const dispatch = useCallback((action) => {
    applyCatalogSideEffects(action)
    rawDispatch(action)
  }, [])
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const showToast = useCallback((message, tone = 'dark') => {
    clearTimeout(toastTimer.current)
    setToast({ message, tone, id: Date.now() })
    toastTimer.current = setTimeout(() => setToast(null), 2200)
  }, [])

  const navigate = useCallback((name, params = {}, opts = {}) => dispatch({ type: 'NAVIGATE', screen: { name, params }, ...opts }), [])
  const back = useCallback(() => dispatch({ type: 'BACK' }), [])
  const switchTab = useCallback((tab) => dispatch({ type: 'SWITCH_TAB', tab }), [])

  const cartSummary = useMemo(() => computeCart(state.cart, state.coupon), [state.cart, state.coupon, state.catalogVersion])

  // محاكاة تقدم الطلب تلقائيًا (كأن التاجر يعالجه) — يمكن للتاجر تسريعه يدويًا من لوحته
  // جديد → مقبول: 25 ث · ثم كل 15 ث مرحلة · خرج للتوصيل → تم التوصيل: 40 ث
  const AUTO_DELAYS = { new: 25000, accepted: 15000, preparing: 15000, ready: 15000, out: 40000 }
  useEffect(() => {
    if (!autoAdvance) return undefined
    const timers = state.orders
      .filter((o) => AUTO_DELAYS[o.stage] !== undefined)
      .map((o) =>
        setTimeout(() => {
          const nextStage = ORDER_STAGES[STAGE_INDEX[o.stage] + 1]?.key
          if (nextStage) dispatch({ type: 'SET_ORDER_STAGE', orderId: o.id, stage: nextStage })
        }, AUTO_DELAYS[o.stage]),
      )
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAdvance, state.orders.map((o) => `${o.id}:${o.stage}`).join('|')])

  const value = useMemo(
    () => ({
      state,
      dispatch,
      navigate,
      back,
      switchTab,
      current: state.stack[state.stack.length - 1],
      canGoBack: state.stack.length > 1,
      cart: cartSummary,
      cartCount: cartSummary.itemCount,
      isFavorite: (id) => state.favorites.has(id),
      toast,
      showToast,
      addressById: (id) => state.addresses.find((a) => a.id === id),
      currentAddress: state.addresses.find((a) => a.id === state.addressId),
    }),
    [state, cartSummary, navigate, back, switchTab, toast, showToast],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
