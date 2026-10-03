# Quy Trình Phát Triển Tuần Tự (Sequential Delivery Lifecycle)

Tài liệu này mô tả chi tiết chu trình 5 bước chuyển tiếp công việc giữa các Agent trong hệ thống Antigravity cho dự án **ClaimTrace**.

```
  [User Request]
        │
        ▼
┌─────────────────────────────────┐
│  STAGE 1: ORCHESTRATION         │
│  Agent: `orchestrator`          │
│  - Phân tích mục tiêu & phạm vi │
│  - Lập WBS & điều phối          │
└───────────────┬─────────────────┘
                │ Kế hoạch bàn giao (EXECUTION_PLAN.md)
                ▼
┌─────────────────────────────────┐
│  STAGE 2: REQUIREMENTS          │
│  Agent: `requirements_analyst`  │
│  - Bóc tách User Stories        │
│  - Định nghĩa Data Contracts    │
│  - Thiết lập Acceptance Criteria│
└───────────────┬─────────────────┘
                │ Spec & Types (REQUIREMENTS_SPEC.md, DATA_CONTRACTS.ts)
                ▼
┌─────────────────────────────────┐
│  STAGE 3: FRONTEND DEVELOPMENT  │
│  Agent: `frontend_engineer`     │
│  - Dựng UI/UX chuẩn Academic    │
│  - Kết nối State (Zustand)      │
│  - Hiện thực tương tác & router │
└───────────────┬─────────────────┘
                │ UI Components & Pages sẵn sàng
                ▼
┌─────────────────────────────────┐
│  STAGE 4: BACKEND DEVELOPMENT   │
│  Agent: `backend_engineer`      │
│  - Hiện thực API endpoints      │
│  - Xử lý hash SHA-256 & PROV-O  │
│  - Đóng gói RO-Crate 1.1 JSON-LD│
└───────────────┬─────────────────┘
                │ Codebase tích hợp hoàn chỉnh
                ▼
┌─────────────────────────────────┐
│  STAGE 5: QA & TESTING          │
│  Agent: `qa_test_engineer`      │
│  - Chạy tsc, lint, build        │
│  - Chạy unit & integration test │
│  - Đối chiếu Acceptance Criteria│
└───────────────┬─────────────────┘
                │
        ┌───────┴───────┐
   [Phát hiện Lỗi]   [Tất cả PASS]
        │               │
        ▼               ▼
 Quay về Agent tương ứng    Xuất `QUALITY_SIGN_OFF.md`
 (FE / BE / Requirements)   Bàn giao cho Người dùng
```

---

## Chi Tiết Từng Giai Đoạn

### Giai đoạn 1: Điều phối (Orchestration)
- **Tác nhân**: `orchestrator`
- **Hoạt động**:
  1. Phân tích prompt của người dùng để xác định mục tiêu cốt lõi.
  2. Rà soát codebase hiện tại để tránh làm vỡ các tính năng đã chạy ổn định.
  3. Xuất file kế hoạch `.antigravity/artifacts/EXECUTION_PLAN.md`.
  4. Bàn giao nhiệm vụ cho `requirements_analyst`.

### Giai đoạn 2: Đọc & Phân tích Requirement (Requirements Analysis)
- **Tác nhân**: `requirements_analyst`
- **Hoạt động**:
  1. Chuyển hóa mục tiêu thành các User Stories có tiêu chí nghiệm thu rõ ràng.
  2. Khóa hợp đồng dữ liệu trong `DATA_CONTRACTS.ts`.
  3. Cung cấp file hướng dẫn chi tiết cho đội ngũ kỹ sư.
  4. Trình `orchestrator` duyệt cổng (Quality Gate 1).

### Giai đoạn 3: Phát triển Giao diện (Frontend Implementation)
- **Tác nhân**: `frontend_engineer`
- **Hoạt động**:
  1. Lấy dữ liệu và kiểu từ `DATA_CONTRACTS.ts`.
  2. Xây dựng giao diện theo quy tắc **Academic Minimalism**: Tone xám trắng thanh lịch, typography phân lớp rõ ràng.
  3. Cập nhật Zustand store đảm bảo tính phản xạ dữ liệu (live reactivity).
  4. Kiểm tra render, responsiveness trên trình duyệt.

### Giai đoạn 4: Phát triển Backend & Dịch Vụ (Backend Implementation)
- **Tác nhân**: `backend_engineer`
- **Hoạt động**:
  1. Viết các endpoint REST API tương thích với Data Contract.
  2. Hiện thực hóa thuật toán kiểm tra tính bất biến của SHA-256 và thuật toán lan truyền staleness.
  3. Đảm bảo cấu trúc metadata JSON-LD của RO-Crate đáp ứng W3C Open Annotation.
  4. Đảm bảo mock service và real service có thể thay thế nhau không gây xung đột.

### Giai đoạn 5: Kiểm Thử & Nghiệm Thu (QA & Testing)
- **Tác nhân**: `qa_test_engineer`
- **Hoạt động**:
  1. Chạy static type check: `npx tsc -b`.
  2. Chạy linter: `npm run lint`.
  3. Chạy production build: `npm run build`.
  4. Kiểm tra tương tác người dùng trên từng kịch bản nghiệm thu.
  5. Đóng gói báo cáo kiểm thử và cấp chứng chỉ nghiệm thu.
