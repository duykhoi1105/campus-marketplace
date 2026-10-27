import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppTheme } from '@/hooks/useThemeColor';
import { useAuthStore } from '@/store/useAuthStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useCartStore } from '@/store/useCartStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 phút
      retry: 1,
    },
  },
});

export default function RootLayout() {
  const { colors, theme } = useAppTheme();
  const restoreSession = useAuthStore(state => state.restoreSession);
  const hydrateFavorites = useFavoriteStore(state => state.hydrate);
  const hydrateCart = useCartStore(state => state.hydrate);

  useEffect(() => {
    // Khôi phục phiên, dữ liệu yêu thích và giỏ hàng khi khởi động
    restoreSession();
    hydrateFavorites();
    hydrateCart();
  }, [restoreSession, hydrateFavorites, hydrateCart]);

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
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
            presentation: 'modal',
            title: 'Đăng nhập tài khoản',
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

