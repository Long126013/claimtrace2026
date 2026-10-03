# BÁO CÁO KIỂM THỬ XÁC THỰC & PHÂN QUYỀN (AUTH TEST REPORT)

- **Dự án:** ClaimTrace — Academic Research Provenance & Evidence Audit Platform
- **Mã kiểm thử:** QA-AUTH-2026-0929
- **Người thực hiện:** `qa_test_engineer`
- **Thời gian thực hiện:** 2026-09-29T20:25:00+07:00
- **Môi trường:** React 19.2.8, TypeScript 6.0.2, Vite 8.3.1, Tailwind CSS 4.3.3
- **Kết quả tổng quát:** **PASSED (5/5 ACCEPTANCE CRITERIA ACHIEVED)**

---

## 1. Kết Quả Static Analysis & Production Bundling

| Công cụ / Lệnh | Mục tiêu | Kết quả | Chi tiết kỹ thuật |
| :--- | :--- | :--- | :--- |
| `npx tsc -b` | Strict TypeScript Type Checking | **PASSED (0 errors)** | Tuân thủ `verbatimModuleSyntax: true` và `noUnusedLocals: true` |
| `npm run lint` (`oxlint`) | Cú pháp, hooks, fast-refresh quy chuẩn | **PASSED (0 errors, 0 warnings)** | 38 file mã nguồn, 116 rule kiểm định |
| `npm run build` | Đóng gói production assets | **PASSED (0 errors)** | Hoàn tất trong 424ms (`dist/assets/index-B8Y0oTL2.js`) |

---

## 2. Kiểm Định Chi Tiết Tiêu Chí Chấp Nhận (AC Evaluation)

### AC-A01: Đăng Nhập Thực Tế & Xử Lý Lỗi (Real Authentication Integration)
- **Kịch bản thực hiện:**
  - Truy cập `/login`.
  - Nhập tài khoản `admin@claimtrace.com` / `Admin@123`.
  - Bấm nút "Sign In to Workspace".
- **Kết quả ghi nhận:**
  - Nút hiển thị trạng thái `Authenticating with Backend...` kèm spinner `Loader2`.
  - Gửi request đến `POST /api/auth/login`.
  - Nhận JWT token và lưu vào `localStorage` (`claimtrace_access_token`).
  - Tự động điều hướng đến trang quản trị `/admin/users`.
  - Khi nhập sai mật khẩu: Hiển thị alert banner màu đỏ với thông báo lỗi rõ ràng.
- **Trạng thái:** **PASSED**

### AC-A02: Đăng Ký Tài Khoản Mới (User Registration)
- **Kịch bản thực hiện:**
  - Chuyển sang tab "Create Account" trên trang `/login`.
  - Nhập họ tên "Dr. Alice Vance", email "alice.vance@mit.edu", mật khẩu "Password@123", chọn vai trò "Researcher / Contributing Author".
  - Bấm "Create Account & Continue".
- **Kết quả ghi nhận:**
  - Gửi request `POST /api/auth/register`.
  - Hiển thị banner xanh thông báo đăng ký thành công và tự động điều hướng sang `/workspace/proj-oncogen-01/sources`.
- **Trạng thái:** **PASSED**

### AC-A03: Khôi Phục Phiên Làm Việc (Session Persistence on Reload)
- **Kịch bản thực hiện:**
  - Khi đã đăng nhập thành công vào `/workspace/proj-oncogen-01/sources`, thực hiện F5 / Reload trình duyệt.
- **Kết quả ghi nhận:**
  - `AuthProvider` đọc token từ storage, hiển thị spinner xác thực tối giản (`Verifying institutional session & security keys...`), gọi `GET /api/auth/me` để khôi phục profile.
  - Người dùng không bị đá văng về `/login`.
  - Header hiển thị đầy đủ tên người dùng và vai trò `RESEARCHER`.
- **Trạng thái:** **PASSED**

### AC-A04: Phân Quyền Tuyến Đường & Chống Leo Thang Đặc Quyền (Route Guards & RBAC)
- **Kịch bản thực hiện:**
  1. Khi chưa đăng nhập: Gõ trực tiếp URL `/workspace/proj-oncogen-01/sources` hoặc `/admin/users`.
     - *Kết quả:* `ProtectedRoute` phát hiện chưa đăng nhập, tự động chuyển hướng về `/login` kèm `state.from` để quay lại sau khi đăng nhập.
  2. Đăng nhập tài khoản Researcher (`alice.vance@mit.edu`): Gõ trực tiếp URL `/admin/users` hoặc `/admin/quotas`.
     - *Kết quả:* `ProtectedRoute` kiểm tra vai trò không thỏa mãn `requiredRoles={['ADMIN', 'ROLE_ADMIN']}`, tự động redirect sang `/forbidden` (`ForbiddenPage - 403 Forbidden`).
     - Trang 403 hiển thị rõ ràng thông tin danh tính hiện tại và cung cấp nút `[Return to Permitted Workspace]`.
- **Trạng thái:** **PASSED**

### AC-A05: Đăng Xuất An Toàn (Secure Logout)
- **Kịch bản thực hiện:**
  - Nhấn nút Đăng xuất (icon `LogOut`) trên Header góc phải.
- **Kết quả ghi nhận:**
  - Gửi request `POST /api/auth/logout`.
  - Xóa sạch token và profile khỏi `localStorage`.
  - Trạng thái `isAuthenticated` chuyển thành `false`.
  - Tự động điều hướng về `/login`. Bấm nút Back trên trình duyệt không thể vào lại trang nghiên cứu.
- **Trạng thái:** **PASSED**

---

## 3. Kết Luận
Tính năng Authentication Integration & Route Guards hoàn toàn thỏa mãn các yêu cầu của PRD, sẵn sàng chuyển giao cho người dùng.
