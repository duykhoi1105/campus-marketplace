
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/marketplace';

const TOKEN_KEY = 'campus_auth_session_token_1923050528';
const USER_KEY = 'campus_auth_user_data_1923050528';
const LOGGED_OUT_KEY = 'campus_auth_logged_out_flag_1923050528';

const isWeb = Platform.OS === 'web';

const webStorageAvailable = (): boolean =>
  typeof window !== 'undefined' && !!window.localStorage;

export const AuthStorage = {
  async saveToken(token: string): Promise<void> {
    try {
      if (isWeb && webStorageAvailable()) {
        window.localStorage.setItem(TOKEN_KEY, token);
      } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      }
    } catch (error) {
      console.warn('Lỗi lưu token:', error);
      throw error;
    }
  },

  async getToken(): Promise<string | null> {
    try {
      if (isWeb && webStorageAvailable()) {
        return window.localStorage.getItem(TOKEN_KEY);
      }
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.warn('Lỗi đọc token:', error);
      return null;
    }
  },

  async deleteToken(): Promise<void> {
    try {
      if (isWeb && webStorageAvailable()) {
        window.localStorage.removeItem(TOKEN_KEY);
      } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch (error) {
      console.warn('Lỗi xóa token:', error);
    }
  },

  async saveUser(user: User): Promise<void> {
    try {
      const value = JSON.stringify(user);

      if (isWeb && webStorageAvailable()) {
        window.localStorage.setItem(USER_KEY, value);
      } else {
        await AsyncStorage.setItem(USER_KEY, value);
      }
    } catch (error) {
      console.warn('Lỗi lưu thông tin người dùng:', error);
      throw error;
    }
  },

  async getUser(): Promise<User | null> {
    try {
      let raw: string | null;

      if (isWeb && webStorageAvailable()) {
        raw = window.localStorage.getItem(USER_KEY);
      } else {
        raw = await AsyncStorage.getItem(USER_KEY);
      }

      if (!raw) return null;
      return JSON.parse(raw) as User;
    } catch (error) {
      console.warn('Lỗi đọc thông tin người dùng:', error);
      return null;
    }
  },

  async deleteUser(): Promise<void> {
    try {
      if (isWeb && webStorageAvailable()) {
        window.localStorage.removeItem(USER_KEY);
      } else {
        await AsyncStorage.removeItem(USER_KEY);
      }
    } catch (error) {
      console.warn('Lỗi xóa thông tin người dùng:', error);
    }
  },

  async isExplicitlyLoggedOut(): Promise<boolean> {
    try {
      let flag: string | null;

      if (isWeb && webStorageAvailable()) {
        flag = window.localStorage.getItem(LOGGED_OUT_KEY);
      } else {
        flag = await AsyncStorage.getItem(LOGGED_OUT_KEY);
      }

      return flag === 'true';
    } catch (error) {
      console.warn('Lỗi đọc cờ đăng xuất:', error);
      return false;
    }
  },

  async setExplicitlyLoggedOut(loggedOut: boolean): Promise<void> {
    try {
      if (isWeb && webStorageAvailable()) {
        if (loggedOut) {
          window.localStorage.setItem(LOGGED_OUT_KEY, 'true');
        } else {
          window.localStorage.removeItem(LOGGED_OUT_KEY);
        }
      } else if (loggedOut) {
        await AsyncStorage.setItem(LOGGED_OUT_KEY, 'true');
      } else {
        await AsyncStorage.removeItem(LOGGED_OUT_KEY);
      }
    } catch (error) {
      console.warn('Lỗi cập nhật cờ đăng xuất:', error);
      throw error;
    }
  },

  async clearAllAuth(): Promise<void> {
    await Promise.all([
      this.deleteToken(),
      this.deleteUser(),
    ]);

    // Giữ cờ đăng xuất để lần tải trang tiếp theo
    // không tự khôi phục phiên cũ.
    await this.setExplicitlyLoggedOut(true);
  },
};
