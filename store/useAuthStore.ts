import { create } from 'zustand';
import { User, UserRole } from '@/types/marketplace';
import { AuthStorage } from '@/services/authStorage';
import { ApiService } from '@/services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  restoreSession: () => Promise<void>;
  login: (emailOrId: string, password?: string) => Promise<boolean>;
  loginAsDemo: (role: 'BUYER' | 'SELLER') => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => Promise<void>;
  updateUser: (updated: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isInitialized: false,

  

restoreSession: async () => {
  set({ isLoading: true });

  try {
    const [token, user, isLoggedOut] = await Promise.all([
      AuthStorage.getToken(),
      AuthStorage.getUser(),
      AuthStorage.isExplicitlyLoggedOut(),
    ]);

    if (token && user && !isLoggedOut) {
      set({
        token,
        user,
        isInitialized: true,
        isLoading: false,
      });
      return;
    }

    set({
      token: null,
      user: null,
      isInitialized: true,
      isLoading: false,
    });
  } catch (error) {
    console.warn('Lỗi khôi phục phiên:', error);

    set({
      token: null,
      user: null,
      isInitialized: true,
      isLoading: false,
    });
  }
},



login: async (emailOrId: string, password?: string) => {
  set({ isLoading: true });

  try {
    const { user, token } = await ApiService.login(emailOrId, password);

    await Promise.all([
      AuthStorage.saveToken(token),
      AuthStorage.saveUser(user),
      AuthStorage.setExplicitlyLoggedOut(false),
    ]);

    set({
      user,
      token,
      isLoading: false,
      isInitialized: true,
    });

    return true;
  } catch (error) {
    console.warn('Đăng nhập thất bại:', error);
    set({ isLoading: false });
    return false;
  }
},

  loginAsDemo: async (role: 'BUYER' | 'SELLER') => {
    const email =
      role === 'SELLER'
        ? 'duykhoi.seller@dntu.edu.vn'
        : '1923050528@dntu.edu.vn';
    return await get().login(email, '123456');
  },



logout: async () => {
  const currentToken = get().token;

  // Cập nhật giao diện ngay lập tức.
  set({
    user: null,
    token: null,
    isLoading: true,
  });

  try {
    // Đánh dấu đăng xuất; không phụ thuộc vào API.
    try {
      await AuthStorage.setExplicitlyLoggedOut(true);
    } catch (error) {
      console.warn('Không thể lưu trạng thái đăng xuất:', error);
    }

    // API lỗi cũng không được ngăn việc xóa phiên cục bộ.
    try {
      await ApiService.logout(currentToken || undefined);
    } catch (error) {
      console.warn('Không thể gọi API đăng xuất:', error);
    }
  } finally {
    try {
      await AuthStorage.clearAllAuth();
    } catch (error) {
      console.warn('Lỗi xóa dữ liệu xác thực:', error);
    }

    // Ghi lại cờ sau khi xóa token và user.
    try {
      await AuthStorage.setExplicitlyLoggedOut(true);
    } catch (error) {
      console.warn('Không thể lưu lại trạng thái đăng xuất:', error);
    }

    set({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: true,
    });
  }
},

  switchRole: async (newRole: UserRole) => {
    const current = get().user;
    if (!current) return;
    const updatedUser: User = {
      ...current,
      role: newRole,
      id: newRole === 'SELLER' ? 'USR-02' : 'USR-01',
      name: newRole === 'SELLER' ? 'Duy Khôi (Sinh Viên Bán Hàng)' : 'Nguyễn Duy Khôi',
    };
    await AuthStorage.saveUser(updatedUser);
    set({ user: updatedUser });
  },

  updateUser: async (updated: Partial<User>) => {
    const current = get().user;
    if (!current) return;
    const nextUser = { ...current, ...updated };
    await AuthStorage.saveUser(nextUser);
    set({ user: nextUser });
  },
}));

// Selectors
export const selectIsAuthenticated = (state: AuthState) => Boolean(state.user && state.token);
export const selectCurrentUser = (state: AuthState) => state.user;
export const selectIsSeller = (state: AuthState) => state.user?.role === 'SELLER';
export const selectIsBuyer = (state: AuthState) => state.user?.role === 'BUYER';
