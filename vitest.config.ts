import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'react-native': 'react-native-web',
      'expo-secure-store': path.resolve(__dirname, './tests/mocks/mockSecureStore.ts'),
      '@react-native-async-storage/async-storage': path.resolve(__dirname, './tests/mocks/mockStorage.ts'),
    },
  },
  define: {
    __DEV__: true,
  },
});
