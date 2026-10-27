import { describe, it, expect, beforeEach } from 'vitest';
import {
  useAuthStore,
  selectIsAuthenticated,
  selectCurrentUser,
  selectIsSeller,
  selectIsBuyer,
} from '../store/useAuthStore';
import { AuthStorage } from '../services/authStorage';
import { User } from '../types/marketplace';

describe('Authentication Flow & Persistence (store/useAuthStore.ts & services/authStorage.ts)', () => {
  beforeEach(async () => {
    // Reset store trước mỗi bài test
    useAuthStore.setState({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: false,
    });
  });

  it('khởi tạo với trạng thái ban đầu là chưa đăng nhập', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(selectIsAuthenticated(state)).toBe(false);
    expect(selectCurrentUser(state)).toBeNull();
    expect(selectIsSeller(state)).toBe(false);
    expect(selectIsBuyer(state)).toBe(false);
  });

  it('đăng nhập thành công với tài khoản Người mua (MSSV 1923050528)', async () => {
    const success = await useAuthStore.getState().login('1923050528@dntu.edu.vn', '123456');
    expect(success).toBe(true);

    const state = useAuthStore.getState();
    expect(state.user).not.toBeNull();
    expect(state.user?.id).toBe('USR-01');
    expect(state.user?.name).toBe('Nguyễn Duy Khôi');
    expect(state.user?.role).toBe('BUYER');
    expect(state.token).toBeTruthy();
    expect(selectIsAuthenticated(state)).toBe(true);
    expect(selectIsBuyer(state)).toBe(true);
    expect(selectIsSeller(state)).toBe(false);
  });

  it('đăng nhập thành công với tài khoản Người bán (Seller)', async () => {
    const success = await useAuthStore.getState().login('duykhoi.seller@dntu.edu.vn', '123456');
    expect(success).toBe(true);

    const state = useAuthStore.getState();
    expect(state.user).not.toBeNull();
    expect(state.user?.role).toBe('SELLER');
    expect(selectIsSeller(state)).toBe(true);
    expect(selectIsBuyer(state)).toBe(false);
  });

  it('đăng nhập Demo một chạm hoạt động chuẩn xác cho cả BUYER và SELLER', async () => {
    // 1. Demo Buyer
    const buyerSuccess = await useAuthStore.getState().loginAsDemo('BUYER');
    expect(buyerSuccess).toBe(true);
    expect(useAuthStore.getState().user?.role).toBe('BUYER');

    // 2. Demo Seller
    const sellerSuccess = await useAuthStore.getState().loginAsDemo('SELLER');
    expect(sellerSuccess).toBe(true);
    expect(useAuthStore.getState().user?.role).toBe('SELLER');
  });

  it('chuyển đổi linh hoạt vai trò giữa BUYER và SELLER (switchRole)', async () => {
    await useAuthStore.getState().login('1923050528@dntu.edu.vn');
    expect(useAuthStore.getState().user?.role).toBe('BUYER');

    // Chuyển sang SELLER
    await useAuthStore.getState().switchRole('SELLER');
    expect(useAuthStore.getState().user?.role).toBe('SELLER');
    expect(useAuthStore.getState().user?.id).toBe('USR-02');

    // Chuyển lại về BUYER
    await useAuthStore.getState().switchRole('BUYER');
    expect(useAuthStore.getState().user?.role).toBe('BUYER');
    expect(useAuthStore.getState().user?.id).toBe('USR-01');
  });

  it('cập nhật thông tin profile người dùng (updateUser)', async () => {
    await useAuthStore.getState().login('1923050528@dntu.edu.vn');
    await useAuthStore.getState().updateUser({
      phone: '0988776655',
      campusLocation: 'Ký túc xá Khu A, DNTU',
    });

    const currentUser = useAuthStore.getState().user;
    expect(currentUser?.phone).toBe('0988776655');
    expect(currentUser?.campusLocation).toBe('Ký túc xá Khu A, DNTU');
  });

  it('đăng xuất hoàn toàn (logout) xóa sạch token, user và đưa về trạng thái khách', async () => {
    // 1. Đăng nhập trước
    await useAuthStore.getState().login('1923050528@dntu.edu.vn');
    expect(selectIsAuthenticated(useAuthStore.getState())).toBe(true);

    // 2. Thực hiện đăng xuất
    await useAuthStore.getState().logout();

    // 3. Kiểm tra state sau đăng xuất
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(selectIsAuthenticated(state)).toBe(false);
  });

  it('AuthStorage lưu và đọc đúng thông tin Token và User', async () => {
    const testUser: User = {
      id: 'USR-TEST-99',
      name: 'Sinh Viên Kiểm Thử',
      email: 'test@dntu.edu.vn',
      role: 'BUYER',
      phone: '0911223344',
      campusLocation: 'DNTU',
      avatarUrl: 'https://example.com/avatar.jpg',
      createdAt: '2026-10-28T00:00:00.000Z',
    };

    await AuthStorage.saveToken('secure-jwt-token-test-123');
    await AuthStorage.saveUser(testUser);

    const savedToken = await AuthStorage.getToken();
    const savedUser = await AuthStorage.getUser();

    expect(savedToken).toBe('secure-jwt-token-test-123');
    expect(savedUser).toEqual(testUser);

    // Xóa
    await AuthStorage.deleteToken();
    await AuthStorage.deleteUser();

    const deletedToken = await AuthStorage.getToken();
    const deletedUser = await AuthStorage.getUser();

    expect(deletedToken).toBeNull();
    expect(deletedUser).toBeNull();
  });

  it('AuthStorage ghi nhận và xóa cờ chủ động đăng xuất (isExplicitlyLoggedOut)', async () => {
    await AuthStorage.setExplicitlyLoggedOut(true);
    const isLoggedOut = await AuthStorage.isExplicitlyLoggedOut();
    expect(isLoggedOut).toBe(true);

    await AuthStorage.setExplicitlyLoggedOut(false);
    const afterReset = await AuthStorage.isExplicitlyLoggedOut();
    expect(afterReset).toBe(false);
  });

  it('clearAllAuth xóa toàn diện token, user và bật cờ đăng xuất', async () => {
    await AuthStorage.saveToken('token-to-clear');
    await AuthStorage.clearAllAuth();

    const token = await AuthStorage.getToken();
    const user = await AuthStorage.getUser();
    const isLoggedOut = await AuthStorage.isExplicitlyLoggedOut();

    expect(token).toBeNull();
    expect(user).toBeNull();
    expect(isLoggedOut).toBe(true);
  });

  it('restoreSession tôn trọng cờ đã đăng xuất và không tự động đăng nhập lại', async () => {
    // Giả lập trạng thái sau khi đã logout
    await AuthStorage.clearAllAuth();

    await useAuthStore.getState().restoreSession();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isInitialized).toBe(true);
  });
});
