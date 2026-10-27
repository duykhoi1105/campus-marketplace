import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/useThemeColor';
import { useAuthStore } from '@/store/useAuthStore';
import { Spacing, BorderRadius, Typography, TouchTarget } from '@/constants/layout';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.isLoading);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (customEmail?: string) => {
    const target = customEmail || email;
    if (!target.trim()) {
      setErrorMsg('Vui lòng nhập email hoặc mã số sinh viên.');
      return;
    }

    setErrorMsg('');
    const success = await login(target.trim());
    if (success) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    } else {
      setErrorMsg('Không thể đăng nhập. Vui lòng thử lại.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.loginBox,
          { backgroundColor: colors.backgroundCard, borderColor: colors.borderDefault },
        ]}
      >
        <View style={styles.header}>
          <Text style={{ fontSize: 48, textAlign: 'center' }}>🎓</Text>
          <Text
            style={[
              styles.title,
              Typography.heading,
              { color: colors.textPrimary, marginTop: Spacing.sm },
            ]}
          >
            Chợ Sinh Viên DNTU
          </Text>
          <Text
            style={[
              Typography.bodySmall,
              { color: colors.textSecondary, textAlign: 'center', marginTop: Spacing.xxs },
            ]}
          >
            Trường Đại học Công nghệ Đồng Nai
          </Text>
        </View>

        {errorMsg ? (
          <View
            style={[
              styles.errorBox,
              { backgroundColor: colors.dangerBg, borderColor: colors.danger },
            ]}
          >
            <Text style={[Typography.caption, { color: colors.danger, fontWeight: '600' }]}>
              ⚠️ {errorMsg}
            </Text>
          </View>
        ) : null}

        {/* Input email / MSSV */}
        <Text style={[styles.inputLabel, Typography.bodySmall, { color: colors.textSecondary }]}>
          Email hoặc Mã số sinh viên (MSSV)
        </Text>
        <TextInput
          style={[
            styles.input,
            Typography.body,
            {
              backgroundColor: colors.backgroundInput,
              borderColor: colors.borderDefault,
              color: colors.textPrimary,
            },
          ]}
          value={email}
          onChangeText={setEmail}
          placeholder="1923050528@dntu.edu.vn"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          accessibilityLabel="Nhập email hoặc mã sinh viên"
        />

        {/* Input mật khẩu */}
        <Text
          style={[
            styles.inputLabel,
            Typography.bodySmall,
            { color: colors.textSecondary, marginTop: Spacing.md },
          ]}
        >
          Mật khẩu
        </Text>
        <TextInput
          style={[
            styles.input,
            Typography.body,
            {
              backgroundColor: colors.backgroundInput,
              borderColor: colors.borderDefault,
              color: colors.textPrimary,
            },
          ]}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          accessibilityLabel="Nhập mật khẩu"
        />

        {/* Nút đăng nhập */}
        <TouchableOpacity
          style={[styles.loginBtn, { backgroundColor: colors.tint, marginTop: Spacing.lg }]}
          onPress={() => handleLogin()}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Đăng nhập tài khoản"
        >
          {isLoading ? (
            <ActivityIndicator color={colors.onTint} />
          ) : (
            <Text style={[Typography.title, { color: colors.onTint, fontWeight: '700' }]}>
              Đăng nhập
            </Text>
          )}
        </TouchableOpacity>

        <View
          style={[
            styles.divider,
            { backgroundColor: colors.borderLight, marginVertical: Spacing.lg },
          ]}
        />

        {/* Tài khoản Demo một chạm phục vụ chấm thi */}
        <Text
          style={[
            Typography.caption,
            { color: colors.textMuted, textAlign: 'center', marginBottom: Spacing.sm },
          ]}
        >
          ⚡ Đăng nhập Demo nhanh cho buổi bảo vệ đồ án:
        </Text>

        <View style={styles.demoButtonsRow}>
          <TouchableOpacity
            style={[
              styles.demoBtn,
              { backgroundColor: colors.backgroundSecondary, borderColor: colors.borderDefault },
            ]}
            onPress={() => handleLogin('1923050528@dntu.edu.vn')}
            accessibilityRole="button"
            accessibilityLabel="Đăng nhập tài khoản Người mua"
          >
            <Text style={[Typography.caption, { color: colors.tint, fontWeight: '700' }]}>
              👤 Người Mua (Duy Khôi)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.demoBtn,
              { backgroundColor: colors.backgroundSecondary, borderColor: colors.borderDefault },
            ]}
            onPress={() => handleLogin('duykhoi.seller@dntu.edu.vn')}
            accessibilityRole="button"
            accessibilityLabel="Đăng nhập tài khoản Người bán"
          >
            <Text style={[Typography.caption, { color: colors.warning, fontWeight: '700' }]}>
              🏷️ Người Bán (Store DNTU)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  loginBox: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontWeight: '700',
  },
  errorBox: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  input: {
    minHeight: TouchTarget.minHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  loginBtn: {
    minHeight: TouchTarget.minHeight + 6,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  demoBtn: {
    flex: 1,
    minHeight: TouchTarget.minHeight,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xs,
  },
});
