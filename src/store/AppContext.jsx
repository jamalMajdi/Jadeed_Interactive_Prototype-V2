import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import {
  ADDRESSES,
  COUPONS,
  DELIVERY_FEE_INSIDE_CITY,
  MERCHANT,
  ORDER_STAGES,
  PRODUCTS,
  SEED_ORDERS,
  STAGE_INDEX,
  productById,
  storeById,
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
  authPrompt: null, // { productName, returnTo } — نافذة مطالبة الزائر بالدخول/إنشاء حساب عند الإضافة للسلة
  // التنقل: مكدس شاشات يسمح بالرجوع
  stack: [{ name: 'splash' }],
  // المصادقة
  auth: { status: 'guest', accountType: 'customer', email: '', otpAttempts: 0, lockedUntil: null, returnTo: null },
  // السلة: { productId: qty }
  cart: {},
  coupon: null,
  favorites: new Set(['p-headphones']),
  addressId: 'a1',
  addresses: ADDRESSES,
  orders: SEED_ORDERS,
  orderCounter: 984210,
  // التاجر — متجر واحد فقط (MERCHANT.storeId)
  merchantProducts: PRODUCTS.filter((p) => p.storeId === MERCHANT.storeId).map((p) => p.id),
  // none | pending | approved | rejected | banned — يصبح approved فقط عند حساب تاجر أو بعد اعتماد طلب المتجر (نوع الحساب واحد: عميل أو تاجر)
  merchantStatus: 'none',
  storeOpen: true, // حالة المتجر (مفتوح/مغلق) يتحكم بها التاجر من اللوحة — تؤثر على واجهة العميل واستقبال الطلبات
  seenNotifications: false,
  offline: false, // حالة انقطاع الإنترنت (تُقرأ من المتصفح أو تُحاكى من لوحة العرض)
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
      // نوع الحساب واحد فقط: عميل أو تاجر
      return ['customer', 'merchant'].includes(action.accountType) ? { ...state, auth: { ...state.auth, accountType: action.accountType } } : state
    case 'SET_EMAIL':
      return { ...state, auth: { ...state.auth, email: action.email, otpAttempts: 0 } }
    case 'OTP_FAIL': {
      const attempts = state.auth.otpAttempts + 1
      const locked = attempts >= OTP_MAX_ATTEMPTS
      return { ...state, auth: { ...state.auth, otpAttempts: attempts, lockedUntil: locked ? Date.now() + 15 * 60 * 1000 : null } }
    }
    case 'OTP_RESET':
      return { ...state, auth: { ...state.auth, otpAttempts: 0, lockedUntil: null } }
    case 'LOGIN': {
      const isMerchantAccount = state.auth.accountType === 'merchant'
      return {
        ...state,
        auth: { ...state.auth, status: 'authenticated', otpAttempts: 0, lockedUntil: null },
        authPrompt: null,
        // الحظر لا يُرفع بإعادة تسجيل الدخول (يبقى حتى تقرر الإدارة)
        merchantStatus: isMerchantAccount ? (state.merchantStatus === 'banned' ? 'banned' : 'approved') : state.merchantStatus,
      }
    }
    case 'AUTH_GATE': // حفظ الوجهة للعودة إليها بعد تسجيل الدخول
      return { ...state, auth: { ...state.auth, returnTo: action.returnTo || null } }
    case 'CLEAR_RETURN_TO':
      return { ...state, auth: { ...state.auth, returnTo: null } }
    case 'LOGOUT':
      // الخروج لا يجبر على الدخول مجدداً: يعود المستخدم للتصفح كزائر (التصفح متاح، والإضافة للسلة تتطلب حساب عميل)
      return { ...initialState, stack: [{ name: 'home' }], orders: state.orders }
    case 'AUTH_PROMPT': // مطالبة الزائر بتسجيل الدخول أو إنشاء حساب عميل (نافذة واضحة بدل تحويل صامت)
      return { ...state, authPrompt: action.prompt }
    case 'AUTH_PROMPT_CLOSE':
      return { ...state, authPrompt: null }

    // ── السلة ─────────────────────────────────────────────────
    case 'ADD_TO_CART': {
      if (state.auth.status !== 'authenticated') return state // الإضافة للسلة للمسجّلين فقط
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
    // موقع واحد لكل حساب: التحديث يستبدل بيانات الموقع الحالي (لا تُنشأ عناوين متعددة)
    case 'UPDATE_ADDRESS': {
      const current = state.addresses.find((a) => a.id === state.addressId) || state.addresses[0]
      const updated = { ...current, ...action.patch, id: current?.id || 'a1' }
      return { ...state, addresses: [updated], addressId: updated.id }
    }
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
    case 'PLACE_ORDERS': {
      // طلب مستقل لكل متجر — لا تُخلط طلبات المتاجر في طلب واحد
      let counter = state.orderCounter
      const created = action.orders.map((o) => ({ ...o, id: `JD-${counter++}`, stage: 'new', createdAt: 'الآن' }))
      return { ...state, orders: [...created, ...state.orders], orderCounter: counter, cart: {}, coupon: null }
    }
    case 'CONFIRM_PAYMENT': {
      // تأكيد التاجر لاستلام التحويل: يُثبت الدفع وينقل الطلب مباشرة إلى التجهيز دون خطوة يدوية إضافية
      return {
        ...state,
        orders: state.orders.map((o) => (o.id === action.orderId ? { ...o, paymentStatus: 'paid', stage: o.stage === 'new' ? 'preparing' : o.stage } : o)),
      }
    }
    case 'SET_ORDER_STAGE': {
      return {
        ...state,
        orders: state.orders.map((o) => (o.id === action.orderId ? { ...o, stage: action.stage } : o)),
      }
    }
    case 'CANCEL_ORDER':
      // by: 'customer' (افتراضي) | 'merchant' — التاجر يستطيع الإلغاء حتى بعد القبول مع سبب يظهر للعميل
      return { ...state, orders: state.orders.map((o) => (o.id === action.orderId ? { ...o, stage: 'cancelled', cancelledBy: action.by || 'customer', cancelReason: action.reason || null, cancelledFrom: o.stage } : o)) }
    case 'REJECT_ORDER':
      return { ...state, orders: state.orders.map((o) => (o.id === action.orderId ? { ...o, stage: 'rejected' } : o)) }

    // ── التاجر ────────────────────────────────────────────────
    case 'MERCHANT_STATUS':
      return { ...state, merchantStatus: action.status }
    case 'SET_STORE_OPEN':
      return { ...state, storeOpen: !!action.open, catalogVersion: state.catalogVersion + 1 }
    case 'SET_OFFLINE':
      return state.offline === action.offline ? state : { ...state, offline: action.offline }
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

  // ── تجميع السلة حسب المتجر: كل متجر بمنتجاته ومجموعه الفرعي (ويُنشأ له طلب مستقل عند الدفع) ──
  const byStore = new Map()
  lines.forEach((l) => {
    const sid = l.product.storeId
    if (!byStore.has(sid)) byStore.set(sid, [])
    byStore.get(sid).push(l)
  })
  let allocated = 0
  const groups = [...byStore.entries()].map(([storeId, gl], i, arr) => {
    const store = storeById(storeId)
    const gSubtotal = gl.reduce((s, l) => s + l.lineTotal, 0)
    const gItems = gl.reduce((s, l) => s + l.qty, 0)
    // توزيع الخصم على المتاجر بنسبة مجموع كل متجر (آخر متجر يمتص فرق التقريب)
    const isLast = i === arr.length - 1
    const gDiscount = !discount ? 0 : isLast ? discount - allocated : Math.round((discount * gSubtotal) / subtotal)
    allocated += gDiscount
    const gDelivery = DELIVERY_FEE_INSIDE_CITY
    return {
      storeId,
      store,
      lines: gl,
      subtotal: gSubtotal,
      itemCount: gItems,
      discount: gDiscount,
      deliveryFee: gDelivery,
      total: Math.max(0, gSubtotal - gDiscount + gDelivery),
      minOrderMet: !store || gSubtotal >= (store.minOrder || 0),
      storeClosed: !!store && store.open === false, // المتجر مغلق: لا يستقبل طلبات جديدة
    }
  })

  return { lines, groups, storeCount: groups.length, subtotal, itemCount, discount, coupon, couponCode: coupon ? couponCode : null, deliveryFee, total }
}

// تعديلات كتالوج المنتجات المشترك تتم هنا (خارج الـ reducer النقي) وبشكل idempotent
function applyCatalogSideEffects(action) {
  if (action.type === 'SET_STORE_OPEN') {
    const st = storeById(MERCHANT.storeId)
    if (st) st.open = !!action.open
  }
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
  const stateRef = useRef(state)
  stateRef.current = state

  const showToast = useCallback((message, tone = 'dark') => {
    clearTimeout(toastTimer.current)
    setToast({ message, tone, id: Date.now() })
    toastTimer.current = setTimeout(() => setToast(null), 2200)
  }, [])

  // انقطاع الإنترنت: يُقرأ من المتصفح مباشرة (online/offline) ويمكن محاكاته من لوحة العرض عبر SET_OFFLINE
  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const sync = () => dispatch({ type: 'SET_OFFLINE', offline: !navigator.onLine })
    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)
    if (!navigator.onLine) sync()
    return () => { window.removeEventListener('online', sync); window.removeEventListener('offline', sync) }
  }, [])

  const navigate = useCallback((name, params = {}, opts = {}) => dispatch({ type: 'NAVIGATE', screen: { name, params }, ...opts }), [])
  const back = useCallback(() => dispatch({ type: 'BACK' }), [])
  const switchTab = useCallback((tab) => dispatch({ type: 'SWITCH_TAB', tab }), [])

  // بوابة تسجيل الدخول: تُستدعى فقط عند الحاجة (المفضلة، الطلبات، إتمام الشراء…)
  // تعيد true إذا كان المستخدم مسجّلاً، وإلا تحفظ الوجهة وتفتح شاشة الدخول
  const requireAuth = useCallback(
    (returnTo, message = 'سجّل الدخول للمتابعة') => {
      if (stateRef.current.auth.status === 'authenticated') return true
      dispatch({ type: 'AUTH_GATE', returnTo: returnTo || stateRef.current.stack[stateRef.current.stack.length - 1] })
      showToast(message, 'primary')
      dispatch({ type: 'NAVIGATE', screen: { name: 'login', params: { gated: true } } })
      return false
    },
    [showToast],
  )

  // الإضافة للسلة تتطلب حساب عميل: الزائر يتصفح بحرية، وعند محاولة الإضافة تظهر له نافذة واضحة
  // بخياري «تسجيل الدخول» و«إنشاء حساب كعميل» مع حفظ الشاشة الحالية للعودة إليها بعد الدخول
  const requireCustomer = useCallback((productName) => {
    if (stateRef.current.auth.status === 'authenticated') return true
    const stack = stateRef.current.stack
    dispatch({ type: 'AUTH_PROMPT', prompt: { productName, returnTo: stack[stack.length - 1] } })
    return false
  }, [])

  const cartSummary = useMemo(() => computeCart(state.cart, state.coupon), [state.cart, state.coupon, state.catalogVersion])

  // محاكاة تقدم الطلب تلقائيًا (كأن التاجر يعالجه) — يمكن للتاجر تسريعه يدويًا من لوحته
  // دورة مبسّطة: جديد → قيد التجهيز (30 ث) → في الطريق (30 ث) → تم التوصيل (40 ث)
  // الطلبات المدفوعة بالتحويل تنتظر تأكيد التاجر ولا تتقدم تلقائياً من «جديد»
  const AUTO_DELAYS = { new: 30000, preparing: 30000, out: 40000 }
  useEffect(() => {
    if (!autoAdvance) return undefined
    const timers = state.orders
      .filter((o) => AUTO_DELAYS[o.stage] !== undefined && !(o.stage === 'new' && o.paymentStatus === 'pending_confirmation'))
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
      isAuthenticated: state.auth.status === 'authenticated',
      isMerchant: state.merchantStatus === 'approved',
      isBanned: state.merchantStatus === 'banned',
      requireAuth,
      requireCustomer,
      isFavorite: (id) => state.favorites.has(id),
      toast,
      showToast,
      addressById: (id) => state.addresses.find((a) => a.id === id),
      currentAddress: state.addresses.find((a) => a.id === state.addressId) || state.addresses[0],
      merchantStore: storeById(MERCHANT.storeId), // متجر التاجر الوحيد
    }),
    [state, cartSummary, navigate, back, switchTab, toast, showToast, requireAuth, requireCustomer],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
