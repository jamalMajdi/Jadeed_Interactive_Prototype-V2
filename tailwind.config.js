/** @type {import('tailwindcss').Config} */
// ─────────────────────────────────────────────────────────────
//  Jadeed Design Tokens — نظام ألوان موحّد مستخرج من ملف Figma
//  (تم توحيد 10+ درجات برتقالي و6 درجات بنفسجي إلى سلّم واحد)
// ─────────────────────────────────────────────────────────────
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'Tahoma', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      colors: {
        // Primary — بنفسجي #5002C9
        primary: {
          DEFAULT: '#5002C9',
          50: '#F6F2FE',
          100: '#EDE5FD',
          200: '#D9C9FB',
          300: '#B99BF6',
          400: '#8F5EEE',
          500: '#6A2BE0',
          600: '#5002C9',
          700: '#4202A6',
          800: '#350285',
          900: '#26015F',
        },
        // Secondary — برتقالي #FF5715
        secondary: {
          DEFAULT: '#FF5715',
          50: '#FFF4EE',
          100: '#FFE6D9',
          200: '#FFC9AD',
          300: '#FFA477',
          400: '#FF7A3F',
          500: '#FF5715',
          600: '#E64400',
          700: '#B83600',
          800: '#8A2900',
          900: '#5C1B00',
        },
        // Neutral — سلّم رمادي واحد (Tailwind Gray) بدل خلط Gray/Slate
        ink: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        success: { DEFAULT: '#10B981', 50: '#ECFDF5', 100: '#D1FAE5', 700: '#047857' },
        danger: { DEFAULT: '#EF4444', 50: '#FEF2F2', 100: '#FEE2E2', 700: '#B91C1C' },
        warning: { DEFAULT: '#F59E0B', 50: '#FFFBEB', 100: '#FEF3C7', 700: '#B45309' },
        info: { DEFAULT: '#0284C7', 50: '#F0F9FF', 100: '#E0F2FE' },
      },
      borderRadius: {
        card: '16px',
        modal: '24px',
        field: '12px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.05)',
        elevated: '0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.06)',
        modal: '0 25px 50px -12px rgba(0,0,0,0.25)',
        // ظلال الأزرار — ناعمة ومنخفضة (احترافية). سُمّيت brand/accent عمداً كي لا تتعارض مع أدوات shadow-{color} في Tailwind
        // (التعارض السابق مع shadow-primary كان يُسقط الشفافية ويرسم الظل بلون صلب ثقيل)
        brand: '0 1px 2px rgba(80,2,201,0.18), 0 4px 10px -2px rgba(80,2,201,0.16)',
        accent: '0 1px 2px rgba(255,87,21,0.18), 0 4px 10px -2px rgba(255,87,21,0.16)',
        // عند التمرير/التركيز فقط: ارتفاع طفيف
        'brand-hover': '0 2px 4px rgba(80,2,201,0.16), 0 8px 16px -4px rgba(80,2,201,0.22)',
        'accent-hover': '0 2px 4px rgba(255,87,21,0.16), 0 8px 16px -4px rgba(255,87,21,0.22)',
        nav: '0 -4px 20px rgba(17,24,39,0.06)',
      },
      keyframes: {
        'slide-up': { from: { transform: 'translateY(24px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'pop': { '0%': { transform: 'scale(0.6)', opacity: 0 }, '70%': { transform: 'scale(1.08)' }, '100%': { transform: 'scale(1)', opacity: 1 } },
        'toast-in': { from: { transform: 'translate(-50%, 16px)', opacity: 0 }, to: { transform: 'translate(-50%, 0)', opacity: 1 } },
        'bounce-soft': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
      },
      animation: {
        'slide-up': 'slide-up .28s cubic-bezier(.2,.8,.2,1)',
        'fade-in': 'fade-in .22s ease-out',
        'pop': 'pop .45s cubic-bezier(.2,.8,.2,1)',
        'toast-in': 'toast-in .25s ease-out',
        'bounce-soft': 'bounce-soft .6s ease-in-out',
      },
    },
  },
  plugins: [],
}
