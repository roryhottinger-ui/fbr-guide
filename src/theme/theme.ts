/**
 * Theme tokens ported from the v3 mockup's `G` object.
 * Single source of truth for colours, spacing, radius, and typography.
 */

export const colors = {
  bg: '#F5F2EB',
  card: '#FFFFFF',
  green: '#1B5E38',
  greenDark: '#133F26',
  greenLight: '#EAF3EE',
  greenMid: '#27834F',
  greenBorder: '#B8D9C4',
  gold: '#B8922A',
  goldLight: '#FBF6E8',
  goldBorder: '#EDD89A',
  text: '#181818',
  textMid: '#4A4A4A',
  textLight: '#8A8A8A',
  border: '#E2DDD4',
  warn: '#B84A0C',
  warnLight: '#FEF0E8',
  warnBorder: '#F0C4A0',
  block: '#A01C0E',
  blockLight: '#FDE8E6',
  blockBorder: '#EBA89E',
  done: '#1B5E38',
  white: '#FFFFFF',
  // Home hero gradient endpoints
  heroFrom: '#2C4A35',
  heroTo: '#1A2E20',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  xxl: 16,
  pill: 20,
} as const;

/**
 * Font families. Headings use a serif (mockup uses Palatino; we load Lora as a
 * close free equivalent). Body uses the platform system sans-serif.
 */
export const fonts = {
  serif: 'Lora_700Bold',
  serifRegular: 'Lora_400Regular',
  // `undefined` lets RN fall back to the platform system sans-serif.
  sans: undefined as string | undefined,
} as const;

export const typography = {
  // Serif display headings
  h1: { fontFamily: fonts.serif, fontSize: 26, lineHeight: 32, letterSpacing: -0.5, color: colors.text },
  h2: { fontFamily: fonts.serif, fontSize: 21, lineHeight: 26, letterSpacing: -0.4, color: colors.text },
  h3: { fontFamily: fonts.serif, fontSize: 17, lineHeight: 22, letterSpacing: -0.3, color: colors.text },
  // Sans body
  body: { fontSize: 14, lineHeight: 21, color: colors.text },
  bodyMid: { fontSize: 13, lineHeight: 20, color: colors.textMid },
  small: { fontSize: 12, lineHeight: 18, color: colors.textMid },
  tiny: { fontSize: 11, lineHeight: 15, color: colors.textLight },
  label: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
    color: colors.textLight,
  },
} as const;

export const theme = { colors, spacing, radius, fonts, typography };
export type Theme = typeof theme;
export default theme;
