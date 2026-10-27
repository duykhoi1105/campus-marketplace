import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
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
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  
const handleLogin = async (
  customEmail?: string,
  customPassword?: string
) => {
  const targetEmail = (
    customEmail !== undefined ? customEmail : email
  ).trim();

  const targetPass = (
    customPassword !== undefined ? customPassword : password
  ).trim();

  if (!targetEmail) {
    setErrorMsg(
      'Vui lòng nhập Email sinh viên hoặc Mã số sinh viên (MSSV).'
    );
    return;
  }

  if (targetPass.length < 4) {
    setErrorMsg('Mật khẩu phải có tối thiểu 4 ký tự.');
    return;
  }

  setErrorMsg('');

  const success = await login(targetEmail, targetPass);

  if (success) {
    router.replace('/(tabs)');
  } else {
    setErrorMsg(
      'Không thể đăng nhập. Vui lòng kiểm tra lại thông tin hoặc mạng.'
    );
  }
}; // Quan trọng: đóng hàm handleLogin tại đây

const handleGuestContinue = () => {
  router.replace('/(tabs)');
};


  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={[
          styles.loginBox,
          { backgroundColor: colors.backgroundCard, borderColor: colors.borderDefault },
        ]}
      >
        {/* Header trường và logo */}
        <View style={styles.header}>
          <Text style={{ fontSize: 50, textAlign: 'center' }}>🎓</Text>
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
            Trường Đại học Công nghệ Đồng Nai — Khoa CNTT
          </Text>
        </View>

        {/* Thông báo lỗi nếu có */}
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

        {/* Input Email / MSSV */}
        <Text style={[styles.inputLabel, Typography.bodySmall, { color: colors.textSecondary }]}>
          Email hoặc Mã số sinh viên (MSSV) <Text style={{ color: colors.danger }}>*</Text>
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
          onChangeText={text => {
            setEmail(text);
            if (errorMsg) setErrorMsg('');
          }}
          placeholder="1923050528 hoặc 1923050528@dntu.edu.vn"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          accessibilityLabel="Nhập email sinh viên hoặc mã số sinh viên"
        />

        {/* Input Mật khẩu có nút ẩn/hiện */}
        <Text
          style={[
            styles.inputLabel,
            Typography.bodySmall,
            { color: colors.textSecondary, marginTop: Spacing.md },
          ]}
        >
          Mật khẩu tài khoản
        </Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={[
              styles.passwordInput,
              Typography.body,
              {
                backgroundColor: colors.backgroundInput,
                borderColor: colors.borderDefault,
                color: colors.textPrimary,
              },
            ]}
            value={password}
            onChangeText={text => {
              setPassword(text);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="Nhập mật khẩu (mặc định demo: 123456)"
            placeholderTextColor={colors.textMuted}
            secureTextEntry={!showPassword}
            accessibilityLabel="Nhập mật khẩu đăng nhập"
          />
          <TouchableOpacity
            style={[styles.eyeBtn, { backgroundColor: colors.backgroundSecondary }]}
            onPress={() => setShowPassword(prev => !prev)}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            <Text style={{ fontSize: 18 }}>{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>

        {/* Nút Đăng nhập chính */}
        <TouchableOpacity
          style={[styles.loginBtn, { backgroundColor: colors.tint, marginTop: Spacing.lg }]}
          onPress={() => handleLogin()}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Đăng nhập tài khoản vào Chợ Sinh Viên"
        >
          {isLoading ? (
            <ActivityIndicator color={colors.onTint} />
          ) : (
            <Text style={[Typography.title, { color: colors.onTint, fontWeight: '700' }]}>
              🔐 Đăng nhập ngay
            </Text>
          )}
        </TouchableOpacity>

        {/* Đường phân cách */}
        <View
          style={[
            styles.divider,
            { backgroundColor: colors.borderLight, marginVertical: Spacing.lg },
          ]}
        />

        {/* Đăng nhập nhanh một chạm phục vụ chấm thi */}
        <Text
          style={[
            Typography.caption,
            { color: colors.textMuted, textAlign: 'center', marginBottom: Spacing.sm },
          ]}
        >
          ⚡ Đăng nhập Demo một chạm (Phục vụ Hội đồng chấm đồ án):
        </Text>

        <View style={styles.demoButtonsRow}>
          <TouchableOpacity
            style={[
              styles.demoBtn,
              { backgroundColor: colors.infoBg, borderColor: colors.info },
            ]}
            onPress={() => handleLogin('1923050528@dntu.edu.vn', '123456')}
            accessibilityRole="button"
            accessibilityLabel="Đăng nhập nhanh tài khoản Người mua Nguyễn Duy Khôi"
          >
            <Text style={[Typography.caption, { color: colors.info, fontWeight: '700' }]}>
              👤 Người Mua (Duy Khôi)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.demoBtn,
              { backgroundColor: colors.warningBg, borderColor: colors.warning },
            ]}
            onPress={() => handleLogin('duykhoi.seller@dntu.edu.vn', '123456')}
            accessibilityRole="button"
            accessibilityLabel="Đăng nhập nhanh tài khoản Người bán Store DNTU"
          >
            <Text style={[Typography.caption, { color: colors.warning, fontWeight: '700' }]}>
              🏷️ Người Bán (Store DNTU)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tiếp tục với tư cách Khách */}
        <TouchableOpacity
          style={[
            styles.guestBtn,
            { backgroundColor: colors.backgroundSecondary, borderColor: colors.borderDefault },
          ]}
          onPress={handleGuestContinue}
          accessibilityRole="button"
          accessibilityLabel="Tiếp tục duyệt chợ với tư cách Khách"
        >
          <Text style={[Typography.bodySmall, { color: colors.textSecondary, fontWeight: '600' }]}>
            Duyệt chợ với tư cách Khách ➔
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingVertical: Spacing.xxl,
    justifyContent: 'center',
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
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    minHeight: TouchTarget.minHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  eyeBtn: {
    width: 44,
    height: TouchTarget.minHeight,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.xs,
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
  guestBtn: {
    minHeight: TouchTarget.minHeight,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
});
