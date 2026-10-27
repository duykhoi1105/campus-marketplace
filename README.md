# ỨNG DỤNG MOBILE: CHỢ MUA BÁN TRONG KHUÔN VIÊN TRƯỜNG (CAMPUS MARKETPLACE)

> **Đồ án cuối kỳ môn học: Phát triển ứng dụng di động**  
> **Trường:** Trường Đại học Công nghệ Đồng Nai (DNTU) — Khoa Công nghệ Thông tin  
> **Lớp:** TH7011101 — 23DTH1  
> **Đề tài:** Đề tài 02 — Chợ mua bán trong khuôn viên trường  
> **Sinh viên thực hiện:** Nguyễn Duy Khôi (MSSV: 1923050528)  
> **Ngày giao đề:** 14/10/2026 | **Ngày bảo vệ:** 28/10/2026  

---

## 1. GIỚI THIỆU ĐỀ TÀI

Ứng dụng di động **Chợ Sinh Viên DNTU (Campus Marketplace)** được xây dựng nhằm phục vụ nhu cầu trao đổi, mua bán giáo trình, tài liệu học tập, thiết bị điện tử và đồ dùng cá nhân giữa các sinh viên trong khuôn viên Trường Đại học Công nghệ Đồng Nai.

Ứng dụng đáp ứng đầy đủ và nghiêm ngặt toàn bộ các yêu cầu của đề cương môn học:
- Tải dữ liệu tin đăng từ **REST API từ xa** có xử lý lỗi mạng, timeout và dữ liệu không hợp lệ.
- **Nén và tối ưu hóa ảnh** ở tầng Client trước khi tải lên (giảm hơn 85% dung lượng ảnh gốc).
- **Tìm kiếm văn bản và lọc danh mục** được tính toán trong quá trình render (useMemo), không lưu state dẫn xuất trùng lặp.
- **Danh sách yêu thích dùng chung** (Zustand Store có selectors) lưu bền vững và đồng bộ tức thời trên nhiều màn hình.
- **Giỏ hàng và Tóm tắt thanh toán** áp dụng quy tắc giao nhận Campus (Campus pickup miễn phí 0đ, Dorm delivery giao KTX).
- **Kiểm soát tồn kho nghiêm ngặt**, ngăn chặn đặt số lượng vượt tồn kho hoặc mua món đã hết hàng.
- **Hoạt động ngoại tuyến (Offline Mode)**: Hiển thị danh mục tải thành công lần gần nhất kèm banner cảnh báo, tuyệt đối không trắng màn hình.
- **Thông báo cục bộ (Local Notifications)** khi sản phẩm yêu thích thay đổi giá.
- **Phân quyền người mua (BUYER) và người bán (SELLER)**, kiểm soát quyền sửa/xóa tin chính chủ.
- **Hệ thống Theme Sáng / Tối (Design Tokens)**: Toàn bộ ứng dụng sử dụng chung 1 file token màu duy nhất, **tuyệt đối không sử dụng mã hex ngoài token**.
- **Chuẩn Accessibility (WCAG 2.1 AA)**: Vùng chạm tối thiểu 44 × 44, độ tương phản văn bản cao, nhãn hỗ trợ trình đọc màn hình.
- **Bộ kiểm thử tự động toàn diện**: 5 test suites với 29 bài test tự động (Vitest) kiểm chứng logic tính tiền, tồn kho, lọc tìm kiếm, nén ảnh và kiểm toán mã màu hex.

---

## 2. CÔNG NGHỆ SỬ DỤNG

- **Nền tảng:** React Native (0.86+ / 0.88), Expo SDK 57/58.
- **Ngôn ngữ:** TypeScript (chế độ `strict: true`).
- **Điều hướng:** Expo Router (File-based Routing, route động `[id]`, modal routes, `+not-found`).
- **Quản lý trạng thái Server/Cache:** TanStack React Query v5.
- **Quản lý trạng thái Toàn cục (Global Store):** Zustand v5 với selectors chuyên biệt.
- **Lưu trữ bảo mật Token:** Expo SecureStore (Web fallback localStorage).
- **Lưu trữ dữ liệu ngoại tuyến (Offline Persistence):** `@react-native-async-storage/async-storage`.
- **Xử lý & Nén ảnh:** Expo Image Picker và Expo Image Manipulator.
- **Hiển thị hình ảnh tối ưu:** `expo-image`.
- **Thông báo cục bộ:** Expo Notifications & Web Notification API.
- **Backend REST API:** Node.js HTTP Server độc lập, zero-dependency, kèm seed data thực tế trong thư mục `backend/`.
- **Kiểm thử tự động:** Vitest v2.

---

## 3. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
1923050528_NguyenDuyKhoi_Campus_Marketplace/
├── app/                           # Expo Router - File-based routing (8 màn hình)
│   ├── (tabs)/                    # Nhóm màn hình có thanh Bottom Tabs
│   │   ├── _layout.tsx            # Cấu hình thanh TabBar (Chợ, Yêu thích, Giỏ, Profile)
│   │   ├── index.tsx              # Màn hình 2: Chợ / Danh sách tin đăng
│   │   ├── favorites.tsx          # Màn hình 5: Danh sách yêu thích
│   │   ├── cart.tsx               # Màn hình 6: Giỏ hàng & kiểm tra tồn kho
│   │   └── profile.tsx            # Màn hình 8: Hồ sơ, Theme sáng/tối, Role toggle
│   ├── listing/
│   │   └── [id].tsx               # Màn hình 3: Chi tiết tin đăng (Route động)
│   ├── listing-form.tsx           # Màn hình 4: Đăng/sửa tin & nén ảnh (Route Modal)
│   ├── checkout.tsx               # Màn hình 7: Tóm tắt thanh toán & giao nhận Campus
│   ├── login.tsx                  # Màn hình 1: Đăng nhập an toàn
│   ├── +not-found.tsx             # Xử lý lỗi 404 Not Found
│   └── _layout.tsx                # Root Layout (QueryClientProvider, Session hydration)
├── backend/                       # REST API Server độc lập (Node.js thuần)
│   ├── server.js                  # Express/HTTP server phục vụ CRUD, Upload, Orders
│   ├── data.json                  # Database lưu trữ JSON tự động đồng bộ
│   └── uploads/                   # Thư mục lưu trữ ảnh đã nén sau upload
├── components/                    # Các UI Components tái sử dụng chuẩn Accessibility
│   ├── CategoryFilter.tsx         # Bộ lọc danh mục dạng chips ngang
│   ├── FavoriteButton.tsx         # Nút yêu thích đồng bộ (Touch target 44x44)
│   ├── FeedbackStates.tsx         # 4 trạng thái chuẩn: LoadingView, EmptyView, ErrorView
│   ├── ListingCard.tsx            # Thẻ hiển thị sản phẩm trên danh sách
│   ├── OfflineBanner.tsx          # Banner cảnh báo ngoại tuyến & xem dữ liệu gần nhất
│   ├── SearchBar.tsx              # Thanh tìm kiếm với nút xóa từ khóa
│   └── StockBadge.tsx             # Nhãn trạng thái tồn kho (Còn hàng / Sắp hết / Hết hàng)
├── constants/                     # Design Tokens & Tham số hệ thống
│   ├── colors.ts                  # FILE DUY NHẤT CHỨA MÃ MÀU HEX (Light / Dark semantic)
│   ├── compression.ts             # Tham số nén ảnh chuẩn: JPEG 63%, tối đa 800px
│   └── layout.ts                  # Spacing, Bo góc, Kích thước trợ năng 44x44
├── hooks/                         # Custom React Hooks
│   └── useThemeColor.ts           # Hook truy xuất màu Semantic theo Theme sáng/tối
├── services/                      # Dịch vụ API & Bộ nhớ
│   ├── api.ts                     # API Client tập trung (timeout, error fallback)
│   ├── authStorage.ts             # SecureStore lưu token an toàn & AsyncStorage
│   ├── offlineStorage.ts          # Cache dữ liệu ngoại tuyến & thời điểm cập nhật
│   └── priceNotificationService.ts# Phát hiện biến động giá & phát thông báo cục bộ
├── store/                         # Quản lý trạng thái Zustand
│   ├── useAuthStore.ts            # Quản lý phiên đăng nhập, phân quyền Buyer/Seller
│   ├── useCartStore.ts            # Quản lý giỏ hàng, số lượng, kiểm tra tồn kho
│   └── useFavoriteStore.ts        # Quản lý yêu thích persist AsyncStorage
├── tests/                         # Bộ kiểm thử tự động (Vitest)
│   ├── cartCalculations.test.ts   # 14 tests: Subtotal, phí ship Campus, tồn kho, checkout
│   ├── filterSearch.test.ts       # 8 tests: Lọc danh mục, tìm kiếm có/không dấu tiếng Việt
│   ├── stockAndCartFlow.test.ts   # 1 test: Luồng mua hàng & cập nhật tồn kho hoàn chỉnh
│   ├── imageCompressionReport.test.ts # 5 tests: Công thức & tỷ lệ nén ảnh client
│   └── hexColorAudit.test.ts      # 1 test: Quét cấm mã hex ngoài constants/colors.ts
├── types/                         # TypeScript Type Definitions
│   ├── marketplace.ts             # Listing, User, CartItem, Order, Category
│   └── expo-notifications.d.ts    # Khai báo type an toàn cho module thông báo
├── AI_LOG.md                      # Nhật ký sử dụng Trí tuệ Nhân tạo xuyên suốt
├── PROJECT_REQUIREMENTS_AUDIT.txt # Bảng đối chiếu yêu cầu chi tiết REQ-01 đến REQ-16
├── PROJECT_ROADMAP.txt            # Kế hoạch & tiến độ 15 modules
├── IMAGE_COMPRESSION_REPORT.txt   # Báo cáo thực nghiệm đo lường hiệu quả nén ảnh
├── PRICE_NOTIFICATION_REPORT.txt  # Báo cáo kiểm thử thông báo cục bộ khi giá đổi
├── ACCESSIBILITY_AUDIT_REPORT.txt # Báo cáo kiểm toán khả năng tiếp cận WCAG 2.1 AA
├── FINAL_ACCEPTANCE_REPORT.txt    # Báo cáo nghiệm thu & hồi quy toàn diện
├── DEMO_VIDEO_SCRIPT.txt          # Kịch bản quay video demo 3 - 5 phút
└── SELF_ASSESSMENT_DRAFT.txt      # Bài tự đánh giá đồ án của sinh viên
```

---

## 4. HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN TRÊN MÁY MỚI HOÀN TOÀN

### 4.1. Yêu cầu môi trường
- **Node.js**: Phiên bản 18 trở lên (khuyên dùng Node.js v20 hoặc v24).
- **npm**: Phiên bản 9 trở lên (đã kiểm thử mượt mà trên npm 11.17).
- **Git**: Đã cài đặt trên máy.

### 4.2. Cài đặt Dependencies
Mở Terminal / PowerShell tại thư mục gốc của dự án:
```bash
npm install
```

### 4.3. Chạy Backend REST API Server (Khuyến khích chạy song song)
Mở một cửa sổ Terminal riêng và chạy:
```bash
npm run server
```
- Máy chủ sẽ khởi chạy tại: `http://localhost:3000`
- API endpoint: `http://localhost:3000/api/listings`
- Upload endpoint: `http://localhost:3000/api/upload`
- Health check: `http://localhost:3000/api/health`

*(Lưu ý: Nếu không chạy server, ứng dụng mobile vẫn hoạt động mượt mà nhờ cơ chế Offline Cache tự động và Fallback Seed Data tích hợp sẵn, tuyệt đối không trắng màn hình).*

### 4.4. Cấu hình Biến Môi Trường (Tùy chọn)
Mặc định ứng dụng tự động nhận diện:
- Trên Web / iOS Simulator: `http://localhost:3000/api`
- Trên Android Emulator: `http://10.0.2.2:3000/api`
Nếu muốn chạy trên thiết bị thật qua mạng Wi-Fi LAN của trường, tạo file `.env` tại thư mục gốc:
```env
EXPO_PUBLIC_API_URL=http://<IP_MÁY_TÍNH_CỦA_BẠN>:3000/api
```

### 4.5. Khởi chạy Ứng dụng Di động với Expo
```bash
# Chạy Expo Metro Bundler
npx expo start

# Hoặc chạy trực tiếp trên nền tảng mong muốn:
npm run web       # Chạy trên trình duyệt Web (nhấn 'w')
npm run android   # Chạy trên Android Emulator hoặc thiết bị Android (nhấn 'a')
npm run ios       # Chạy trên iOS Simulator (nhấn 'i' trên macOS)
```

---

## 5. TÀI KHOẢN DEMO MẪU CHO BUỔI CHẤM ĐỒ ÁN

Tại màn hình Đăng nhập (`app/login.tsx`), có sẵn 2 nút đăng nhập mẫu 1 chạm:

| Vai trò | Tên tài khoản | Email / MSSV | Mật khẩu | Mô tả quyền |
|---|---|---|---|---|
| **BUYER** (Người mua) | Nguyễn Duy Khôi | `1923050528@dntu.edu.vn` | `123456` | Duyệt tin, tìm kiếm, lưu yêu thích, đặt hàng, xem tóm tắt |
| **SELLER** (Người bán) | Duy Khôi (Sinh Viên Bán Hàng) | `duykhoi.seller@dntu.edu.vn` | `123456` | Có toàn quyền Đăng tin mới, nén ảnh, Chỉnh sửa và Xóa tin chính chủ |

*Ghi chú:* Người dùng cũng có thể bấm nút "Chuyển sang vai trò" tại màn hình Tài khoản (`Profile`) để đổi qua lại tức thời giữa Người mua và Người bán mà không cần đăng xuất.

---

## 6. KIỂM TRA CHẤT LƯỢNG MÃ NGUỒN VÀ KIỂM THỬ

### 6.1. Kiểm tra Kiểu Dữ Liệu TypeScript (Strict Mode)
```bash
npm run typecheck
# Hoặc:
npx tsc --noEmit
```
*Kết quả:* **0 lỗi** (Exit code 0).

### 6.2. Kiểm tra Linting theo Chuẩn Expo
```bash
npx eslint app components hooks services store utils constants tests
```
*Kết quả:* **0 lỗi, 0 cảnh báo** (Exit code 0).

### 6.3. Chạy Toàn Bộ Kiểm Thử Tự Động (Vitest)
```bash
npm test
```
*Kết quả:* **5/5 test suites passed**, **29/29 tests passed** (100% PASS):
1. `tests/cartCalculations.test.ts`: Kiểm tra tạm tính, phí ship Campus pickup 0đ, phí KTX, kiểm soát tồn kho không âm.
2. `tests/filterSearch.test.ts`: Kiểm tra tìm kiếm tiếng Việt có dấu/không dấu, lọc theo danh mục, tính toán dẫn xuất render-time.
3. `tests/stockAndCartFlow.test.ts`: Kiểm tra luồng mua hàng và trừ tồn kho thực tế.
4. `tests/imageCompressionReport.test.ts`: Kiểm tra cấu hình nén 63% và tỷ lệ giảm dung lượng > 80%.
5. `tests/hexColorAudit.test.ts`: Quét toàn bộ codebase xác minh 0 mã hex ngoài `constants/colors.ts`.

---

## 7. CÁCH THỬ NGHIỆM CÁC TÍNH NĂNG QUAN TRỌNG

### 7.1. Kiểm thử Chế độ Ngoại Tuyến (Offline Mode)
1. Tải ứng dụng lần đầu khi có kết nối mạng (hoặc khi bật backend).
2. Tắt backend server (nhấn `Ctrl + C` ở terminal server) hoặc ngắt kết nối mạng.
3. Kéo xuống để làm mới màn hình Chợ DNTU (Pull-to-refresh).
4. Quan sát:
   - Ứng dụng **không bị trắng màn hình**.
   - Xuất hiện **Banner màu cam**: "⚠️ Bạn đang ngoại tuyến — Đang xem dữ liệu gần nhất (Lần tải thành công: ...)".
   - Danh sách tin đăng đã lưu trong cache AsyncStorage vẫn hiển thị đầy đủ và người dùng vẫn xem chi tiết được bình thường.

### 7.2. Kiểm thử Nén Ảnh Client-side
1. Tại màn hình chính, nhấn nút tròn "+ Đăng tin" góc dưới bên phải.
2. Nhấn "Chọn từ thư viện" hoặc "Chụp ảnh mới".
3. Chọn một ảnh bất kỳ từ máy.
4. Màn hình hiển thị ngay banner màu xanh lá thông báo bằng chứng nén:
   - "Ảnh gốc: 2.8 MB → Đã nén: 108 KB (Giảm 96.19%) trong 84ms".
5. Bấm "Đăng tin ngay" để kiểm tra tải lên API.

### 7.3. Kiểm thử Kiểm Soát Tồn Kho & Giỏ Hàng
1. Mở sản phẩm "Áo sơ mi trắng đồng phục DNTU" (sản phẩm có `stock: 0`).
2. Quan sát nút "Thêm vào giỏ" bị vô hiệu hóa kèm chữ "Món đồ đã hết hàng".
3. Với các sản phẩm còn hàng, thêm vào giỏ và thử tăng số lượng vượt quá số tồn kho -> Ứng dụng lập tức cảnh báo và chặn lại, không cho đặt quá số lượng có sẵn.



