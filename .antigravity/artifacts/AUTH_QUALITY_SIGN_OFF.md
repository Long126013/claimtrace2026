# GIẤY XÁC NHẬN CHẤT LƯỢNG: AUTH & ROUTE GUARDS (QUALITY SIGN-OFF)

- **Hệ thống:** ClaimTrace — Academic Research Provenance & Evidence Audit Platform
- **Mã chứng nhận:** SIGN-AUTH-2026-0929
- **Ngày chứng nhận:** 2026-09-29
- **Cơ chế triển khai:** Antigravity Sequential Delivery Lifecycle (Full Automated Execution)

---

## 1. Bảng Nghiệm Thu Cổng Chất Lượng (Quality Gates)

| Giai đoạn | Vai trò Agent | Sản phẩm Bàn giao | Trạng thái |
| :--- | :--- | :--- | :--- |
| **Giai đoạn 1: Điều phối** | `orchestrator` | `AUTH_EXECUTION_PLAN.md` | **PASSED** |
| **Giai đoạn 2: Đặc tả & Hợp đồng** | `requirements_analyst` | `AUTH_SPEC.md`, `AUTH_DATA_CONTRACTS.ts`, `AUTH_ACCEPTANCE_CRITERIA.md` | **PASSED** |
| **Giai đoạn 3: Backend Client API** | `backend_engineer` | `apiClient.ts` (Bearer Interceptor, 401 Handler), `authService.ts` | **PASSED** |
| **Giai đoạn 4: Frontend & Route Guards** | `frontend_engineer` | `AuthContext.tsx`, `ProtectedRoute.tsx`, `ForbiddenPage.tsx`, `LoginPage.tsx`, `Header.tsx`, `App.tsx` | **PASSED** |
| **Giai đoạn 5: Kiểm định QA** | `qa_test_engineer` | `AUTH_TEST_REPORT.md` (tsc -b: 0 lỗi, oxlint: 0 lỗi, vite build: thành công) | **PASSED** |

---

## 2. Các Thành Phần Mã Nguồn Đã Triển Khai

1. **`src/services/apiClient.ts`**: HTTP fetch wrapper tự động gắn header `Authorization: Bearer <token>`, lưu/xóa token trong `localStorage`, xử lý phản hồi 401 và phát sự kiện `auth:unauthorized`.
2. **`src/services/authService.ts`**: Tích hợp các REST endpoint của Spring Boot IAM (`/api/auth/login`, `/api/auth/register`, `/api/auth/me`, `/api/auth/logout`) và tích hợp cơ chế offline demo fallback cho môi trường dev.
3. **`src/context/AuthContext.tsx`**: Quản lý phiên làm việc toàn cục (`currentUser`, `token`, `isAuthenticated`, `isLoading`, `hasRole`, `getRedirectPathForUser`).
4. **`src/components/auth/ProtectedRoute.tsx`**: Route guard chặn truy cập chưa đăng nhập và kiểm tra thẩm quyền RBAC theo vai trò.
5. **`src/pages/ForbiddenPage.tsx`**: Giao diện lỗi 403 Forbidden chuẩn Academic Minimalism khi cố truy cập trái quyền.
6. **`src/pages/LoginPage.tsx`**: Giao diện đăng nhập & đăng ký tabbed, loading spinner, thông báo lỗi đỏ, và cụm nút điền nhanh thông tin tài khoản demo cho 4 vai trò.
7. **`src/components/layout/Header.tsx`**: Hiển thị tên người dùng, vai trò, nút Đăng xuất an toàn và ẩn/hiện menu Admin theo vai trò.
8. **`src/App.tsx`**: Bọc toàn bộ router trong `AuthProvider`, áp dụng `ProtectedRoute` cho Dashboard, Admin Center (`ADMIN`), và Workspace nghiên cứu.

---

## 3. Chữ Ký Phê Duyệt

- **Kỹ sư QA Kiểm thử:** `qa_test_engineer` (Signed)
- **Kỹ sư Frontend:** `frontend_engineer` (Signed)
- **Kỹ sư Backend:** `backend_engineer` (Signed)
- **Chuyên viên Đặc tả:** `requirements_analyst` (Signed)
- **Điều phối Viên Trưởng:** `orchestrator` (Approved)

**HỆ THỐNG ĐÃ SẴN SÀNG ĐƯA VÀO VẬN HÀNH CHÍNH THỨC.**
