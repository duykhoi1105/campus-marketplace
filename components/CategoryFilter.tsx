import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useAppTheme } from '@/hooks/useThemeColor';
import { CATEGORIES, MarketCategory } from '@/types/marketplace';
import { Spacing, BorderRadius, Typography, TouchTarget } from '@/constants/layout';

interface CategoryFilterProps {
  selectedCategory: MarketCategory | 'all';
  onSelectCategory: (cat: MarketCategory | 'all') => void;
}

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const { colors } = useAppTheme();

  const allItems: { id: MarketCategory | 'all'; name: string; icon: string }[] = [
    { id: 'all', name: 'Tất cả', icon: '✨' },
    ...CATEGORIES.map(c => ({
      ...c,
      icon:
        c.id === 'textbooks'
          ? '📚'
          : c.id === 'electronics'
          ? '💻'
          : c.id === 'stationery'
          ? '✏️'
          : c.id === 'living'
          ? '🏠'
          : c.id === 'uniforms'
          ? '👕'
          : '📦',
    })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {allItems.map(item => {
        const isSelected = selectedCategory === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? colors.tint : colors.backgroundCard,
                borderColor: isSelected ? colors.tint : colors.borderDefault,
              },
            ]}
            onPress={() => onSelectCategory(item.id)}
            accessibilityRole="button"
            accessibilityLabel={`Lọc theo danh mục: ${item.name}`}
            accessibilityState={{ selected: isSelected }}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text
              style={[
                styles.label,
                Typography.bodySmall,
                {
                  color: isSelected ? colors.onTint : colors.textPrimary,
                  fontWeight: isSelected ? '700' : '500',
                },
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    minHeight: TouchTarget.minHeight,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
  },
  icon: {
    fontSize: 14,
    marginRight: Spacing.xs,
  },
  label: {},
});

