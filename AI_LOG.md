# NHẬT KÝ SỬ DỤNG TRÍ TUỆ NHÂN TẠO (AI_LOG.md)

**Học phần:** Phát triển ứng dụng di động  
**Đề tài:** Đề tài 02 — Chợ mua bán trong khuôn viên trường (Campus Marketplace)  
**Lớp:** TH7011101 — 23DTH1  
**Trường:** Trường Đại học Công nghệ Đồng Nai — Khoa Công nghệ Thông tin  
**Sinh viên thực hiện:** Nguyễn Duy Khôi (MSSV: 1923050528)  
**Ngày bắt đầu ghi nhận:** 23/10/2026  
**Ngày cập nhật gần nhất:** 27/10/2026  

---

## 1. NGUYÊN TẮC LIÊM CHÍNH HỌC THUẬT

- Ghi nhận các lần sử dụng AI trong quá trình phân tích, thiết kế, lập trình và kiểm thử ứng dụng.
- Phân biệt rõ nội dung AI đề xuất với phần sinh viên đã chấp nhận, chỉnh sửa hoặc chưa áp dụng.
- Không ghi nhận kết quả kiểm thử là thành công nếu chưa thực sự chạy và xác nhận.
- Kiểm tra mã nguồn sau khi áp dụng gợi ý bằng TypeScript compiler, lint và bộ kiểm thử tự động phù hợp với dự án.
- Sinh viên chịu trách nhiệm kiểm tra, hiểu và giải thích mã nguồn được sử dụng trong sản phẩm cuối cùng.

## 2. CẤU TRÚC DỰ ÁN

Dựa trên ảnh chụp thư mục dự án trong Visual Studio Code, project có cấu trúc chính như sau:

| Thư mục / Tệp | Vai trò |
|---|---|
| `app/` | Các màn hình và định tuyến của ứng dụng Expo Router |
| `assets/` | Tài nguyên tĩnh của ứng dụng |
| `backend/` | Mã nguồn máy chủ và API |
| `components/` | Các thành phần giao diện dùng lại |
| `constants/` | Hằng số, cấu hình và thiết kế giao diện |
| `hooks/` | Các React hooks dùng chung |
| `services/` | Các dịch vụ API, lưu trữ và xử lý nghiệp vụ |
| `store/` | Quản lý trạng thái dùng Zustand |
| `tests/` | Các bài kiểm thử tự động |
| `types/` | Khai báo kiểu dữ liệu TypeScript |
| `utils/` | Các hàm tiện ích và xử lý logic |
| `AI_LOG.md` | Nhật ký sử dụng AI |
| `app.json` | Cấu hình ứng dụng Expo |
| `package.json` | Khai báo scripts và thư viện phụ thuộc |
| `tsconfig.json` | Cấu hình TypeScript |
| `vitest.config.ts` | Cấu hình công cụ kiểm thử Vitest |

---

## 3. BẢNG THEO DÕI TƯƠNG TÁC AI

| STT | Ngày | Công cụ AI | Vấn đề / Yêu cầu | Nội dung AI đề xuất | Phần chấp nhận / điều chỉnh | Cách kiểm chứng | File / Module liên quan |
|---|---|---|---|---|---|---|---|
| 01 | 23/10/2026 | Gemini / Antigravity | Khảo sát cấu trúc dự án và lập kế hoạch | Đề xuất kiểm tra cấu trúc mã nguồn, yêu cầu chức năng và lập lộ trình phát triển | Sử dụng cấu trúc tài liệu để theo dõi yêu cầu và tiến độ | Đối chiếu tài liệu với cấu trúc và yêu cầu thực tế | `PROJECT_REQUIREMENTS_AUDIT.txt`, `PROJECT_ROADMAP.txt` |
| 02 | 23/10/2026 | Gemini / Antigravity | Khởi tạo cấu trúc dự án | Đề xuất sử dụng Expo, Expo Router và TypeScript, tổ chức mã nguồn theo module | Sử dụng các thư mục `app/`, `components/`, `services/`, `store/`, `types/`, `utils/` và các thư mục liên quan | Kiểm tra cấu trúc project, `package.json` và chạy TypeScript compiler | `app/`, `components/`, `services/`, `store/`, `types/`, `utils/`, `package.json`, `tsconfig.json` |
| 03 | 23/10/2026 | Gemini / Antigravity | Thiết kế hệ thống màu sắc và giao diện | Đề xuất tổ chức màu theo vai trò, hỗ trợ giao diện sáng và tối | Điều chỉnh cách sử dụng màu để thống nhất giữa các màn hình | Kiểm tra giao diện sáng/tối và rà soát mã màu theo quy định của dự án | `constants/`, `hooks/` |
| 04 | 24/10/2026 | Gemini / Antigravity | Xây dựng backend cho chợ sinh viên | Đề xuất sử dụng Node.js và Express để cung cấp API cho ứng dụng | Tổ chức mã nguồn backend riêng với ứng dụng Expo; điều chỉnh xử lý ảnh và CORS theo môi trường chạy | Kiểm tra API và kết nối giữa frontend với backend | `backend/`, `services/` |
| 05 | 24/10/2026 | Gemini / Antigravity | Xây dựng chức năng đăng nhập và phân quyền | Đề xuất quản lý phiên đăng nhập, lưu trữ token và trạng thái người dùng | Điều chỉnh luồng khôi phục phiên và phân biệt quyền người mua, người bán | Kiểm tra đăng nhập, đăng xuất, khôi phục phiên và quyền thao tác | `store/useAuthStore.ts`, `services/authStorage.ts`, `app/login.tsx` |
| 06 | 25/10/2026 | Gemini / Antigravity | Xây dựng tìm kiếm và lọc tin đăng | Đề xuất xử lý dữ liệu tìm kiếm bằng các hàm thuần và tính toán dữ liệu dẫn xuất | Bổ sung khả năng tìm kiếm tiếng Việt không dấu nếu phù hợp với yêu cầu | Kiểm tra tìm kiếm theo tên, danh mục và từ khóa có/không dấu | `app/(tabs)/index.tsx`, `utils/`, `tests/` |
| 07 | 25/10/2026 | Gemini / Antigravity | Tối ưu hình ảnh sản phẩm | Đề xuất thay đổi kích thước và nén ảnh trước khi tải lên | Sử dụng quy trình nén ảnh phù hợp với ứng dụng; cần ghi nhận số liệu thực nghiệm sau khi chạy | So sánh dung lượng ảnh trước và sau nén bằng dữ liệu đo thực tế | `utils/`, `app/listing-form.tsx`, `backend/` |
| 08 | 26/10/2026 | Gemini / Antigravity | Xây dựng giỏ hàng và tính toán đơn hàng | Đề xuất quản lý giỏ hàng, tính tổng tiền và kiểm tra số lượng tồn kho | Điều chỉnh logic thêm sản phẩm và kiểm tra tồn kho trước khi thanh toán | Chạy test tính tiền, số lượng, tồn kho và các trường hợp dữ liệu không hợp lệ | `store/useCartStore.ts`, `utils/cartCalculations.ts`, `app/checkout.tsx`, `tests/` |
| 09 | 26/10/2026 | Gemini / Antigravity | Hỗ trợ hoạt động khi mất kết nối | Đề xuất lưu dữ liệu đã tải và sử dụng dữ liệu cache khi API không khả dụng | Điều chỉnh giao diện để thông báo trạng thái kết nối và nguồn dữ liệu | Ngắt kết nối mạng, mở lại màn hình và kiểm tra khả năng hiển thị dữ liệu đã lưu | `services/`, `components/`, `app/` |
| 10 | 26/10/2026 | Gemini / Antigravity | Theo dõi thay đổi giá sản phẩm yêu thích | Đề xuất so sánh giá cũ và giá mới để phát hiện biến động | Xem xét cơ chế thông báo và giới hạn thông báo lặp | Kiểm thử với dữ liệu giá mẫu; xác nhận quyền thông báo trên thiết bị khi cần | `services/`, `store/`, `tests/` |
| 11 | 27/10/2026 | Gemini / Antigravity | Xây dựng bộ kiểm thử tự động | Đề xuất sử dụng Vitest để kiểm thử các hàm logic và nghiệp vụ | Tổ chức các bài test theo nhóm chức năng của dự án | Chạy `npm test` và ghi nhận số test thành công/thất bại từ kết quả thực tế | `tests/`, `vitest.config.ts`, `package.json` |
| 12 | 27/10/2026 | Gemini / Antigravity | Kiểm tra chất lượng mã nguồn | Đề xuất chạy TypeScript compiler, lint và kiểm tra quy tắc mã nguồn | Sử dụng các công cụ kiểm tra trước khi hoàn thiện sản phẩm | Chạy `npx tsc --noEmit`, lệnh lint được khai báo trong `package.json` và các kiểm tra cần thiết | `package.json`, `tsconfig.json`, `constants/`, các module liên quan |
| 13 | 27/10/2026 | Gemini / Antigravity | Tự động lựa chọn hình ảnh theo tên sản phẩm | Đề xuất ánh xạ từ khóa sản phẩm sang hình ảnh phù hợp | Điều chỉnh cách ưu tiên từ khóa để hạn chế nhận diện nhầm loại sản phẩm | Kiểm tra các trường hợp tên sản phẩm dễ gây nhầm lẫn và chạy test tương ứng | `utils/smartProductImage.ts`, `app/listing-form.tsx`, `components/`, `backend/`, `tests/` |
| 14 | 27/10/2026 | Gemini / Antigravity | Hoàn thiện đăng nhập, đăng xuất và chế độ khách | Đề xuất kiểm soát trạng thái phiên, tránh tự đăng nhập lại sau khi đăng xuất và phân biệt khách với người dùng đã đăng nhập | Điều chỉnh luồng điều hướng để người chưa đăng nhập có thể xem chợ nhưng cần đăng nhập trước khi thực hiện giao dịch | Kiểm tra khôi phục phiên, đăng xuất, đăng nhập lại và truy cập các màn hình cần tài khoản | `services/authStorage.ts`, `store/useAuthStore.ts`, `app/login.tsx`, `app/(tabs)/profile.tsx`, `app/_layout.tsx` |
| 15 | 27/10/2026 | ChatGPT | Sửa lỗi HTML lồng nút trên Expo Web | Phân tích cảnh báo `<button>` lồng trong `<button>` tại `FavoriteButton.tsx` và `ListingCard.tsx`; đề xuất tách vùng nhấn mở chi tiết, yêu thích và thêm giỏ hàng | Đề xuất thay đổi cấu trúc giao diện để các nút hoạt động độc lập, tránh nút lồng nhau | Chạy `npx tsc --noEmit`, khởi động lại Expo Web và kiểm tra Console trình duyệt | `components/FavoriteButton.tsx`, `components/ListingCard.tsx` |
| 16 | 27/10/2026 | ChatGPT | Điều chỉnh quyền truy cập của khách | Đề xuất cho khách xem danh sách và chi tiết sản phẩm; yêu cầu đăng nhập khi yêu thích, thêm giỏ hàng, thanh toán hoặc đăng tin | Điều chỉnh điều kiện điều hướng và bổ sung kiểm tra tài khoản ở các thao tác cần quyền | Thử nghiệm với khách và tài khoản đã đăng nhập; kiểm tra cả điều hướng trực tiếp và API backend | `app/_layout.tsx`, `app/login.tsx`, `app/checkout.tsx`, `app/listing-form.tsx`, `components/`, `store/` |

---

## 4. QUY TRÌNH KIỂM CHỨNG SAU KHI SỬ DỤNG AI

Các gợi ý AI chỉ được xem là hoàn tất sau khi sinh viên tự kiểm tra và xác nhận.

### 4.1. Kiểm tra TypeScript

```bash
npx tsc --noEmit
```

Ghi nhận kết quả thực tế: số lỗi, nội dung lỗi và các file đã sửa.

### 4.2. Kiểm tra lint

Chạy lệnh lint được cấu hình trong `package.json`, ví dụ:

```bash
npm run lint
```

Chỉ sử dụng lệnh trên nếu project đã khai báo script `lint`.

### 4.3. Chạy kiểm thử tự động

```bash
npm test
```

Ghi lại số lượng test thành công, thất bại và những trường hợp đã sửa sau khi phát hiện lỗi.

### 4.4. Kiểm tra ứng dụng trên web

```bash
npx expo start --web --clear
```

Kiểm tra giao diện, điều hướng, đăng nhập, chế độ khách, giỏ hàng và các lỗi hiển thị trong Console trình duyệt.

---

## 5. ĐÁNH GIÁ VÀ TRÁCH NHIỆM CỦA SINH VIÊN

AI được sử dụng như công cụ hỗ trợ phân tích yêu cầu, đề xuất cấu trúc mã nguồn, giải thích lỗi và xây dựng phương án kiểm thử. Các đề xuất không mặc nhiên được xem là đúng hoặc đã hoàn thành.

Sinh viên có trách nhiệm:
- Đọc và hiểu phần mã nguồn được đề xuất.
- Điều chỉnh mã nguồn theo cấu trúc và yêu cầu thực tế của dự án.
- Kiểm tra các trường hợp lỗi và hành vi ngoài dự kiến.
- Ghi nhận trung thực kết quả kiểm thử.
- Bảo đảm các chức năng liên quan đến tài khoản, quyền người dùng và giao dịch được kiểm tra ở cả frontend lẫn backend.

**Trạng thái tài liệu:** Nhật ký được cập nhật theo các nội dung tương tác đã ghi nhận. Các kết quả kiểm thử và trạng thái hoàn thành cần được bổ sung sau khi thực hiện kiểm chứng thực tế.

---
