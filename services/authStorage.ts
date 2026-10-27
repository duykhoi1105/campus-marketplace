import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/marketplace';

const TOKEN_KEY = 'campus_auth_session_token_1923050528';
const USER_KEY = 'campus_auth_user_data_1923050528';

export const AuthStorage = {
  /**
   * Lưu Token bí mật qua SecureStore (Native) hoặc fallback an toàn
   */
  async saveToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(TOKEN_KEY, token);
        }
      } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      }
    } catch (e) {
      console.warn('Lỗi khi lưu token an toàn:', e);
    }
  },

  /**
   * Lấy Token bí mật
   */
  async getToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(TOKEN_KEY);
        }
        return null;
      }
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (e) {
      console.warn('Lỗi khi đọc token an toàn:', e);
      return null;
    }
  },

  /**
   * Xóa Token bí mật khi đăng xuất
   */
  async deleteToken(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(TOKEN_KEY);
        }
      } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch (e) {
      console.warn('Lỗi khi xóa token an toàn:', e);
    }
  },

  /**
   * Lưu thông tin profile người dùng không nhạy cảm
   */
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Lỗi khi lưu thông tin người dùng:', e);
    }
  },

  /**
   * Lấy thông tin profile người dùng
   */
  async getUser(): Promise<User | null> {
    try {
      const raw = await AsyncStorage.getItem(USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as User;
    } catch (e) {
      console.warn('Lỗi khi đọc thông tin người dùng:', e);
      return null;
    }
  },

  /**
   * Xóa thông tin profile người dùng
   */
  async deleteUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (e) {
      console.warn('Lỗi khi xóa thông tin người dùng:', e);
    }
  },
};

