# BỘ TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA) - AUTH & ROUTE GUARDS

- **Dự án:** ClaimTrace — Academic Research Provenance & Evidence Audit Platform
- **Mã tài liệu:** AC-AUTH-2026-0929
- **Người lập:** `requirements_analyst`
- **Phương pháp:** Gherkin BDD (Given - When - Then)

---

### AC-A01: Đăng Nhập Thực Tế & Xử Lý Lỗi (Real Authentication Integration)
```gherkin
Feature: User Login via Backend API
  Scenario: Đăng nhập thành công với tài khoản hợp lệ
    Given Người dùng ở trang "/login"
    When Nhập email "admin@claimtrace.com" và mật khẩu "Admin@123"
    And Nhấn nút "Sign In"
    Then Nút chuyển sang trạng thái loading với spinner
    And Hệ thống gửi request "POST /api/auth/login"
    And Nhận về JWT token và lưu vào LocalStorage
    And Tự động điều hướng đến trang quản trị "/admin/users"

  Scenario: Đăng nhập thất bại do sai thông tin
    Given Người dùng ở trang "/login"
    When Nhập sai email hoặc mật khẩu
    And Nhấn nút "Sign In"
    Then Hiển thị banner thông báo lỗi màu đỏ rõ ràng
    And Không lưu token và ở lại trang "/login"
```

### AC-A02: Đăng Ký Tài Khoản Mới (User Registration)
```gherkin
Feature: User Registration
  Scenario: Đăng ký tài khoản nghiên cứu viên mới
    Given Người dùng chuyển sang tab "Sign Up" trên trang "/login"
    When Nhập họ tên "Dr. Alice Vance", email "alice.vance@mit.edu", mật khẩu "Password@123"
    And Nhấn nút "Create Account"
    Then Hệ thống gửi request "POST /api/auth/register"
    And Đăng ký thành công, tự động cấp phát token hoặc chuyển hướng sang Sign In với thông báo thành công
```

### AC-A03: Khôi Phục Phiên Làm Việc (Session Persistence on Reload)
```gherkin
Feature: Session Persistence
  Scenario: Tải lại trang (F5) khi token còn hiệu lực
    Given Người dùng đã đăng nhập và đang ở "/workspace/proj-oncogen-01/sources"
    When Người dùng nhấn F5 hoặc Reload trình duyệt
    Then Hệ thống đọc token từ LocalStorage và gọi "GET /api/auth/me" để khôi phục phiên
    And Người dùng không bị chuyển hướng về "/login"
    And Tên và vai trò của người dùng vẫn hiển thị trên Header
```

### AC-A04: Phân Quyền Tuyến Đường & Chặn Truy Cập Trái Phép (Route Guards & RBAC)
```gherkin
Feature: Route Protection & Privilege Escalation Prevention
  Scenario: Truy cập trang bảo vệ khi chưa đăng nhập
    Given Người dùng chưa đăng nhập (không có token)
    When Cố tình truy cập URL "/workspace/proj-oncogen-01/sources" hoặc "/admin/users"
    Then ProtectedRoute chặn truy cập và chuyển hướng về "/login"

  Scenario: Researcher cố tình truy cập vào trang Admin
    Given Người dùng đăng nhập với vai trò "RESEARCHER"
    When Gõ trực tiếp URL "/admin/users" hoặc "/admin/quotas"
    Then Hệ thống hiển thị trang cảnh báo "403 Access Denied"
    And Cung cấp nút quay lại màn hình nghiên cứu được phép
```

### AC-A05: Đăng Xuất An Toàn (Secure Logout)
```gherkin
Feature: Secure Logout
  Scenario: Người dùng bấm Đăng xuất
    Given Người dùng đang đăng nhập và có token trong LocalStorage
    When Nhấn nút "Logout" trên Header
    Then Hệ thống gửi request "POST /api/auth/logout" (hoặc xóa token)
    And Xóa sạch token và profile khỏi LocalStorage
    And Điều hướng về trang "/login"
    And Không thể bấm nút Back của trình duyệt để quay lại trang bảo vệ
```
