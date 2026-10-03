# Giao Thức Chuyển Giao Dữ Liệu Giữa Các Agent (Handoff Protocol)

Để đảm bảo các Agent làm việc tuần tự một cách mượt mà và không làm mất thông tin, giao thức chuyển giao này quy định định dạng dữ liệu đầu vào/đầu ra giữa từng cặp agent.

---

## 1. Orchestrator ➔ Requirements Analyst
- **Phương tiện chuyển giao**: `.antigravity/artifacts/EXECUTION_PLAN.md`
- **Nội dung bắt buộc**:
  - `Feature Title`: Tên tính năng cần triển khai.
  - `User Goal`: Mục đích của người dùng.
  - `High-Level Scope`: Phạm vi những gì làm và không làm.
  - `Target Modules`: Các phân hệ liên quan (Manuscript, Evidence, AI Governance, Curation, Lineage Trees).

---

## 2. Requirements Analyst ➔ Frontend & Backend Engineers
- **Phương tiện chuyển giao**:
  - `.antigravity/artifacts/REQUIREMENTS_SPEC.md`
  - `.antigravity/artifacts/DATA_CONTRACTS.ts`
  - `.antigravity/artifacts/ACCEPTANCE_CRITERIA.md`
- **Nội dung bắt buộc**:
  - Danh sách màn hình, modals, form controls và các trạng thái (empty, loading, stale, healthy).
  - TypeScript interface chuẩn cho tất cả entities.
  - Mock API payloads hoặc response structures.
  - Gherkin test criteria (Given - When - Then).

---

## 3. Frontend & Backend Engineers ➔ QA Test Engineer
- **Phương tiện chuyển giao**:
  - Git commit hash hoặc danh sách các files mã nguồn đã thay đổi.
  - Hướng dẫn chạy thử tính năng trên local environment.
  - Log xác nhận đã chạy `tsc` và `lint` sơ bộ trước khi bàn giao.

---

## 4. QA Test Engineer ➔ Orchestrator / Delivery Sign-off
- **Phương tiện chuyển giao**:
  - `.antigravity/artifacts/TEST_REPORT.md`
  - `.antigravity/artifacts/QUALITY_SIGN_OFF.md`
- **Các kịch bản kết quả**:
  - **APPROVED (Đạt)**: Tất cả tiêu chí đạt 100%, sẵn sàng bàn giao cho người dùng.
  - **REJECTED (Cần sửa lỗi)**: Đính kèm danh sách bug, phân loại lỗi thuộc Frontend hay Backend, mức độ nghiêm trọng (Blocker, Critical, Minor), và log tái hiện.
