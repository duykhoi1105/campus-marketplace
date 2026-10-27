# BÁO CÁO TỰ ĐÁNH GIÁ ĐỒ ÁN VÀ QUÁ TRÌNH PHÁT TRIỂN
## (STUDENT SELF-ASSESSMENT & ACADEMIC REFLECTION)

> **Học phần:** Phát triển ứng dụng di động (Mobile Application Development)  
> **Lớp học phần:** TH7011101 — 23DTH1  
> **Khoa:** Khoa Công nghệ Thông tin — Trường Đại học Công nghệ Đồng Nai (DNTU)  
> **Đề tài 02:** Chợ Mua Bán Trong Khuôn Viên Trường (Campus Marketplace)  
> **Sinh viên thực hiện:** Nguyễn Duy Khôi  
> **Mã số sinh viên (MSSV):** 1923050528  
> **Ngày hoàn thành đánh giá:** 28/10/2026  

---

## 1. THÔNG TIN CHUNG VÀ MỤC TIÊU DỰ ÁN

Dự án **Campus Marketplace (Chợ Sinh Viên DNTU)** là ứng dụng di động được xây dựng bằng React Native (Expo SDK 57/58, TypeScript Strict Mode), phục vụ nhu cầu trao đổi giáo trình, đồ điện tử, đồng phục và vật dụng sinh hoạt giữa các sinh viên trong trường Đại học Công nghệ Đồng Nai.

Ứng dụng hướng tới các tiêu chuẩn công nghiệp hiện đại:
- Kiến trúc File-based Routing với Expo Router (8 màn hình hoàn chỉnh + Dynamic route + Modal + 404).
- Bộ nhớ đệm phân tầng: Zustand v5 (Client State), TanStack React Query v5 (Server State), Expo SecureStore (Auth Token), AsyncStorage (Offline Persistence).
- Tối ưu hiệu năng: Nén ảnh Client-side giảm > 85% băng thông, tính toán dẫn xuất render-time (tránh cascading re-renders).
- An toàn & Trợ năng: Design Tokens 100% không mã hex ngoài token, chuẩn WCAG 2.1 AA (touch target ≥ 44×44, contrast ≥ 4.5:1).
- Bộ kiểm thử tự động toàn diện: 7 test suites, 60/60 tests PASSED 100%.

---

## 2. BẢNG TỰ ĐÁNH GIÁ MỨC ĐỘ HOÀN THÀNH YÊU CẦU ĐỀ CƯƠNG (16/16 TIÊU CHÍ)

| STT | Tiêu chí đề cương môn học | Mức độ hoàn thành | Tự chấm | Minh chứng mã nguồn & Kiểm thử |
|:---:|---|:---:|:---:|---|
| **01** | **Xác thực & Phiên làm việc:** Đăng nhập, lưu token bí mật vào SecureStore, tự động khôi phục phiên khi mở lại app, đăng xuất dọn sạch phiên | **100% ĐẠT** | 10/10 | [`services/authStorage.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/services/authStorage.ts), [`store/useAuthStore.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/store/useAuthStore.ts), [`app/login.tsx`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/app/login.tsx); Suite test [`tests/authFlow.test.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/tests/authFlow.test.ts) (11 tests pass). |
| **02** | **Remote REST API:** Tải tin đăng từ máy chủ từ xa, xử lý timeout, lỗi mạng, dữ liệu không hợp lệ | **100% ĐẠT** | 10/10 | [`backend/server.js`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/backend/server.js) (REST API thuần Node.js), [`services/api.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/services/api.ts) (AbortController timeout 6s). |
| **03** | **Xử lý & Nén ảnh Client-side:** Nén và resize ảnh trước khi upload (JPEG 63%, max 800px), đo lường số liệu thực tế | **100% ĐẠT** | 10/10 | [`utils/imageCompression.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/utils/imageCompression.ts), [`constants/compression.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/constants/compression.ts); Giảm 89.36% dung lượng ([`IMAGE_COMPRESSION_REPORT.txt`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/IMAGE_COMPRESSION_REPORT.txt)); [`tests/imageCompressionReport.test.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/tests/imageCompressionReport.test.ts) (5 tests pass). |
| **04** | **Tìm kiếm & Lọc danh mục:** Tính toán trong quá trình render (useMemo), không lưu state dẫn xuất, hỗ trợ tiếng Việt không dấu | **100% ĐẠT** | 10/10 | [`utils/filterListings.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/utils/filterListings.ts), [`app/(tabs)/index.tsx`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/app/(tabs)/index.tsx); [`tests/filterSearch.test.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/tests/filterSearch.test.ts) (8 tests pass). |
| **05** | **Yêu thích dùng chung (Shared Store):** Zustand store có selectors, đồng bộ tức thời giữa các màn hình, persist AsyncStorage | **100% ĐẠT** | 10/10 | [`store/useFavoriteStore.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/store/useFavoriteStore.ts), [`components/FavoriteButton.tsx`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/components/FavoriteButton.tsx), [`app/(tabs)/favorites.tsx`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/app/(tabs)/favorites.tsx). |
| **06** | **Giỏ hàng & Kiểm soát tồn kho:** Quy tắc Campus pickup 0đ, Dorm delivery 10k (freeship ≥ 200k), chặn đặt quá tồn kho, không âm | **100% ĐẠT** | 10/10 | [`store/useCartStore.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/store/useCartStore.ts), [`utils/cartCalculations.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/utils/cartCalculations.ts), [`app/checkout.tsx`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/app/checkout.tsx); [`tests/cartCalculations.test.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/tests/cartCalculations.test.ts) (14 tests pass), [`tests/stockAndCartFlow.test.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/tests/stockAndCartFlow.test.ts) (1 test pass). |
| **07** | **Chế độ ngoại tuyến (Offline Resilience):** Mất mạng hiển thị dữ liệu tải thành công gần nhất kèm banner cảnh báo, không trắng màn hình | **100% ĐẠT** | 10/10 | [`services/offlineStorage.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/services/offlineStorage.ts), [`components/OfflineBanner.tsx`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/components/OfflineBanner.tsx); Cơ chế cache tự động kết hợp thời điểm cập nhật tiếng Việt. |
| **08** | **Phân quyền BUYER / SELLER:** Phân định rõ quyền người mua / người bán; chặn người bán tự mua tin mình; nút chuyển vai trò một chạm | **100% ĐẠT** | 10/10 | [`store/useAuthStore.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/store/useAuthStore.ts), [`app/(tabs)/profile.tsx`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/app/(tabs)/profile.tsx), [`app/listing/[id].tsx`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/app/listing/[id].tsx). |
| **09** | **Thông báo cục bộ biến động giá:** So sánh snapshot giá món yêu thích, phát local notification, chống trùng lặp | **100% ĐẠT** | 10/10 | [`services/priceNotificationService.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/services/priceNotificationService.ts), Báo cáo [`PRICE_NOTIFICATION_REPORT.txt`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/PRICE_NOTIFICATION_REPORT.txt). |
| **10** | **Pull-to-refresh & Thời điểm cập nhật:** Kéo làm mới mượt mà, hiển thị chuỗi ngày giờ tiếng Việt "🕒 Cập nhật: ..." | **100% ĐẠT** | 10/10 | [`app/(tabs)/index.tsx`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/app/(tabs)/index.tsx) tích hợp `RefreshControl` chuẩn React Native. |
| **11** | **Cấu trúc Expo Router:** Tối thiểu 5 màn hình, route động, modal route, trang `+not-found` | **100% ĐẠT** | 10/10 | Hoàn thiện 8 màn hình: Login, Chợ, Yêu thích, Giỏ hàng, Chi tiết `[id]`, Đăng tin `listing-form` (modal), Checkout, Profile, kèm `+not-found.tsx`. |
| **12** | **Design Tokens & Accessibility:** 1 file token màu duy nhất, 0 mã hex ngoài token, touch target ≥ 44×44, contrast WCAG 2.1 AA | **100% ĐẠT** | 10/10 | [`constants/colors.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/constants/colors.ts); [`tests/hexColorAudit.test.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/tests/hexColorAudit.test.ts) (1 test pass); [`ACCESSIBILITY_AUDIT_REPORT.txt`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/ACCESSIBILITY_AUDIT_REPORT.txt). |
| **13** | **4 trạng thái phản hồi mỗi màn hình:** Loading, Empty, Error (nút retry thật), Content | **100% ĐẠT** | 10/10 | [`components/FeedbackStates.tsx`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/components/FeedbackStates.tsx) áp dụng đồng bộ khắp các màn hình. |
| **14** | **Kiểm thử tự động đa tầng:** Pure logic, Component behavior, Integration flow | **100% ĐẠT** | 10/10 | 7 test suites với 60 tests (Vitest) kiểm chứng: Auth, Cart, Stock, Filter, Image Compression, Smart Image, Hex Audit. |
| **15** | **Kiểm tra chất lượng biên dịch & Lint:** `npx tsc --noEmit` và `eslint` hoàn thành không lỗi | **100% ĐẠT** | 10/10 | `npx tsc --noEmit` (0 lỗi), `npx eslint` (0 lỗi, 0 warning). |
| **16** | **Hồ sơ nghiệm thu & Tài liệu bàn giao:** Đầy đủ README, AI_LOG, Script Video, Báo cáo kiểm toán, Script đóng gói Canvas ZIP | **100% ĐẠT** | 10/10 | 8 file báo cáo chi tiết + [`package-submission.ps1`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/package-submission.ps1) đóng gói `1923050528_Project.zip`. |

---

## 3. NHỮNG ĐIỀU BẢN THÂN SẼ LÀM KHÁC ĐI NẾU BẮT ĐẦU LẠI TỪ ĐẦU

### 3.1. Về thiết kế kiến trúc State Management (Zustand Slices)
- **Kinh nghiệm thực tế:** Ban đầu khi mới tiếp cận bài toán, tôi từng nghĩ đến việc gom chung `cartItems` và `favoriteItems` vào một Store lớn mang tên `useMarketplaceStore`. Tuy nhiên, khi màn hình Chợ cập nhật một mặt hàng yêu thích, toàn bộ giỏ hàng và danh sách sản phẩm bị kích hoạt kiểm tra re-render không đáng có.
- **Thay đổi nếu làm lại:** Tôi sẽ phân tách ngay từ đầu thành 2 Store độc lập:
  - `useCartStore`: Chỉ tập trung tính toán giỏ hàng, số lượng, phương thức nhận hàng và trừ tồn kho.
  - `useFavoriteStore`: Chỉ tập trung lưu danh sách ID, snapshot giá và kích hoạt kiểm tra biến động giá.
  - Sử dụng triệt để cơ chế **Zustand Selectors** (ví dụ: `selectCartCount`, `selectIsFavorite(id)`) để chỉ render lại đúng component cần cập nhật.

### 3.2. Về chiến lược xử lý hình ảnh phía Client (Client-Side Compression Pipeline)
- **Kinh nghiệm thực tế:** Khi sinh viên chụp ảnh bìa giáo trình hoặc máy tính bỏ túi bằng camera điện thoại thật, ảnh có dung lượng lên tới 3MB – 8MB. Nếu đưa thẳng ảnh này lên form rồi mới nén ở server thì băng thông mạng 4G/Wi-Fi của trường sẽ bị nghẽn nghiêm trọng, thậm chí gây timeout request trên thiết bị di động.
- **Thay đổi nếu làm lại:** Tôi sẽ xây dựng hẳn một pipeline nén ảnh trước khi dựng giao diện UI: Chọn ảnh → Nhận diện kích thước → Resize chiều lớn nhất về tối đa 800px → Nén JPEG với tỷ lệ 63% (theo thông số đề cương) → Hiển thị ngay chỉ số đo lường dung lượng trước/sau nén để người dùng an tâm.

### 3.3. Về tính tương thích môi trường chạy (Cross-Platform Storage Strategy)
- **Kinh nghiệm thực tế:** Trong ứng dụng React Native Expo, khi chạy trên máy thật (Native iOS/Android), thư viện `expo-secure-store` hoạt động hoàn hảo. Nhưng khi chạy trên trình duyệt Web (Expo Web) hoặc chạy kiểm thử tự động trong môi trường Node.js (Vitest), `SecureStore` không khả dụng hoặc `window.localStorage` có thể bị undefined.
- **Thay đổi nếu làm lại:** Thiết lập một tầng Adapter trừu tượng hóa bộ nhớ ngay từ ngày đầu: Native dùng `SecureStore`, Web có `window.localStorage` dùng localStorage, và khi ở môi trường Test/Server Fallback thì chuyển hướng an toàn sang `AsyncStorage` / In-Memory Mock để toàn bộ hệ thống test tự động và ứng dụng luôn chạy trơn tru 100% trên mọi nền tảng mà không bị ném ngoại lệ bất ngờ.

---

## 4. CÁC SỰ CỐ / CÂU TRẢ LỜI SAI CỦA TRÍ TUỆ NHÂN TẠO (AI) ĐÃ ĐƯỢC PHÁT HIỆN VÀ KHẮC PHỤC

Trong suốt quá trình thực hiện đồ án, tôi sử dụng AI như một trợ lý lập trình. Tôi tuân thủ nghiêm ngặt nguyên tắc: **Sinh viên phải kiểm tra, hiểu sâu và chịu trách nhiệm toàn diện với mọi dòng code**. Dưới đây là 4 sự cố điển hình do AI đề xuất sai mà tôi đã phát hiện và tự khắc phục:

### Sự cố 1: AI đề xuất lưu dữ liệu dẫn xuất vào `useState` gây cascading re-renders
- **Bối cảnh:** Khi xây dựng tính năng tìm kiếm sản phẩm và lọc danh mục tại màn hình Chợ ([`app/(tabs)/index.tsx`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/app/(tabs)/index.tsx)).
- **Đề xuất sai của AI:** AI đề xuất khai báo:
  ```typescript
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  useEffect(() => {
    const results = listings.filter(...);
    setFilteredListings(results);
  }, [searchText, selectedCategory, listings]);
  ```
- **Cách tôi phát hiện:**
  - Đối chiếu với Đề cương học phần: Đề cương ghi rõ yêu cầu: *"Tìm kiếm văn bản và lọc danh mục phải được tính toán trong quá trình render, không lưu kết quả dẫn xuất thành state riêng. Tuyệt đối không tạo thêm useState(filteredListings)."*
  - Phân tích nguyên lý React: Giải pháp của AI khiến component render lần 1 (khi filter thay đổi), sau đó `useEffect` chạy lại gọi `setFilteredListings` dẫn đến render lần 2 liên tiếp (cascading renders), gây giật lag và nguy cơ lệch đồng bộ khi `listings` thay đổi.
- **Cách tôi khắc phục:**
  - Từ chối đề xuất của AI.
  - Sử dụng hàm thuần `filterAndSearchListings` được bọc bởi `useMemo`, tính toán trực tiếp trong quá trình render:
    ```typescript
    const filteredListings = useMemo(() => {
      return filterAndSearchListings(rawListings, searchText, selectedCategory);
    }, [rawListings, searchText, selectedCategory]);
    ```
  - Viết bộ unit test [`tests/filterSearch.test.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/tests/filterSearch.test.ts) (8 tests) kiểm chứng tính đúng đắn với tiếng Việt có dấu, không dấu và chữ hoa/thường.

### Sự cố 2: AI hardcode mã màu hex rải rác trong các Component
- **Bối cảnh:** Khi thiết kế các component giao diện ([`components/ListingCard.tsx`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/components/ListingCard.tsx), [`components/FeedbackStates.tsx`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/components/FeedbackStates.tsx)).
- **Đề xuất sai của AI:** Trong `StyleSheet.create`, AI theo thói quen điền trực tiếp mã màu hex:
  ```typescript
  backgroundColor: '#FFFFFF',
  borderColor: '#E2E8F0',
  color: '#2563EB',
  ```
- **Cách tôi phát hiện:** Đề cương yêu cầu: *"Hệ thống màu Semantic Token duy nhất. Không sử dụng mã hex ngoài token."* Việc hardcode mã hex sẽ khiến giao diện không thể chuyển đổi mượt mà giữa Chế độ Sáng (Light Mode) và Chế độ Tối (Dark Mode).
- **Cách tôi khắc phục:**
  - Loại bỏ toàn bộ mã hex viết tay trong component.
  - Đưa toàn bộ định nghĩa màu vào [`constants/colors.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/constants/colors.ts) và sử dụng qua hook [`hooks/useThemeColor.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/hooks/useThemeColor.ts).
  - Viết test tự động [`tests/hexColorAudit.test.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/tests/hexColorAudit.test.ts) dùng Regular Expression quét toàn bộ thư mục `app/`, `components/`, `services/`, `store/`. Nếu phát hiện bất kỳ chuỗi `#[0-9a-fA-F]{3,8}` nào nằm ngoài `colors.ts`, test sẽ lập tức báo FAIL.

### Sự cố 3: AI ném ngoại lệ cứng khi kiểm tra `localStorage` làm crash bộ test tự động
- **Bối cảnh:** Khi hoàn thiện tầng lưu trữ xác thực [`services/authStorage.ts`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/services/authStorage.ts).
- **Đề xuất sai của AI:** AI bổ sung logic kiểm tra web:
  ```typescript
  if (isWeb) {
    if (!webStorageAvailable()) throw new Error('localStorage không khả dụng');
    window.localStorage.setItem(TOKEN_KEY, token);
  }
  ```
- **Cách tôi phát hiện:** Khi chạy `npx vitest run`, Vitest chạy trên môi trường Node.js giả lập `react-native-web`. Lúc này `Platform.OS === 'web'` là `true`, nhưng `typeof window` trong Node.js lại là `undefined`. Do đó hàm của AI liên tục ném lỗi `Error: localStorage không khả dụng`, khiến 10 bài test xác thực trong `tests/authFlow.test.ts` bị FAIL toàn bộ!
- **Cách tôi khắc phục:**
  - Phân tích rõ: `localStorage` chỉ nên dùng khi chạy trên trình duyệt thật (`isWeb && webStorageAvailable()`).
  - Khi không có `window.localStorage` (như môi trường test Node.js hoặc native), hệ thống phải tự động fallback sang `SecureStore` (mock bằng in-memory Map) và `AsyncStorage` (mock bằng mockStorage).
  - Sau khi sửa lại cơ chế đa tầng, toàn bộ 11/11 tests trong `tests/authFlow.test.ts` và 60/60 tests toàn dự án đã PASS 100%.

### Sự cố 4: AI sinh nút bấm HTML `<button>` lồng nhau gây cảnh báo lỗi trên Expo Web
- **Bối cảnh:** Khi hiển thị thẻ sản phẩm [`components/ListingCard.tsx`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/components/ListingCard.tsx) có gắn nút yêu thích [`components/FavoriteButton.tsx`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/components/FavoriteButton.tsx).
- **Đề xuất sai của AI:** AI bọc toàn bộ thẻ bằng `Pressable` (biên dịch thành `<button>` trên web) và bên trong lại đặt thêm `FavoriteButton` cũng là một `Pressable` (`<button>`).
- **Cách tôi phát hiện:** Khi mở trình duyệt web với `npx expo start --web`, Console trình duyệt báo lỗi đỏ: `Warning: validateDOMNesting(...): <button> cannot appear as a descendant of <button>.`
- **Cách tôi khắc phục:** Tái cấu trúc giao diện: Tách riêng phần thân Card và cụm nút thao tác (Nút Yêu thích, Nút Thêm giỏ hàng) thành các khối lân cận hoặc sử dụng `e.stopPropagation()` độc lập để không lồng các phần tử tương tác vào nhau.

---

## 5. BÀI HỌC KINH NGHIỆM VÀ LIÊM CHÍNH HỌC THUẬT

### 5.1. Về vai trò của Kiểm thử phần mềm (Testing)
Trước khi thực hiện dự án này, tôi thường có suy nghĩ viết code chạy được trên màn hình là xong, phần test chỉ là thủ tục phụ. Nhưng khi đối mặt với một hệ thống thương mại điện tử mini có nhiều ràng buộc logic phức tạp:
- Tính tổng tiền đơn hàng, phí ship Campus pickup 0đ, giao KTX 10.000đ, miễn phí khi đơn từ 200.000đ.
- Kiểm soát tồn kho nghiêm ngặt: Không cho mua vượt quá số lượng người bán có, không cho giảm số lượng xuống âm.
- Lọc sản phẩm theo danh mục và từ khóa tiếng Việt không dấu.
- Nén ảnh client-side đảm bảo giảm trên 85% dung lượng.

Việc sở hữu **7 test suites với 60 bài test tự động (Vitest)** chạy hoàn tất chỉ trong 1.8 giây đã mang lại sự tự tin rất lớn. Mỗi khi sửa đổi mã nguồn hoặc tái cấu trúc logic, tôi chỉ cần chạy `npx vitest run`. Nếu có bất kỳ lỗi logic nào phát sinh, bộ test sẽ phát hiện ngay tức khắc.

### 5.2. Về Liêm chính học thuật (Academic Integrity) khi sử dụng AI
- AI (ChatGPT, Gemini, Antigravity) là một công cụ hỗ trợ tuyệt vời giúp lập trình viên viết nhanh boilerplate code, gợi ý cú pháp TypeScript và tra cứu tài liệu thư viện.
- Tuy nhiên, **AI không thể thay thế tư duy phản biện của người lập trình viên**. AI thường xuyên đề xuất những đoạn code vi phạm yêu cầu đề cương môn học (như tạo state thừa, hardcode màu hex, hay ném lỗi thiếu kiểm soát).
- Sinh viên có trách nhiệm trung thực ghi lại toàn bộ lịch sử tương tác trong [`AI_LOG.md`](file:///d:/CNTT/LT-Mobile/1923050528_NguyenDuyKhoi_Campus_Marketplace/AI_LOG.md), hiểu cặn kẽ từng dòng lệnh và có khả năng giải thích, bảo vệ trực tiếp trước Hội đồng chấm đồ án.

---

## 6. TỰ ĐÁNH GIÁ VÀ ĐỀ XUẤT ĐIỂM SỐ

- **Khối lượng công việc đã hoàn thành:** 16/16 tiêu chí đề cương (100% hoàn tất).
- **Chất lượng mã nguồn:** TypeScript Strict Mode 0 lỗi, ESLint 0 lỗi, 100% Design Tokens không mã hex rải rác.
- **Kiểm thử tự động:** 7/7 test suites, 60/60 tests PASSED (100%).
- **Tài liệu & Đóng gói:** Hoàn thiện đầy đủ 8 tài liệu kiểm toán, hướng dẫn quay video demo và script đóng gói Canvas.

**TỰ ĐỀ XUẤT ĐIỂM SỐ:** **10 / 10 (Xuất sắc)**

---
*Biên soạn và ký tên:*  
**Nguyễn Duy Khôi** (MSSV: 1923050528)  
Lớp: TH7011101 — 23DTH1, Trường Đại học Công nghệ Đồng Nai

