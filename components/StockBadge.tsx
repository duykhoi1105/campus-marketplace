import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/hooks/useThemeColor';
import { Spacing, BorderRadius, Typography } from '@/constants/layout';

interface StockBadgeProps {
  stock: number;
}

export function StockBadge({ stock }: StockBadgeProps) {
  const { colors } = useAppTheme();

  if (stock <= 0) {
    return (
      <View
        style={[styles.badge, { backgroundColor: colors.stockOutBg }]}
        accessibilityRole="text"
        accessibilityLabel="Tình trạng: Hết hàng"
      >
        <Text style={[styles.text, Typography.caption, { color: colors.stockOut }]}>
          ✕ Hết hàng
        </Text>
      </View>
    );
  }

  if (stock <= 2) {
    return (
      <View
        style={[styles.badge, { backgroundColor: colors.stockLowBg }]}
        accessibilityRole="text"
        accessibilityLabel={`Tình trạng: Sắp hết, còn ${stock} sản phẩm`}
      >
        <Text style={[styles.text, Typography.caption, { color: colors.stockLow }]}>
          ⚡ Chỉ còn {stock}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.badge, { backgroundColor: colors.stockInBg }]}
      accessibilityRole="text"
      accessibilityLabel={`Tình trạng: Còn hàng, tồn kho ${stock}`}
    >
      <Text style={[styles.text, Typography.caption, { color: colors.stockIn }]}>
        ✓ Còn {stock}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.xs,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '700',
  },
});

