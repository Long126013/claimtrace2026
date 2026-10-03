# .antigravity — ClaimTrace Multi-Agent Sequential Development Framework

Hệ thống cấu hình Multi-Agent chuyên biệt cho dự án **ClaimTrace** (Academic Research Provenance & Evidence Audit Platform). Các agent được phân chia vai trò rõ ràng và phối hợp theo chu trình phát triển phần mềm tuần tự (Sequential SDLC).

---

## 1. Cấu Trúc Thư Mục `.antigravity/`

```
.antigravity/
├── agents.json                     # Định nghĩa trung tâm danh mục Agent & cấu hình mô hình
├── pipeline.json                   # Định nghĩa chu trình 5 bước, điều kiện đầu vào/đầu ra (Gates)
├── README.md                       # Tài liệu hướng dẫn tổng quan này
├── agents/                         # Đặc tả chi tiết từng Agent chuyên trách
│   ├── 01_orchestrator.md          # 1. Điều Phối (Master Orchestrator & Coordinator)
│   ├── 02_requirements_analyst.md  # 2. Đọc Requirement (Requirements Analyst & Domain Architect)
│   ├── 03_frontend_engineer.md     # 3. Code FE (Senior Frontend Architect - React & Tailwind)
│   ├── 04_backend_engineer.md      # 4. Code BE (Backend & Systems Architect - API & PROV-O)
│   └── 05_qa_test_engineer.md      # 5. Test (QA Automation & Quality Sign-Off)
├── workflows/                      # Quy trình làm việc và giao thức chuyển giao
│   ├── sequential_delivery.md      # Chu trình phát triển tuần tự 5 bước
│   └── handoff_protocol.md         # Hợp đồng bàn giao dữ liệu giữa các agent
├── rules/                          # Các quy chuẩn chất lượng bắt buộc
│   └── quality_standards.md        # Tiêu chuẩn giao diện, TypeScript và kiểm thử
└── artifacts/                      # Thư mục chứa các tài liệu trung gian do các agent tạo ra
```

---

## 2. Danh Sách Các Agent & Thứ Tự Thực Thi Tuần Tự

| Bước | Agent Identifier | Tên Hiển Thị | Vai Trò Chính | Đầu Ra Tiêu Biểu |
| :--- | :--- | :--- | :--- | :--- |
| **1** | `orchestrator` | **Điều Phối** | Khởi tạo dự án, phân tích phạm vi, lập WBS, điều phối hạ nguồn. | `EXECUTION_PLAN.md` |
| **2** | `requirements_analyst` | **Đọc Requirement** | Đọc hiểu tài liệu, bóc tách User Stories, thiết kế Data Contracts & AC. | `REQUIREMENTS_SPEC.md`, `DATA_CONTRACTS.ts` |
| **3** | `frontend_engineer` | **Code FE** | Dựng giao diện React/Vite/Tailwind theo chuẩn Academic Minimalism. | `src/pages/*`, `src/components/*`, Zustand Store |
| **4** | `backend_engineer` | **Code BE** | Dựng REST API, tính toán SHA-256, W3C PROV-O, RO-Crate 1.1 JSON-LD. | `src/services/*`, API routes, Schemas |
| **5** | `qa_test_engineer` | **Test & QA** | Kiểm tra static types, linter, unit test, đối chiếu Acceptance Criteria. | `TEST_REPORT.md`, `QUALITY_SIGN_OFF.md` |

---

## 3. Cơ Chế Chuyển Giao & Kiểm Soát Cổng (Quality Gates)

Mỗi Agent chỉ được phép bắt đầu công việc khi Agent phía trước đã thỏa mãn đầy đủ **Exit Criteria**:
- **Gate 1 (Orchestrator -> Requirements)**: Kế hoạch WBS rõ ràng, không có mâu thuẫn về mục tiêu.
- **Gate 2 (Requirements -> FE & BE)**: Đầy đủ User Stories, Data Contract TypeScript được khóa, tiêu chuẩn nghiệm thu Gherkin sẵn sàng.
- **Gate 3 (FE & BE -> QA)**: Giao diện và API đã được xây dựng, `tsc` và `lint` sơ bộ không có lỗi cú pháp.
- **Gate 4 (QA -> Production Sign-off)**: Tất cả test cases pass, 0 lỗi TypeScript, 0 lỗi linting, build bundle thành công. Nếu phát hiện bug, QA điều phối gửi trả lại đúng agent sửa lỗi.

---

## 4. Cách Sử Dụng Trong Antigravity

- Khi khởi chạy tác vụ mới, Antigravity sẽ tự động đọc `AGENTS.md` và `.antigravity/` tại thư mục gốc của repository.
- Các subagent có thể được triệu hồi hoặc tự động điều phối thông qua công cụ `invoke_subagent` hoặc qua các chỉ thị phân quyền trong từng prompt.
