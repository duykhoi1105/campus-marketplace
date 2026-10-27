import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useAppTheme } from '@/hooks/useThemeColor';
import { Spacing, BorderRadius, Typography, TouchTarget } from '@/constants/layout';

interface LoadingViewProps {
  message?: string;
}

export function LoadingView({ message = 'Đang tải dữ liệu...' }: LoadingViewProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[styles.centerContainer, { backgroundColor: colors.background }]}
      accessibilityRole="progressbar"
      accessibilityLabel={message}
    >
      <ActivityIndicator size="large" color={colors.tint} />
      <Text
        style={[
          styles.stateText,
          Typography.body,
          { color: colors.textSecondary, marginTop: Spacing.md },
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

interface EmptyViewProps {
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  iconName?: string;
}

export function EmptyView({
  title,
  description,
  actionText,
  onAction,
}: EmptyViewProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[styles.centerContainer, { backgroundColor: colors.background }]}
      accessibilityRole="text"
    >
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: colors.backgroundSecondary, borderColor: colors.borderDefault },
        ]}
      >
        <Text style={[styles.emptyIcon, { color: colors.textMuted }]}>📦</Text>
      </View>
      <Text
        style={[
          styles.titleText,
          Typography.title,
          { color: colors.textPrimary, marginTop: Spacing.md },
        ]}
      >
        {title}
      </Text>
      {description ? (
        <Text
          style={[
            styles.stateText,
            Typography.body,
            { color: colors.textSecondary, marginTop: Spacing.xs, textAlign: 'center' },
          ]}
        >
          {description}
        </Text>
      ) : null}

      {actionText && onAction ? (
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: colors.tint, marginTop: Spacing.lg },
          ]}
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionText}
        >
          <Text
            style={[
              styles.actionButtonText,
              Typography.bodyLarge,
              { color: colors.onTint },
            ]}
          >
            {actionText}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
  retryText?: string;
}

export function ErrorView({
  message,
  onRetry,
  retryText = 'Thử lại',
}: ErrorViewProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[styles.centerContainer, { backgroundColor: colors.background }]}
      accessibilityRole="alert"
    >
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: colors.dangerBg, borderColor: colors.danger },
        ]}
      >
        <Text style={styles.emptyIcon}>⚠️</Text>
      </View>
      <Text
        style={[
          styles.titleText,
          Typography.title,
          { color: colors.danger, marginTop: Spacing.md },
        ]}
      >
        Đã có lỗi xảy ra
      </Text>
      <Text
        style={[
          styles.stateText,
          Typography.body,
          { color: colors.textSecondary, marginTop: Spacing.xs, textAlign: 'center' },
        ]}
      >
        {message}
      </Text>

      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: colors.tint, marginTop: Spacing.lg },
        ]}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel={retryText}
      >
        <Text
          style={[
            styles.actionButtonText,
            Typography.bodyLarge,
            { color: colors.onTint },
          ]}
        >
          {retryText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: BorderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  emptyIcon: {
    fontSize: 32,
  },
  titleText: {
    textAlign: 'center',
  },
  stateText: {
    maxWidth: 300,
  },
  actionButton: {
    minWidth: 130,
    minHeight: TouchTarget.minHeight,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontWeight: '600',
  },
});

