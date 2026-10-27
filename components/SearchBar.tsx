import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useAppTheme } from '@/hooks/useThemeColor';
import { Spacing, BorderRadius, Typography, TouchTarget } from '@/constants/layout';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Tìm sách, giáo trình, đồ dùng...',
  onClear,
}: SearchBarProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.backgroundInput,
          borderColor: colors.borderDefault,
        },
      ]}
    >
      <Text style={[styles.searchIcon, { color: colors.textMuted }]}>🔍</Text>
      <TextInput
        style={[
          styles.input,
          Typography.body,
          {
            color: colors.textPrimary,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        accessibilityRole="search"
        accessibilityLabel="Ô tìm kiếm tin đăng trong chợ sinh viên"
      />
      {value.length > 0 ? (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            onChangeText('');
            onClear?.();
          }}
          accessibilityRole="button"
          accessibilityLabel="Xóa từ khóa tìm kiếm"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.clearIcon, { color: colors.textMuted }]}>✕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    minHeight: TouchTarget.minHeight,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: Spacing.xs,
  },
  clearButton: {
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearIcon: {
    fontSize: 14,
    fontWeight: '700',
  },
});

