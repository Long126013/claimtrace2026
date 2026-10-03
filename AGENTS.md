# Antigravity Multi-Agent Workspace Rules: ClaimTrace

Hệ thống Agent cộng tác cho dự án **ClaimTrace** (Academic Research Provenance & Evidence Audit Platform). Toàn bộ cấu hình chi tiết, hợp đồng dữ liệu và quy trình tuần tự được lưu trữ tại thư mục [`.antigravity/`](file:///d:/Capstone/.antigravity/README.md).

---

## 1. Thứ Tự Điều Phối & Vai Trò Các Agent

Mọi tác vụ phát triển tính năng hoặc sửa lỗi cần tuân thủ chu trình tuần tự gồm 5 vai trò chuyên biệt:

1. **`orchestrator` (Điều Phối)**:
   - *Tài liệu định nghĩa*: [`.antigravity/agents/01_orchestrator.md`](file:///d:/Capstone/.antigravity/agents/01_orchestrator.md)
   - *Nhiệm vụ*: Phân tích mục tiêu, lập kế hoạch chi tiết (WBS), điều phối chuyển giao hạ nguồn, giám sát cổng chất lượng (Quality Gates).
2. **`requirements_analyst` (Đọc Requirement)**:
   - *Tài liệu định nghĩa*: [`.antigravity/agents/02_requirements_analyst.md`](file:///d:/Capstone/.antigravity/agents/02_requirements_analyst.md)
   - *Nhiệm vụ*: Nghiên cứu tài liệu bài báo & yêu cầu người dùng, bóc tách User Stories, thiết kế Data Contracts (`DATA_CONTRACTS.ts`), thiết lập Acceptance Criteria.
3. **`frontend_engineer` (Code FE)**:
   - *Tài liệu định nghĩa*: [`.antigravity/agents/03_frontend_engineer.md`](file:///d:/Capstone/.antigravity/agents/03_frontend_engineer.md)
   - *Nhiệm vụ*: Xây dựng giao diện React 19 / TypeScript / Tailwind CSS / Zustand theo phong cách **Academic Minimalism**, đảm bảo phản hồi tức thì và không có lỗi Type.
4. **`backend_engineer` (Code BE)**:
   - *Tài liệu định nghĩa*: [`.antigravity/agents/04_backend_engineer.md`](file:///d:/Capstone/.antigravity/agents/04_backend_engineer.md)
   - *Nhiệm vụ*: Hiện thực hóa API endpoints, thuật toán kiểm tra tính toàn vẹn SHA-256, tuần tự hóa W3C PROV-O, đóng gói RO-Crate 1.1 JSON-LD.
5. **`qa_test_engineer` (Test)**:
   - *Tài liệu định nghĩa*: [`.antigravity/agents/05_qa_test_engineer.md`](file:///d:/Capstone/.antigravity/agents/05_qa_test_engineer.md)
   - *Nhiệm vụ*: Chạy static analysis (`tsc -b`, `oxlint`), thực hiện kiểm thử tự động, xác nhận Acceptance Criteria, cấp chứng chỉ chất lượng hoặc trả bug về cho dev.

---

## 2. Tiêu Chuẩn & Ràng Buộc Kỹ Thuật (Strict Guidelines)

- **Giao diện**:
  - **Strict Light Mode** (Tuyệt đối không dùng dark mode, không neon, không gradient lòe loẹt).
  - Màu chủ đạo: Canvas xám `#F8F9FA`, thẻ trắng `#FFFFFF`, viền mỏng `#E2E8F0`.
  - Phông chữ: `font-serif` cho trích dẫn bài báo; `font-mono` cho SHA-256 hash và diffs; `font-sans` cho UI controls.
- **Mã nguồn**:
  - TypeScript Strict: sử dụng `import type` cho tất cả kiểu dữ liệu (`verbatimModuleSyntax: true`).
  - Không để biến thừa; tiền tố `_` cho tham số không dùng (`noUnusedLocals: true`).
  - Kiểm tra trước khi bàn giao: `npx tsc -b` (0 lỗi), `npm run lint` (0 lỗi).
- **Quy chuẩn nghiệp vụ**:
  - Tuân thủ W3C PROV-O (`wasDerivedFrom`, `wasGeneratedBy`, `used`, `wasInformedBy`).
  - Tuân thủ COPE 2023 (Minh bạch AI co-authorship prompt ledger & người phê duyệt).
  - Tuân thủ RO-Crate 1.1 JSON-LD export.

---

## 3. Chính Sách Thực Thi Tự Động (ALWAYS PROCEED POLICY - FULL PERMISSIONS)

- **Chế độ tự động (Auto-Proceed)**: **BẬT (ALWAYS PROCEED - TỰ ĐỘNG THỰC THI 100%)**.
- **Quyền hạn công cụ (Tool Execution Permissions)**:
  - Cho phép tự động thực thi tất cả lệnh terminal: `npm`, `npx`, `tsc`, `git`, `mvn`, `docker` mà không yêu cầu người dùng xác nhận thủ công từng bước.
  - Cho phép tự động tạo, đọc, ghi và sửa file trong workspace `d:\Capstone` (`write_to_file`, `replace_file_content`).
  - Cho phép tự động triệu hồi và chuyển giao tuần tự giữa các agent: `orchestrator` -> `requirements_analyst` -> `frontend_engineer` -> `backend_engineer` -> `qa_test_engineer`.
- **Cờ phân quyền subagent**:
  - `enable_write_tools`: `true` cho tất cả các agent cần sửa code/file.
  - `enable_subagent_tools`: `true` cho `orchestrator`.
  - `enable_mcp_tools`: `true` cho các tác vụ cần tra cứu docs hoặc công cụ ngoài.

---

## 4. Liên Kết Tài Liệu Hướng Dẫn
- [Tổng quan hệ thống .antigravity/](file:///d:/Capstone/.antigravity/README.md)
- [Cấu hình phân quyền .antigravity/settings.json](file:///d:/Capstone/.antigravity/settings.json)
- [Chu trình tuần tự (Sequential Delivery Lifecycle)](file:///d:/Capstone/.antigravity/workflows/sequential_delivery.md)
- [Giao thức bàn giao (Handoff Protocol)](file:///d:/Capstone/.antigravity/workflows/handoff_protocol.md)
- [Tiêu chuẩn chất lượng (Quality Standards)](file:///d:/Capstone/.antigravity/rules/quality_standards.md)
