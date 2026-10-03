# ACCEPTANCE CRITERIA MATRIX (AC)

- **System**: ClaimTrace (Academic Research Provenance & Evidence Audit Platform)
- **Author**: `requirements_analyst`
- **Reference**: `REQUIREMENTS.md`

---

## AC-01: Admin User Management (UI-01)
- **Scenario 1.1: Hiển thị danh sách người dùng**
  - **Given** người dùng đăng nhập với quyền Admin,
  - **When** truy cập vào màn hình Quản lý người dùng,
  - **Then** bảng hiển thị danh sách người dùng gồm: Avatar, Họ tên, Email, Vai trò (Badge màu riêng), Trạng thái, Ngày tham gia; có đủ 3 trạng thái: Loading, Populated, Empty state khi không có kết quả tìm kiếm.
- **Scenario 1.2: Thêm người dùng mới**
  - **Given** modal Thêm người dùng đang mở,
  - **When** nhập Họ tên, Email, chọn Role và bấm Submit,
  - **Then** người dùng mới xuất hiện trên bảng với trạng thái Active và Role đã chọn.

## AC-02: Cấu hình AI Quotas & Dự án (UI-02)
- **Scenario 2.1: Hiển thị hạn mức AI của dự án**
  - **Given** đang xem màn hình AI Quotas,
  - **Then** hiển thị phần trăm token đã dùng (Used Tokens vs Token Limit), chi phí ước tính (USD), và danh sách model được phê duyệt (Approved / Suspended).
- **Scenario 2.2: Tạo dự án mới**
  - **Given** mở modal tạo dự án nghiên cứu,
  - **When** điền Tên dự án, Lead PI, Repo URL, Data store URI và bấm Tạo,
  - **Then** dự án mới xuất hiện trong workspace selector và chuyển hướng sang không gian làm việc.

## AC-03: Datasets & Code Revisions (UI-03)
- **Scenario 3.1: Duyệt snapshot dữ liệu & code**
  - **Given** đang ở màn hình Evidence Artifacts,
  - **When** chọn bộ lọc Category (DATASET / CODE / FIGURE / EXECUTION_RUN),
  - **Then** bảng chỉ lọc ra các entity thuộc category đó kèm mã băm SHA-256 đầy đủ và trạng thái Lineage (Synchronized / Mismatch).
- **Scenario 3.2: Copy SHA-256 Hash**
  - **When** bấm nút Copy hash bên cạnh chuỗi SHA-256,
  - **Then** hệ thống sao chép hash vào clipboard và icon chuyển thành dấu tích xanh "Copied" trong 1.8 giây.

## AC-04: AI Suggestion Triage & Sync (UI-04)
- **Scenario 4.1: Kiểm duyệt gợi ý AI**
  - **Given** một đề xuất AI đang ở trạng thái `PENDING`,
  - **When** người dùng bấm `Accept`,
  - **Then** trạng thái chuyển sang `ACCEPTED`, diff được ghi nhận và badge COPE Audit chuyển sang Verfied.
- **Scenario 4.2: Tinh chỉnh gợi ý (Modify)**
  - **When** người dùng bấm `Modify`,
  - **Then** mở form chỉnh sửa nội dung đề xuất của AI trước khi xác nhận.
- **Scenario 4.3: Hiển thị trạng thái đồng bộ**
  - **Then** trên thanh điều hướng hiển thị badge `Reconciled Sync` (xanh lá) hoặc `Offline Buffering` (vàng cam).

## AC-05: Manuscript Viewer & Text Span Anchoring (UI-05)
- **Scenario 5.1: Bôi đen text span để tạo Claim**
  - **Given** người dùng đang đọc văn bản bản thảo ở màn hình Manuscript,
  - **When** dùng chuột bôi đen một câu trích dẫn khoa học,
  - **Then** một popover menu nổi xuất hiện `[📌 Anchor as Scientific Claim]`.
- **Scenario 5.2: Tạo Claim Node W3C Web Annotation**
  - **When** bấm vào nút trên popover,
  - **Then** mở modal gán Claim với `exactQuote`, `prefix`, `suffix` được tự động điền sẵn.

## AC-06: Evidence Subgraph Panel & Diff View (UI-06)
- **Scenario 6.1: So sánh phiên bản bản thảo (Diff View)**
  - **Given** người dùng chọn so sánh giữa bản v1.0 và v2.0,
  - **Then** giao diện hiển thị 2 cột song song với các đoạn văn bản được highlight màu xanh (thêm mới) và đỏ (xóa).
- **Scenario 6.2: Cảnh báo Unmatched Anchors**
  - **Then** sidebar hiển thị danh sách các Claim bị mất neo do bản v2.0 đã sửa câu chữ, kèm nút `[🔄 Auto-Re-align]`.

## AC-07: Bitemporal Lineage Graph (UI-07)
- **Scenario 7.1: Chuyển đổi chiều thời gian (Bitemporal Toggle)**
  - **Given** người dùng đang xem cây đồ thị truy nguyên,
  - **When** chuyển slider/toggle sang `Manuscript Snapshot Time`,
  - **Then** đồ thị hiển thị trạng thái ban đầu của bài báo (Healthy, không đứt gãy).
  - **When** chuyển sang `Current System State`,
  - **Then** đồ thị hiển thị các nút bị ảnh hưởng bởi thay đổi dữ liệu nguồn (màu vàng/đỏ đứt đoạn).

## AC-08: Claim Health Status Table (UI-08)
- **Scenario 8.1: Bảng tổng kết trạng thái sức khỏe**
  - **Then** bảng liệt kê toàn bộ claim với 3 huy hiệu màu chuẩn: 🟢 Supported, 🟡 Stale, 🔴 Broken.
- **Scenario 8.2: Toast cảnh báo Invalidation**
  - **When** dữ liệu nguồn bị thay đổi,
  - **Then** một toast notification màu đỏ xuất hiện ở góc màn hình cảnh báo các Claim bị rơi vào trạng thái STALE.

## AC-09: Redacted Audit Lineage View (UI-09)
- **Scenario 9.1: Bật chế độ che mờ nhạy cảm (Sensitive Redaction)**
  - **When** người dùng bật công tắc `[Sensitive Redaction: ON]`,
  - **Then** các đoạn text Prompt chi tiết, dữ liệu bệnh nhân/thương mại bị che thành thanh đen `[REDACTED]`, nhưng các mã băm SHA-256 và đường kết nối phả hệ vẫn được giữ nguyên vẹn.
- **Scenario 9.2: Ghi nhận Audit Observation**
  - **When** Auditor nhập nhận xét kiểm toán và mức độ (Compliant / Minor Concern / Major Discrepancy),
  - **Then** ghi chú được lưu và gắn trực tiếp vào Claim Node tương ứng.

## AC-10: CRediT Dashboard & RO-Crate Export (UI-10)
- **Scenario 10.1: Hiển thị ma trận 14 vai trò CRediT**
  - **Then** ma trận hiển thị danh sách tất cả tác giả và AI assistant, tương ứng với 14 cột vai trò CRediT (Conceptualization, Methodology, Software, Data Curation, v.v.).
- **Scenario 10.2: Xuất gói RO-Crate 1.1**
  - **When** người dùng bấm nút `Export RO-Crate 1.1 Package`,
  - **Then** hiển thị modal mô phỏng 4 bước đóng gói và cung cấp nút tải file `ro-crate-metadata.json`.
