import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppTheme } from '@/hooks/useThemeColor';
import { Spacing, BorderRadius, Typography, TouchTarget } from '@/constants/layout';

interface OfflineBannerProps {
  isOffline: boolean;
  lastSyncedAt: string | null;
  onRetry?: () => void;
}

export function OfflineBanner({
  isOffline,
  lastSyncedAt,
  onRetry,
}: OfflineBannerProps) {
  const { colors } = useAppTheme();

  if (!isOffline) return null;

  const formattedTime = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
      })
    : 'Chưa có dữ liệu đồng bộ trước đó';

  return (
    <View
      style={[
        styles.bannerContainer,
        {
          backgroundColor: colors.warningBg,
          borderColor: colors.warning,
        },
      ]}
      accessibilityRole="alert"
      accessibilityLabel={`Đang ngoại tuyến. Dữ liệu gần nhất cập nhật lúc ${formattedTime}`}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.title, Typography.bodySmall, { color: colors.warning }]}>
          ⚠️ Bạn đang ngoại tuyến — Đang xem dữ liệu gần nhất
        </Text>
        <Text
          style={[styles.timestamp, Typography.caption, { color: colors.textSecondary }]}
        >
          Lần tải thành công: {formattedTime}
        </Text>
      </View>

      {onRetry ? (
        <TouchableOpacity
          style={[
            styles.retryButton,
            { backgroundColor: colors.warning },
          ]}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Thử lại kết nối mạng"
        >
          <Text style={[styles.retryText, Typography.caption, { color: colors.onWarning }]}>
            Kết nối lại
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  textContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    fontWeight: '700',
  },
  timestamp: {
    marginTop: Spacing.xxs,
  },
  retryButton: {
    minHeight: TouchTarget.minHeight,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryText: {
    fontWeight: '700',
  },
});

