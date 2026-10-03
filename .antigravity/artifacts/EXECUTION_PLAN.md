# WORK BREAKDOWN STRUCTURE & EXECUTION PLAN (ClaimTrace)

- **Target PRD**: `REQUIREMENTS.md` (Product Requirements Document - UI/Frontend Only)
- **Mode**: Antigravity Sequential SDLC Pipeline
- **Execution Date**: 2026-09-29
- **Lead Orchestrator**: `orchestrator`

---

## 1. Phân Tích Hiện Trạng & Khoảng Trống (Gap Analysis)

| Mã Yêu Cầu | Tên Thành Phần UI | Trạng Thái Hiện Tại | Kế Hoạch Triển Khai |
| :--- | :--- | :--- | :--- |
| **UI-01** | Admin User Management Table | Chưa có trang chuyên biệt | Tạo `/admin/users` hoặc sub-tab Admin với bảng phân quyền và modal tạo user. |
| **UI-02** | AI Quotas & Project Provisioning | Đã có NewProjectModal cơ bản | Bổ sung form cấu hình AI Quotas & Provider endpoints chi tiết. |
| **UI-03** | Datasets & Code Revisions | Đã có trong `EvidenceView.tsx` | Bổ sung trạng thái Loading/Empty, snapshot versioning, và filter rõ ràng. |
| **UI-04** | AI Suggestion Triage & Sync Status | Đã có một phần trong `AiGovernanceView` | Bổ sung giao diện so sánh Prompt/Suggestion, 3 nút tương tác Accept/Modify/Reject, badge Offline Buffering/Reconciled Sync. |
| **UI-05** | Manuscript Viewer & Text Span Anchoring | Đã có trong `SourcesView.tsx` | Hoàn thiện popover tương tác khi bôi đen text span để tạo W3C Claim Node. |
| **UI-06** | Evidence Subgraph Panel & Diff View | Chưa có chế độ so sánh 2 bản thảo | Bổ sung giao diện Split Diff View, hiển thị Unmatched Anchors kèm nút Re-align. |
| **UI-07** | Bitemporal Lineage Graph Explorer | Đã có trong `LineageTreesView.tsx` | Bổ sung Timeline Slider/Toggle chuyển đổi giữa "Thời điểm viết bản thảo" và "Hiện tại". |
| **UI-08** | Claim Health Status Table | Đã có danh sách claim & staleness | Bổ sung Toast cảnh báo khi trạng thái chuyển sang Stale/Broken, bảng tổng hợp sức khỏe. |
| **UI-09** | Redacted Audit Lineage View | Chưa có chế độ Redaction | Bổ sung nút Redaction làm mờ sensitive prompt và panel ghi chú Audit Observations. |
| **UI-10** | CRediT Dashboard & RO-Crate Export | Đã có RoCrateDialog | Bổ sung CRediT Taxonomy contributor matrix và modal mô phỏng tải gói RO-Crate/PROV-JSON. |

---

## 2. Kế Hoạch Triển Khai Tuần Tự (Sequential Stages)

### STAGE 2: `requirements_analyst`
- Tạo `.antigravity/artifacts/REQUIREMENTS_SPEC.md`: Bóc tách chi tiết từng User Story cho cả 10 thành phần UI.
- Tạo `.antigravity/artifacts/DATA_CONTRACTS.ts`: Khóa toàn bộ TypeScript Interfaces cho Admin, AI Quotas, CRediT, Redacted Audit, Bitemporal Lineage.
- Tạo `.antigravity/artifacts/ACCEPTANCE_CRITERIA.md`: Danh mục tiêu chí nghiệm thu kiểm thử.

### STAGE 3: `frontend_engineer`
- Tạo thư mục `src/mocks/` chứa các tệp mock data JSON/TS chuẩn theo yêu cầu PRD mục 1 & 4.
- Cập nhật định tuyến navigation trên Header / Workspace:
  - Bổ sung Navigation liên kết: Workspace, Admin Management, Audit & CRediT Reporting.
- Hoàn thiện 10 thành phần UI:
  - Màn hình 1: `AdminUsersView.tsx`, `AiQuotasView.tsx`
  - Màn hình 2: Nâng cấp `EvidenceView.tsx`, hoàn thiện `AiTriageView.tsx`
  - Màn hình 3: Nâng cấp `SourcesView.tsx` với Text Selection Popover, thêm `ManuscriptDiffView.tsx`
  - Màn hình 4: Nâng cấp `LineageTreesView.tsx` với Bitemporal Timeline Toggle & Toast cảnh báo
  - Màn hình 5: Thêm `AuditLineageView.tsx` (Redaction mode) và `CreditDashboardView.tsx` (CRediT matrix & RO-Crate download simulation)
- Đảm bảo đầy đủ 3 trạng thái: Loading, Populated, Empty cho tất cả các bảng.

### STAGE 4: `backend_engineer`
- Tổ chức tầng dịch vụ `src/services/` và `src/mocks/`:
  - `adminService.ts`, `aiQuotaService.ts`, `manuscriptService.ts`, `auditService.ts`, `roCrateService.ts`.
- Đảm bảo dữ liệu mock phản hồi mô phỏng độ trễ (latency), trả về đúng schema và hỗ trợ offline buffering / state invalidation.

### STAGE 5: `qa_test_engineer`
- Chạy static analysis: `npx tsc -b` (0 lỗi).
- Chạy linter: `npm run lint` (0 cảnh báo).
- Kiểm tra tính ổn định của build: `npm run build`.
- Kiểm thử luồng tương tác:
  1. Thử Accept / Modify / Reject gợi ý AI.
  2. Thử ghim văn bản (W3C text span selection).
  3. Thử timeline slider bitemporal trên Lineage Graph.
  4. Thử tính năng Redaction che mờ nội dung nhạy cảm.
  5. Thử xuất gói RO-Crate và kiểm tra bảng CRediT.
- Xuất bản `.antigravity/artifacts/TEST_REPORT.md` và `.antigravity/artifacts/QUALITY_SIGN_OFF.md`.
