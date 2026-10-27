
import React, { useEffect } from 'react';
import { Stack, usePathname, useRouter, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useAppTheme } from '@/hooks/useThemeColor';
import { useAuthStore } from '@/store/useAuthStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useCartStore } from '@/store/useCartStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const navigationState = useRootNavigationState();

  const { colors, theme } = useAppTheme();

  const restoreSession = useAuthStore(state => state.restoreSession);
  const user = useAuthStore(state => state.user);
  const isInitialized = useAuthStore(state => state.isInitialized);

  const hydrateFavorites = useFavoriteStore(state => state.hydrate);
  const hydrateCart = useCartStore(state => state.hydrate);

  // Khởi tạo dữ liệu và khôi phục phiên đúng một lần.
  useEffect(() => {
    void restoreSession();
    void hydrateFavorites();
    void hydrateCart();
  }, [restoreSession, hydrateFavorites, hydrateCart]);

  // Chỉ điều hướng sau khi navigation sẵn sàng và phiên đã được kiểm tra.
useEffect(() => {
  if (!navigationState?.key || !isInitialized) {
    return;
  }

  // Đã đăng nhập: không cần ở màn hình đăng nhập.
  if (user && pathname === '/login') {
    router.replace('/(tabs)');
    return;
  }

  // Chỉ các chức năng giao dịch/đăng tin mới bắt buộc đăng nhập.
  const protectedPaths = ['/checkout', '/listing-form'];
  const requiresLogin = protectedPaths.some(
    path => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!user && requiresLogin) {
    router.replace('/login');
  }
}, [
  navigationState?.key,
  isInitialized,
  user,
  pathname,
  router,
]);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.backgroundCard,
          },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            fontWeight: '700',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="listing/[id]"
          options={{
            title: 'Chi tiết tin đăng',
            headerBackTitle: 'Chợ',
          }}
        />

        <Stack.Screen
          name="listing-form"
          options={{
            presentation: 'modal',
            title: 'Đăng / Sửa tin',
          }}
        />

        <Stack.Screen
          name="checkout"
          options={{
            title: 'Tóm tắt thanh toán',
            headerBackTitle: 'Giỏ hàng',
          }}
        />

        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="+not-found"
          options={{
            title: 'Không tìm thấy trang',
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
