# DETAILED REQUIREMENTS SPECIFICATION (PRD-UI)

- **System**: ClaimTrace (Academic Research Provenance & Evidence Audit Platform)
- **Author**: `requirements_analyst`
- **Reference**: `REQUIREMENTS.md`

---

## 1. Màn hình 1: Quản trị & Không gian làm việc (Admin & Workspace UI)

### UI-01: Quản lý tài khoản & Phân quyền tổ chức (Admin User Management Table)
- **User Story**: Là Administrator, tôi muốn xem danh sách toàn bộ người dùng trong tổ chức, tìm kiếm theo tên/email, lọc theo vai trò (Admin, Researcher, PI, Reviewer), đổi trạng thái hoạt động (Active/Inactive), và mở modal để thêm người dùng mới cùng phân quyền vai trò.
- **Thành phần UI**:
  - Search input, role filter dropdown, status filter.
  - Bảng người dùng: Avatar, Họ tên, Email, Vai trò (Badge màu riêng: Admin = Đỏ, PI = Tím, Researcher = Xanh lam, Reviewer = Xanh lục), Trạng thái (Active/Inactive toggle hoặc badge), Ngày tham gia, Nút hành động (Edit role, Toggle status).
  - Modal tạo mới tài khoản: Tên, Email, Chọn vai trò, Tổ chức/Viện nghiên cứu, ORCID iD.
  - 3 trạng thái: Loading skeleton, Populated data, Empty state.

### UI-02: Cấu hình hạn mức AI & Dự án nghiên cứu (AI Quotas & Project Provisioning)
- **User Story**: Là Administrator hoặc PI, tôi muốn cấu hình hạn mức token/chi phí AI theo từng dự án, kích hoạt/vô hiệu hóa các model được phê duyệt (GPT-4o, Claude 3.5 Sonnet, Gemini 2.5 Pro, Llama 3), nhập endpoint API an toàn, và mở modal khởi tạo dự án nghiên cứu mới (Tiêu đề, phạm vi, mời cộng tác viên, liên kết Git repo / Data store).
- **Thành phần UI**:
  - Thẻ thông số hạn mức AI: Tổng quota cấp phát (Token limit / Monthly spend limit), Phần trăm đã sử dụng, Số request đã thực hiện.
  - Bảng danh sách Model được phê duyệt: Provider (OpenAI, Anthropic, Google Vertex AI, Local Ollama), Model ID, Trạng thái (Approved / Suspended), Max token context.
  - Form tạo dự án nghiên cứu: Project Name, Lead PI, Description, Institution, Repository URL, Storage S3/GCS bucket URI.

---

## 2. Màn hình 2: Bảng ghi nhận Artefact & Tương tác AI (Artefact & AI Capture UI)

### UI-03: Danh sách phiên bản tập dữ liệu & mã nguồn (Datasets & Code Revisions)
- **User Story**: Là Researcher hoặc Auditor, tôi muốn duyệt các snapshot dữ liệu và revision code, xem mã băm SHA-256 bất biến, kích thước, số dòng/cột, commit message và ngày đăng ký.
- **Thành phần UI**:
  - Bộ lọc loại: ALL, DATASET, CODE, EXECUTION_RUN, FIGURE.
  - Bảng hiển thị: Icon loại, Tên file, Version/Commit, SHA-256 hash (với nút Copy hash), Trạng thái lineage (SYNCHRONIZED / MISMATCH), Kích thước/thông số, Ngày đăng ký.
  - Nút Copy hash phản hồi trực quan (Copied!).

### UI-04: Bảng duyệt gợi ý AI & Đồng bộ ngoại tuyến (AI Suggestion Triage & Sync Status)
- **User Story**: Là Researcher, tôi muốn xem các đề xuất sinh mã hoặc sửa đổi văn bản do AI tạo ra, đối chiếu nội dung Prompt gửi đi, Model version, diff so sánh trước/sau, và thực hiện một trong 3 hành động: **Accept** (Chấp thuận), **Modify** (Chỉnh sửa trước khi nhận), hoặc **Reject** (Từ chối). Tôi cũng muốn thấy trạng thái đồng bộ (Offline Buffering vs. Reconciled Sync).
- **Thành phần UI**:
  - Badge trạng thái đồng bộ: `Offline Buffering (3 pending)` hoặc `Reconciled Sync (All logged to COPE Ledger)`.
  - Hộp kiểm duyệt Triage:
    - Cột trái: User Prompt & Model parameters (temperature, model version).
    - Cột phải: Visual Diff so sánh (Mã/Văn bản gốc vs. Đề xuất của AI).
    - Thanh nút bấm:
      - 🟢 **Accept** (Ghi nhận vào bản thảo & lưu vào sổ cái COPE)
      - 🟡 **Modify** (Mở editor inline để tác giả tinh chỉnh)
      - 🔴 **Reject** (Hủy bỏ đề xuất, yêu cầu lý do từ chối)
    - Modal/Inline editor khi chọn Modify.

---

## 3. Màn hình 3: Không gian ghim luận điểm trên bản thảo (Manuscript & Claim Binding UI)

### UI-05: Trình đọc & Ghim đoạn văn bản (Manuscript Viewer & Text Span Anchoring)
- **User Story**: Là Researcher, tôi muốn đọc văn bản bài báo (định dạng Markdown học thuật với tiêu đề, công thức, bảng biểu), bôi đen bất kỳ cụm từ hoặc câu nào để hiển thị popover menu cho phép tạo một **Claim Node** mới neo theo chuẩn W3C Web Annotation (exactQuote, prefix, suffix).
- **Thành phần UI**:
  - Khung đọc tài liệu chuẩn Overleaf/Google Docs (Strict Light Mode, typography serif cho nội dung, sans-serif cho điều khiển).
  - Tương tác chọn văn bản: Khi bôi đen đoạn text, một popover nổi xuất hiện ngay trên con trỏ chuột với nút `[📌 Anchor as Scientific Claim]`.
  - Modal tạo Claim: Nhập tiêu đề claim, chọn phân hệ, chỉ định metric mục tiêu, và liên kết bằng chứng ban đầu.

### UI-06: Bảng liên kết bằng chứng & So sánh phiên bản (Evidence Subgraph Panel & Diff View)
- **User Story**: Là Researcher hoặc Reviewer, tôi muốn so sánh hai phiên bản bản thảo (ví dụ: v1.0 Submssion vs v2.0 Revision), xem các điểm khác biệt (Split Diff View), tự động phát hiện các Claim bị lệch neo (Unmatched Anchors do văn bản bị sửa đổi), và bấm nút Re-align để tự động căn chỉnh lại vị trí neo.
- **Thành phần UI**:
  - Split Diff View (v1.0 bên trái vs v2.0 bên phải) với highlight xanh lá (thêm mới) và đỏ (xóa bỏ).
  - Panel cảnh báo Unmatched Anchors: Liệt kê các claim bị mất neo hoặc lệch offset.
  - Nút bấm `[🔄 Auto-Re-align Anchors]` với thuật toán so khớp gần đúng (Fuzzy substring matching).

---

## 4. Màn hình 4: Đồ thị truy nguyên & Trạng thái Luận điểm (Provenance Graph & Staleness UI)

### UI-07: Đồ thị trực quan đa chiều (Bitemporal Lineage Graph Explorer)
- **User Story**: Là Reviewer hoặc Auditor, tôi muốn duyệt đồ thị truy nguyên DAG phả hệ từ `Dataset` $\rightarrow$ `Code` $\rightarrow$ `Run` $\rightarrow$ `Claim`, và sử dụng thanh trượt thời gian (Timeline Slider / Toggle) để chuyển đổi giữa hai chiều thời gian:
  1. *Manuscript Snapshot Time* (Thời điểm bài báo được công bố - tất cả liên kết còn nguyên bản).
  2. *Current System State* (Thời điểm hiện tại - hiển thị các liên kết bị đứt gãy nếu dữ liệu nguồn đã bị biến động).
- **Thành phần UI**:
  - Thanh trượt thời gian bitemporal (Timeline Slider / Switch): `[📅 Manuscript Snapshot (2025-05-18)]` $\leftrightarrow$ `[⚡ Current System State (Live)]`.
  - Không gian đồ thị node-link phân cấp: Các node Claim, Figure, Execution Run, Code, Dataset với badge quan hệ W3C PROV-O (`wasDerivedFrom`, `wasGeneratedBy`, `used`, `wasInformedBy`).
  - Đường nối đồ thị đổi màu: Xanh lá khi healthy, Vàng đứt đoạn khi stale, Đỏ khi broken.

### UI-08: Bảng theo dõi sức khỏe luận điểm (Claim Health Status Table)
- **User Story**: Là PI hoặc Auditor, tôi muốn xem bảng tổng hợp toàn bộ các Claim trong dự án với huy hiệu trạng thái:
  - 🟢 **Supported** (Bằng chứng hợp lệ)
  - 🟡 **Stale** (Dữ liệu nguồn thượng nguồn thay đổi / Cần chạy lại)
  - 🔴 **Broken** (Mất liên kết băm hoặc mã nguồn bị lỗi)
  Kèm theo hệ thống Toast cảnh báo tự động bật lên khi phát hiện claim bị biến động.
- **Thành phần UI**:
  - Bảng thống kê sức khỏe: Mã Claim, Trích dẫn, Vị trí section, Target Metric, Trạng thái (Supported / Stale / Broken), Lý do vi phạm, Nút Re-verify.
  - Toast notification popup ở góc dưới màn hình khi chuyển đổi trạng thái invalidation.

---

## 5. Màn hình 5: Báo cáo, Đóng gói & Audit (Audit & Reporting UI)

### UI-09: Chế độ xem Audit kiểm duyệt (Redacted Audit Lineage View)
- **User Story**: Là External Auditor / Reviewer, tôi muốn xem chuỗi truy nguyên nhưng có tùy chọn **Sensitive Redaction Toggle** để tự động làm mờ (blur / black-out) các đoạn prompt hoặc dữ liệu bệnh nhân/thương mại nhạy cảm, trong khi vẫn bảo toàn 100% metadata cấu trúc, hàm băm SHA-256 và quan hệ DAG. Tôi cũng muốn ghi chú Audit Observations trực tiếp trên từng claim.
- **Thành phần UI**:
  - Nút gạt `[👁️ Sensitive Redaction Filter: ON / OFF]`. Khi ON, nội dung prompt và dữ liệu nhạy cảm được che bằng thanh màu đen hoặc làm mờ `[REDACTED FOR PEER REVIEW]`, nhưng hash SHA-256 vẫn giữ nguyên.
  - Khung nhập nhận xét kiểm toán (Audit Observations Drawer): Cho phép reviewer để lại đánh giá (Compliant, Minor Concern, Major Discrepancy) kèm nhận xét.

### UI-10: Dashboard phân bổ CRediT & Xuất gói RO-Crate
- **User Story**: Là PI hoặc Tác giả, tôi muốn xem bảng phân bổ vai trò tác giả theo chuẩn 14 vai trò **CRediT Taxonomy** (Conceptualization, Methodology, Software, Investigation, Data Curation, v.v.), báo cáo minh bạch AI theo chuẩn COPE 2023, và bấm nút xuất gói dữ liệu nghiên cứu chuẩn RO-Crate 1.1 / PROV-JSON với tiến trình tải xuống mô phỏng.
- **Thành phần UI**:
  - Ma trận CRediT (Bảng nhiệt - Heatmap / Tag matrix): Hàng là tác giả (kể cả AI Assistant), Cột là 14 vai trò CRediT.
  - Nút bấm `[📦 Export RO-Crate 1.1 Package]` và `[📄 Export W3C PROV-JSON]`.
  - Modal tiến trình đóng gói: Hiển thị các bước (1. Hashing artifacts -> 2. Compiling JSON-LD context -> 3. Packing zip package -> 4. Ready to download).
