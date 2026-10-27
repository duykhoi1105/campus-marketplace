import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useAppTheme } from '@/hooks/useThemeColor';
import { Spacing, BorderRadius, Typography, TouchTarget } from '@/constants/layout';

export default function NotFoundScreen() {
  const { colors } = useAppTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Không tìm thấy trang' }} />
      <View
        style={[styles.container, { backgroundColor: colors.background }]}
        accessibilityRole="alert"
        accessibilityLabel="Thông báo lỗi 404: Trang không tồn tại"
      >
        <Text style={{ fontSize: 64, marginBottom: Spacing.md }}>🔍</Text>
        <Text
          style={[
            styles.title,
            Typography.heading,
            { color: colors.textPrimary },
          ]}
        >
          Trang không tồn tại
        </Text>
        <Text
          style={[
            styles.subtitle,
            Typography.body,
            { color: colors.textSecondary, marginTop: Spacing.xs, textAlign: 'center' },
          ]}
        >
          Đường dẫn bạn vừa truy cập không có trên hệ thống Chợ Sinh Viên DNTU.
        </Text>

        <Link href="/(tabs)" asChild>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: colors.tint, marginTop: Spacing.xl },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Quay về Chợ Sinh Viên"
          >
            <Text
              style={[
                styles.buttonText,
                Typography.title,
                { color: colors.onTint },
              ]}
            >
              🏠 Quay về Chợ Sinh Viên
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    maxWidth: 320,
  },
  button: {
    minHeight: TouchTarget.minHeight,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '700',
  },
});

