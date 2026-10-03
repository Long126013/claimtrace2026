# TÀI LIỆU ĐẶC TẢ YÊU CẦU: AUTH INTEGRATION & ROUTE GUARDS

- **Dự án:** ClaimTrace — Academic Research Provenance & Evidence Audit Platform
- **Mã tài liệu:** SPEC-AUTH-2026-0929
- **Người lập:** `requirements_analyst`
- **Phiên bản:** 1.0.0
- **Trạng thái:** APPROVED FOR DEVELOPMENT

---

## 1. Tổng Quan Nghiệp Vụ (Business Overview)

Hệ thống ClaimTrace chuyển đổi từ mô hình thử nghiệm sang mô hình xác thực và phân quyền chính thức (Enterprise Academic IAM). Toàn bộ thao tác truy cập không gian nghiên cứu, tạo lập luận điểm (claims), quản lý hạn ngạch AI và thực hiện kiểm toán phải được định danh qua JSON Web Token (JWT) do Spring Boot IAM Service cấp phát.

Hệ thống phân quyền theo vai trò (Role-Based Access Control - RBAC) với 4 nhóm vai trò:
1. `ADMIN` (Quản trị viên toàn hệ thống): Quản lý người dùng, hạn mức AI Quota, giám sát hạ tầng.
2. `PRINCIPAL_INVESTIGATOR` (Chủ nhiệm đề tài - PI): Khởi tạo dự án, phân bổ thành viên, quản lý tổng thể tiến độ nghiên cứu.
3. `RESEARCHER` (Nhà nghiên cứu / Tác giả): Soạn thảo bản thảo, neo giữ luận điểm (W3C Anchoring), đăng ký chứng cứ số (datasets/code), triage AI suggestions.
4. `REVIEWER` / `AUDITOR` (Bình duyệt viên / Kiểm toán viên độc lập): Kiểm tra đồ thị xuất xứ (PROV-O Lineage), kiểm tra tính toàn vẹn SHA-256, xem chế độ Redacted Audit (HIPAA/GDPR), xuất RO-Crate.

---

## 2. Bóc Tách User Stories

### US-AUTH-01: Đăng Nhập & Đăng Ký Tài Khoản Học Thuật
- **Là một:** Nhà nghiên cứu hoặc Quản trị viên.
- **Tôi muốn:** Đăng nhập bằng Email/Password đã đăng ký hoặc tạo tài khoản mới ngay trên giao diện.
- **Để:** Hệ thống xác thực danh tính, cấp phát JWT access token và cho phép truy cập các tài nguyên được phân quyền.
- **Chi tiết:**
  - Form Đăng nhập kết nối `POST /api/auth/login`.
  - Form Đăng ký kết nối `POST /api/auth/register` (hỗ trợ nhập Full Name, Email, Password, và lựa chọn Role mong muốn).
  - Có trạng thái loading spinner khi đang gửi request.
  - Hiển thị banner lỗi rõ ràng khi thông tin đăng nhập sai hoặc email trùng lặp.

### US-AUTH-02: Quản Lý Phiên Làm Việc & Tự Động Đính Kèm Token
- **Là một:** Người dùng đã xác thực.
- **Tôi muốn:** Phiên làm việc được duy trì liên tục khi tải lại trang (F5/Reload) và tự động gắn token xác thực vào mọi request.
- **Để:** Không phải đăng nhập lại nhiều lần và hệ thống ghi nhận chính xác quyền của tôi.
- **Chi tiết:**
  - Lưu token trong `localStorage` (`claimtrace_access_token`) và lưu thông tin user profile (`claimtrace_user_profile`).
  - Khi tải ứng dụng, tự động gọi `GET /api/auth/me` để kiểm tra tính hợp lệ của token và khôi phục `currentUser`.
  - HTTP Interceptor tự động gắn header `Authorization: Bearer <token>`.
  - Khi API trả về `401 Unauthorized`, hệ thống tự động xóa token và chuyển hướng về `/login`.

### US-AUTH-03: Bảo Vệ Tuyến Đường & Phân Luồng Điều Hướng Theo Role
- **Là một:** Hệ thống kiểm toán học thuật an toàn.
- **Tôi muốn:** Chặn các truy cập chưa xác thực vào khu vực nghiên cứu và ngăn chặn truy cập chéo trái phép giữa các vai trò (chống Privilege Escalation).
- **Để:** Bảo vệ tính bảo mật của dữ liệu tiền xuất bản và đảm bảo tính độc lập của kiểm toán viên.
- **Chi tiết:**
  - `ProtectedRoute`: Nếu `!isAuthenticated` -> Redirect về `/login`.
  - `RoleBasedRoute`: Kiểm tra vai trò của `currentUser`. Nếu không đủ thẩm quyền -> Hiển thị trang `403 Access Denied` (ForbiddenPage) kèm nút quay về trang tương ứng với vai trò.
  - Phân luồng mặc định sau khi đăng nhập thành công:
    - `ADMIN` -> `/admin/users`
    - `RESEARCHER` -> `/workspace/proj-oncogen-01/sources`
    - `REVIEWER` / `AUDITOR` -> `/workspace/proj-oncogen-01/audit`
    - `PRINCIPAL_INVESTIGATOR` -> `/dashboard`
