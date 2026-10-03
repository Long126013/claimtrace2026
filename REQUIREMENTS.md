# PRODUCT REQUIREMENTS DOCUMENT (PRD) - UI/FRONTEND ONLY

## 0. Bối cảnh & Giới thiệu đề tài (Project Background)
- **Tên hệ thống/Đề tài:** ClaimTrace - Hệ thống quản lý truy nguyên và kiểm chứng tính toàn vẹn của luận điểm khoa học (Scientific Claim Provenance & Traceability System).
- **Bối cảnh bài toán:**
  - Trong nghiên cứu khoa học hiện đại, việc sử dụng các công cụ tính toán và Trí tuệ nhân tạo (Generative AI) ngày càng phổ biến. Điều này kéo theo nguy cơ sai lệch dữ liệu, thiếu minh bạch trong đóng góp học thuật và khó khăn trong việc kiểm chứng nguồn gốc (provenance) của các kết luận (claims).
  - Khi dữ liệu nguồn, tham số hoặc mã nguồn cập nhật, các luận điểm trong bản thảo (manuscript) có thể rơi vào trạng thái lỗi thời (stale) hoặc sai lệch mà tác giả không phát hiện kịp thời.
- **Mục tiêu của hệ thống:**
  - Cung cấp nền tảng ghim (anchor) trực tiếp các luận điểm trên bản thảo bài báo vào dữ liệu, mã nguồn và phiên chạy thực nghiệm tương ứng.
  - Tự động theo dõi và cảnh báo trạng thái sức khỏe của luận điểm (Supported / Stale / Broken) khi tài nguyên thượng nguồn có sự biến động.
  - Minh bạch hóa đóng góp vai trò (CRediT), lịch sử can thiệp của AI (Human-in-the-loop) và hỗ trợ kiểm toán độc lập thông qua việc xuất gói dữ liệu chuẩn RO-Crate/PROV-JSON.
- **Đối tượng người dùng chính (User Personas):**
  - **Principal Investigator (PI):** Chủ nhiệm đề tài, quản lý dự án, kiểm duyệt liên kết và xuất báo cáo.
  - **Researcher / Author:** Nhà nghiên cứu viết bản thảo, gắn thẻ luận điểm và rà soát các tương tác AI.
  - **External Auditor / Reviewer:** Chuyên gia bình duyệt độc lập, kiểm tra cây truy nguyên và đọc log thẩm định.
  - **Administrator:** Quản trị viên hệ thống, quản lý tài khoản và cấu hình hạn mức AI.

---

## 1. Mục tiêu dự án & Phạm vi trọng tâm (UI-First Scope)
- **Mục tiêu giai đoạn:** Xây dựng hoàn chỉnh toàn bộ giao diện người dùng (UI/UX) và các luồng tương tác visual cho hệ thống ClaimTrace.
- **Phạm vi triển khai (Scope Constraints):**
  - **CHỈ TẬP TRUNG XÂY DỰNG GIAO DIỆN (FRONTEND)**.
  - Sử dụng **Mock Data / Static JSON** để hiển thị dữ liệu giả lập cho toàn bộ các màn hình, bảng biểu, đồ thị và form biểu mẫu.
  - **KHÔNG** kết nối cơ sở dữ liệu thật, không viết logic server-side backend, không gọi AI API hay engine ngoài trong giai đoạn này.
  - Toàn bộ mã nguồn giao diện đặt trong thư mục `src/`.

---

## 2. Tech Stack giao diện đề xuất
- **Framework:** React / Next.js hoặc Vite + React (TypeScript/JavaScript).
- **Styling:** Tailwind CSS hoặc CSS Modules.
- **Icon Library:** Lucide-react hoặc Heroicons.
- **Graph Visualization:** React Flow (hoặc SVG/Canvas tương đương) cho sơ đồ đồ thị truy nguyên (Provenance Graph).

---

## 3. Danh sách màn hình & Thành phần UI cần triển khai (Dùng Mock Data)

### Màn hình 1: Quản trị & Không gian làm việc (Admin & Workspace UI)
- **UI-01: Quản lý tài khoản & Phân quyền tổ chức (Admin User Management Table)**
  - Bảng danh sách người dùng: Họ tên, Email, Vai trò (Admin, Researcher, PI, Reviewer), Trạng thái (Active/Inactive).
  - Modal tạo mới tài khoản và phân quyền vai trò.
- **UI-02: Cấu hình hạn mức AI & Dự án nghiên cứu (AI Quotas & Project Provisioning)**
  - Form cấu hình Provider endpoints, model IDs được phê duyệt và quota sử dụng AI theo từng dự án.
  - Form tạo dự án nghiên cứu mới (Tiêu đề, phạm vi, mời thành viên, đăng ký liên kết external repo/data store).

### Màn hình 2: Bảng ghi nhận Artefact & Tương tác AI (Artefact & AI Capture UI)
- **UI-03: Danh sách phiên bản tập dữ liệu & mã nguồn (Datasets & Code Revisions)**
  - Bảng liệt kê snapshot tập dữ liệu và mã nguồn kèm mã băm mật mã học (SHA-256 hash).
- **UI-04: Bảng duyệt gợi ý AI & Đồng bộ ngoại tuyến (AI Suggestion Triage & Sync Status)**
  - Giao diện so sánh: Prompt gửi đi, Model version, đề xuất từ AI, diff so sánh nội dung.
  - 3 nút hành động trực quan kèm phản hồi giao diện: **Accept**, **Modify**, **Reject**.
  - Badge trạng thái đồng bộ: Hiển thị trạng thái Offline Buffering / Reconciled Sync.

### Màn hình 3: Không gian ghim luận điểm trên bản thảo (Manuscript & Claim Binding UI)
- **UI-05: Trình đọc & Ghim đoạn văn bản (Manuscript Viewer & Text Span Anchoring)**
  - Khung đọc văn bản bản thảo (hỗ trợ view Markdown/Text).
  - Tương tác bôi đen đoạn văn bản và hiển thị popover menu để tạo **Claim Node** (theo chuẩn W3C Web Annotation).
- **UI-06: Bảng liên kết bằng chứng & So sánh phiên bản (Evidence Subgraph Panel & Diff View)**
  - Sidebar bên phải hiển thị danh sách các entity hỗ trợ đang liên kết (dataset snapshot, commit, execution run, figure).
  - Giao diện so sánh 2 phiên bản bản thảo (Diff View), làm nổi bật các Claim bị lệch vị trí neo (Unmatched Anchors) kèm nút bấm căn chỉnh lại (Re-align).

### Màn hình 4: Đồ thị truy nguyên & Trạng thái Luận điểm (Provenance Graph & Staleness UI)
- **UI-07: Đồ thị trực quan đa chiều (Bitemporal Lineage Graph Explorer)**
  - Không gian đồ thị node-link trực quan thể hiện quan hệ phả hệ: `Dataset` $\rightarrow$ `Code` $\rightarrow$ `Run` $\rightarrow$ `Claim`.
  - Thanh trượt thời gian (Timeline slider / Toggle) cho phép chuyển đổi chế độ xem giữa "Thời điểm viết bản thảo" và "Trạng thái hệ thống hiện tại".
- **UI-08: Bảng theo dõi sức khỏe luận điểm (Claim Health Status Table)**
  - Danh sách claim hiển thị huy hiệu trạng thái màu sắc rõ ràng:
    - 🟢 **Supported** (Bằng chứng hợp lệ)
    - 🟡 **Stale** (Dữ liệu nguồn thượng nguồn bị thay đổi/Cần cập nhật)
    - 🔴 **Broken** (Mất liên kết băm/Lỗi logic)
  - Khung thông báo/Toast cảnh báo khi phát hiện claim chuyển sang trạng thái Stale hoặc Broken.

### Màn hình 5: Báo cáo, Đóng gói & Audit (Audit & Reporting UI)
- **UI-09: Chế độ xem Audit kiểm duyệt (Redacted Audit Lineage View)**
  - Giao diện xem chuỗi truy nguyên dành riêng cho Reviewer/Auditor ngoài.
  - Nút toggle/filter tự động làm mờ hoặc ẩn nội dung prompt/response nhạy cảm (Sensitive Redaction) trong khi vẫn giữ nguyên metadata cấu trúc.
  - Khung cho phép Auditor ghi chú nhận xét (Audit Observations) trực tiếp lên từng node claim.
- **UI-10: Dashboard phân bổ CRediT & Xuất gói RO-Crate**
  - Biểu đồ/bảng tổng kết đóng góp vai trò của từng tác giả theo chuẩn CRediT và báo cáo minh bạch AI.
  - Nút bấm xuất gói dữ liệu RO-Crate / PROV-JSON kèm modal mô phỏng quá trình tải xuống.

---

## 4. Tiêu chí nghiệm thu giao diện (Acceptance Criteria)
1. **Trạng thái hiển thị (Stateful UI):** Mỗi trang/bảng/thành phần phải thể hiện tối thiểu 3 trạng thái:
   - Đang tải (Loading Skeleton / Spinner).
   - Có dữ liệu hiển thị (Populated State từ Mock Data).
   - Danh sách rỗng (Empty State khi không có kết quả).
2. **Bố cục & Độ phân giải (Layout & Responsiveness):** Bố cục hiển thị chuẩn xác, không bị tràn viền hay vỡ khung trên độ phân giải máy tính để bàn (từ 1280px trở lên).
3. **Cấu trúc mã nguồn chuẩn:**
   - Mã nguồn đặt toàn bộ trong `src/`.
   - Phân chia module rõ ràng: `src/components/`, `src/pages/` (hoặc `src/views/`), và `src/mocks/` (chứa các file JSON dữ liệu mẫu).
4. **Build & Khởi chạy không lỗi:** Lệnh build và khởi động dev server thành công trên terminal, không có lỗi cú pháp hoặc crash runtime.
