# BÁO CÁO KIỂM THỬ CHẤT LƯỢNG (TEST REPORT)

- **Dự án:** ClaimTrace — Academic Research Provenance & Evidence Audit Platform
- **Mã kiểm thử:** QA-CYC-2026-0929
- **Người thực hiện:** `qa_test_engineer`
- **Thời gian thực hiện:** 2026-09-29T20:06:00+07:00
- **Môi trường:** Node.js v20+, Vite v8.3.1, TypeScript 6.0.2, React 19.2.8
- **Kết quả tổng quát:** **PASSED (10/10 MODULES ACCEPTED)**

---

## 1. Kết Quả Static Analysis & Production Build

| Công cụ / Lệnh | Mục tiêu | Kết quả | Ghi chú |
| :--- | :--- | :--- | :--- |
| `npx tsc -b` | Kiểm tra Strict TypeScript (noUnusedLocals, verbatimModuleSyntax) | **PASSED (0 errors)** | Không phát hiện lỗi type hoặc biến thừa |
| `npm run lint` (`oxlint`) | Phân tích cú pháp & quy chuẩn React Compiler / Hook | **PASSED (0 errors, 0 warnings)** | 32 files phân tích, 116 rules kiểm tra |
| `npm run build` | Bundling & Minification production assets | **PASSED (0 errors)** | Hoàn tất trong 7.17s (`dist/assets/index-DMK7ptRk.js`, CSS, HTML) |

---

## 2. Ma Trận Đánh Giá Tiêu Chí Chấp Nhận (Acceptance Criteria Evaluation)

### AC-01: Admin User Management Table (UI-01)
- **Kịch bản kiểm thử:**
  1. Truy cập route `/admin/users` qua thanh điều hướng Admin Portal trên Header.
  2. Tìm kiếm theo từ khóa "Alice", lọc theo vai trò `PRINCIPAL_INVESTIGATOR` và trạng thái `ACTIVE`.
  3. Mở modal `[+ Add User]`, nhập thông tin và xác nhận thêm mới vào mock state.
  4. Đổi trạng thái người dùng giữa `ACTIVE` và `SUSPENDED`.
- **Kết quả quan sát:** Bảng hiển thị đầy đủ avatar, ORCID ID, vai trò badge, phòng lab, modal phản hồi mượt mà, cập nhật ngay lập tức.
- **Trạng thái:** **PASSED**

### AC-02: AI Quotas & Project Provisioning (UI-02)
- **Kịch bản kiểm thử:**
  1. Truy cập route `/admin/quotas`.
  2. Quan sát 3 thanh tiến độ: Token Limit (4.2M/10M), Budget ($128/$500), Monthly Storage (14.2GB/50GB).
  3. Bật/tắt trạng thái cấp phép model giữa `APPROVED` và `SUSPENDED`.
  4. Mở modal `[+ Provision New Workspace]`, điền thông tin dự án và xác nhận thêm vào `useProvenanceStore`.
- **Kết quả quan sát:** Giao diện phản ánh trực quan ngân sách và hạn mức quota; lưu cấu hình thành công với feedback toast; workspace mới được lưu vào store.
- **Trạng thái:** **PASSED**

### AC-03: Datasets & Code Revisions Registry (UI-03)
- **Kịch bản kiểm thử:**
  1. Truy cập tab `Evidence & Artifacts` (`/workspace/:id/evidence`).
  2. Lọc danh sách theo loại: `DATASET`, `CODE`, `EXECUTION_RUN`, `FIGURE`.
  3. Copy SHA-256 fingerprint và kiểm tra nút clipboard feedback.
  4. Mở modal đăng ký file dataset qua SHA-256 hash và kiểm tra nút Connect Git Webhook.
- **Kết quả quan sát:** Toàn bộ artifact hiển thị hash rút gọn với nút copy 1-click; banner cảnh báo hiển thị khi upstream dataset bị lệch; webhook mô phỏng phản hồi trực quan.
- **Trạng thái:** **PASSED**

### AC-04: AI Suggestion Triage & Offline Sync Status (UI-04)
- **Kịch bản kiểm thử:**
  1. Truy cập tab `AI Triage` (`/workspace/:id/triage`).
  2. Chọn gợi ý AI từ danh sách (ví dụ: `sug-001`, `sug-002`).
  3. So sánh Side-by-Side Diff giữa Prompt / Generated Text và Manuscript Context.
  4. Thực hiện các thao tác: `[Accept as Claim]`, `[Modify & Accept]` (mở textarea hiệu chỉnh), `[Reject / Flag Hallucination]`.
  5. Kiểm tra badge đồng bộ IndexedDB (3 items pending / Synced).
- **Kết quả quan sát:** Trạng thái triage cập nhật tức thì; text chỉnh sửa lưu chính xác vào danh sách; diff hiển thị nền xanh/đỏ chuẩn academic minimalism.
- **Trạng thái:** **PASSED**

### AC-05: Manuscript Viewer & Text Span Anchoring (UI-05)
- **Kịch bản kiểm thử:**
  1. Truy cập tab `Manuscript` (`/workspace/:id/sources`).
  2. Bôi đen 1 đoạn văn bản nghiên cứu có độ dài > 5 ký tự.
  3. Quan sát floating popover button `[📌 Anchor as Scientific Claim]`.
  4. Click button và kiểm tra modal liên kết W3C Selector (prefix, exact, suffix).
- **Kết quả quan sát:** Tọa độ W3C TextQuoteSelector được tính toán chính xác; button xuất hiện đúng vị trí chuột bôi đen; click mở modal liên kết chứng cứ.
- **Trạng thái:** **PASSED**

### AC-06: Subgraph & Split Diff View (UI-06)
- **Kịch bản kiểm thử:**
  1. Truy cập tab `Diff & Anchors` (`/workspace/:id/diff`).
  2. Quan sát Split Diff View so sánh bản thảo `v1.0-draft` và `v2.0-revised`.
  3. Xem panel Unmatched Anchors (neo bị đứt gãy do sửa câu chữ).
  4. Click `[Re-align to Closest Fuzzy Match]` và kiểm tra thông báo liên kết lại neo W3C.
- **Kết quả quan sát:** Highlight từ ngữ thêm/bớt màu đỏ/xanh lá nhẹ nhàng; neo đứt gãy được phát hiện và hỗ trợ tái neo thành công.
- **Trạng thái:** **PASSED**

### AC-07: Bitemporal Lineage Graph Explorer (UI-07)
- **Kịch bản kiểm thử:**
  1. Truy cập tab `Lineage Trees` (`/workspace/:id/lineage-trees`).
  2. Bật toggle chuyển đổi giữa `[Manuscript Snapshot (t_sub)]` và `[Current State (t_now)]`.
  3. Click vào 1 Node trong cây phân nhánh DAG để mở Drawer chi tiết.
  4. Kiểm tra các trường Bitemporal (`valid_at`, `transaction_at`) và danh sách Downstream Blast Radius.
- **Kết quả quan sát:** Góc nhìn Snapshot đóng băng dữ liệu tại thời điểm nộp bài; góc nhìn Current State hiển thị biến động live; Node Inspector hiển thị đầy đủ tọa độ 2 chiều thời gian và bán kính ảnh hưởng.
- **Trạng thái:** **PASSED**

### AC-08: Claim Health Status Table & Invalidation Toast (UI-08)
- **Kịch bản kiểm thử:**
  1. Chuyển sang chế độ xem `[Claim Health Matrix]` trên thanh công cụ của màn hình Lineage Trees.
  2. Quan sát bảng tổng quan toàn bộ Claim với các cột: Claim ID, Trích đoạn, Trạng thái (`VERIFIED`, `STALE`), Upstream Nodes, Ngày kiểm tra.
  3. Nhấn nút "⚡ Simulate Upstream Data Change (v1 -> v2)" trên Header.
  4. Quan sát Toast thông báo nổi bật góc trên bên phải: *"Provenance Disruption Detected: Root dataset cohort_clinical_raw.csv mutated. 1 Claim marked as STALE (Downstream Blast Radius: 2 claims, 1 figure)."* kèm nút `[View Affected Claims]`.
- **Kết quả quan sát:** Bảng phản ánh đúng trạng thái STALE; Toast xuất hiện mượt mà và cho phép điều hướng ngay đến claim bị ảnh hưởng.
- **Trạng thái:** **PASSED**

### AC-09: Redacted Audit Lineage View (UI-09)
- **Kịch bản kiểm thử:**
  1. Truy cập tab `Audit View` (`/workspace/:id/audit`).
  2. Bật/tắt công tắc `[Redact Patient/Sensitive Identifiers]` (HIPAA / GDPR).
  3. Kiểm tra xem các trường nhạy cảm như Tên bệnh nhân, Mã bệnh án, Token API có bị thay thế bằng khối đen `[REDACTED_PID_...]` và hash SHA-256 an toàn hay không.
  4. Đọc danh sách Auditor Observations với các phân loại: Pass, Flag, Critical Mismatch.
- **Kết quả quan sát:** Che giấu dữ liệu nhạy cảm hoạt động hoàn hảo; các thẻ ghi chú kiểm toán rõ ràng, hỗ trợ xuất biên bản.
- **Trạng thái:** **PASSED**

### AC-10: CRediT Contributor Dashboard & RO-Crate Exporter (UI-10)
- **Kịch bản kiểm thử:**
  1. Truy cập tab `CRediT Matrix` (`/workspace/:id/credit`).
  2. Quan sát ma trận 14 vai trò CRediT (Conceptualization, Methodology, Software, Formal analysis, Data curation,...).
  3. Toggle vai trò của tác giả trong ma trận.
  4. Nhấn nút `[Simulate RO-Crate Package Generation]` và theo dõi thanh tiến trình 4 giai đoạn.
  5. Xem trước bản JSON-LD của `ro-crate-metadata.json`.
- **Kết quả quan sát:** Ma trận CRediT tương tác mượt mà; quy trình xuất gói RO-Crate 1.1 mô phỏng đầy đủ với tiến trình trực quan và mã JSON-LD chuẩn đặc tả W3C.
- **Trạng thái:** **PASSED**

---

## 3. Kết Luận Bàn Giao
Hệ thống giao diện ClaimTrace đã đáp ứng 100% các tiêu chí kỹ thuật và giao diện theo `REQUIREMENTS.md`. Không có bất kỳ lỗi biên dịch nào (`tsc -b`), không có cảnh báo linter (`oxlint`), và bản build production sẵn sàng triển khai.
