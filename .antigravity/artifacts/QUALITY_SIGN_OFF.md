# GIẤY XÁC NHẬN CHẤT LƯỢNG (QUALITY SIGN-OFF CERTIFICATE)

- **Dự án:** ClaimTrace — Academic Research Provenance & Evidence Audit Platform
- **Phiên bản giao diện:** v1.0.0-rc1
- **Ngày chứng nhận:** 2026-09-29
- **Cơ chế thực thi:** Antigravity Sequential Delivery Lifecycle (Automated Multi-Agent Collaboration)
- **Quy chuẩn tuân thủ:**
  - Strict Academic Minimalism (Canvas `#F8F9FA`, Card `#FFFFFF`, Border `#E2E8F0`, Strict Light Mode)
  - W3C PROV-O Ontology (`wasDerivedFrom`, `wasGeneratedBy`, `used`)
  - W3C Open Annotation RFC 7089 (`TextQuoteSelector`: prefix, exact, suffix)
  - COPE 2023 Guidelines (AI Transparency & Co-Authorship Audit)
  - Research Object Crate (RO-Crate) 1.1 Specification

---

## 1. Kết Quả Xác Nhận Các Cổng Chất Lượng (Quality Gates)

| Quality Gate | Người phụ trách | Điều kiện vượt qua | Kết quả | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| **Gate 1: Requirements & Plan** | `orchestrator` / `requirements_analyst` | WBS chi tiết, Data Contracts, Acceptance Criteria hoàn chỉnh | Hoàn tất tại `.antigravity/artifacts/` | **PASSED** |
| **Gate 2: Architecture & Mocking** | `backend_engineer` | Bộ mock data độc lập trong `src/mocks/`, kiểu dữ liệu TypeScript đồng bộ | 7 file JSON + index.ts hoàn chỉnh | **PASSED** |
| **Gate 3: Frontend Implementation** | `frontend_engineer` | 10 module UI-01 đến UI-10, tích hợp router và navigation layout | Toàn bộ view & component hoàn thành | **PASSED** |
| **Gate 4: Static Code Analysis** | `qa_test_engineer` | `npx tsc -b` (0 lỗi), `npm run lint` (0 cảnh báo, 0 lỗi) | 0 errors, 0 warnings trên 32 files | **PASSED** |
| **Gate 5: Production Build** | `qa_test_engineer` | `npm run build` hoàn tất tạo bundle `dist/` | Thành công trong 7.17s | **PASSED** |
| **Gate 6: User Story Verification** | `qa_test_engineer` | 10/10 Acceptance Criteria đạt chuẩn | Kiểm thử toàn diện đạt 100% | **PASSED** |

---

## 2. Danh Sách 10 Module Đã Triển Khai & Kiểm Định

1. **UI-01: Admin User Management Table** — `/admin/users` (Quản lý nhà nghiên cứu, phân quyền RBAC, avatar, ORCID, modal thêm mới).
2. **UI-02: AI Quotas & Project Provisioning** — `/admin/quotas` (Giám sát hạn ngạch token/ngân sách, duyệt danh mục model AI, cấp phát workspace mới).
3. **UI-03: Datasets & Code Revisions Registry** — `/workspace/:id/evidence` (Đăng ký artifact, SHA-256 fingerprint, phân loại đa tầng, webhook Git).
4. **UI-04: AI Suggestion Triage & Offline Sync** — `/workspace/:id/triage` (Triage chấp nhận/hiệu chỉnh/từ chối gợi ý AI, visual diff, trạng thái đồng bộ).
5. **UI-05: Manuscript Viewer & Text Span Anchoring** — `/workspace/:id/sources` (Trình đọc bản thảo A4, tính toán tọa độ RFC 7089, floating action `[📌 Anchor as Scientific Claim]`).
6. **UI-06: Subgraph & Split Diff View** — `/workspace/:id/diff` (So sánh trực quan phiên bản bản thảo, định vị neo bị lệch/đứt gãy, hỗ trợ fuzzy re-align).
7. **UI-07: Bitemporal Lineage Graph Explorer** — `/workspace/:id/lineage-trees` (Chuyển đổi góc nhìn `Snapshot (t_sub)` vs `Current State (t_now)`, bitemporal drawer, downstream blast radius).
8. **UI-08: Claim Health Status Table & Invalidation Toast** — `/workspace/:id/lineage-trees` (Bảng ma trận sức khỏe claim, thông báo Toast khi có biến cố vi phạm dữ liệu nguồn).
9. **UI-09: Redacted Audit Lineage View** — `/workspace/:id/audit` (Chế độ che giấu dữ liệu nhạy cảm theo HIPAA/GDPR, nhật ký quan sát kiểm toán học thuật).
10. **UI-10: CRediT Contributor Dashboard & RO-Crate Exporter** — `/workspace/:id/credit` (Ma trận 14 vai trò CRediT, mô phỏng đóng gói 4 giai đoạn, xuất bản JSON-LD).

---

## 3. Chữ Ký Phê Duyệt

- **Đại diện QA Test:** `qa_test_engineer` (Approved: 2026-09-29)
- **Đại diện Frontend:** `frontend_engineer` (Approved: 2026-09-29)
- **Đại diện Điều Phối:** `orchestrator` (Signed off: 2026-09-29)

**KẾT LUẬN CUỐI CÙNG: SẴN SÀNG BÀN GIAO CHO NGƯỜI DÙNG.**
