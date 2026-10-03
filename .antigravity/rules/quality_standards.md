# Tiêu Chuẩn Chất Lượng & Ràng Buộc Kỹ Thuật (Quality Standards & Constraints)

Tất cả các Agent khi hoạt động trong repository **ClaimTrace** bắt buộc phải tuân thủ nghiêm ngặt các quy tắc sau:

---

## 1. Quy tắc Thiết Kế Giao Diện (Visual UI/UX Rules)
- **Strict Light Mode**: Tuyệt đối không bật hoặc hỗ trợ dark mode; không dùng neon, glow, heavy dark backgrounds.
- **Academic Minimalism**:
  - Nền Canvas tổng: `#F8F9FA`.
  - Thẻ / Card / Giấy văn bản: `#FFFFFF`.
  - Đường viền: `#E2E8F0` hoặc `#CBD5E1` (viền mỏng 1px sắc nét).
- **Phông chữ (Typography)**:
  - Serif (`font-serif`): Dành riêng cho văn bản học thuật, trích dẫn bản thảo (Manuscript quotes).
  - Monospace (`font-mono`): Dành riêng cho SHA-256 hash, commit ID, code, CLI commands, diffs.
  - Sans-serif (`font-sans` / Inter): Dành cho thanh điều hướng, nút bấm, form controls.

---

## 2. Quy tắc Lập Trình TypeScript & React
- **Strict Mode**: Sử dụng `import type { ... }` khi import types/interfaces (`verbatimModuleSyntax`).
- **Không để biến thừa**: Tiền tố `_` cho bất kỳ tham số nào chưa sử dụng để tránh lỗi `noUnusedLocals` (TS6133).
- **Tránh Cascading Re-renders**: Không gọi `setState` đồng bộ nhiều lần bên trong `useEffect`. Ưu tiên khởi tạo state theo component key (`key={entity.id}`) hoặc derive state trong quá trình render.
- **Clean Architecture**: Tách bạch rõ giữa:
  - `types/`: Định nghĩa kiểu dữ liệu thuần túy.
  - `services/`: Tầng giao tiếp dữ liệu (Mock & API).
  - `store/`: Quản lý trạng thái tương tác toàn cục (Zustand).
  - `components/`: UI components tái sử dụng và Modals.
  - `pages/`: Các màn hình route chính.

---

## 3. Quy chuẩn Kiểm Thử & Nghiệm Thu
- Mỗi khi có thay đổi mã nguồn, bắt buộc phải vượt qua:
  1. `npx tsc -b` -> 0 lỗi type.
  2. `npm run lint` -> 0 lỗi, 0 cảnh báo.
  3. `npm run build` -> Gói production bundle biên dịch thành công.
