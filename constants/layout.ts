/**
 * Layout Tokens - Khoảng cách, Bo góc & Kích thước chuẩn
 */

export const Spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 9999,
} as const;

export const Typography = {
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 18,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 22,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  heading: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
  },
  display: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
  },
} as const;

// Kích thước chuẩn cho Accessible Touch Target (tối thiểu 44 x 44)
export const TouchTarget = {
  minWidth: 44,
  minHeight: 44,
} as const;

