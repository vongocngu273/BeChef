# 🥣 BeChef - AI Recipe & Meal Planner Cho Bé (6-24 Tháng)

> **Tác giả:** **Ngự Võ**  
> **Phiên bản:** v1.0.0 | Tiêu chuẩn Y Khoa Nhi (6-24 Tháng)

Ứng dụng web thông minh giúp bố mẹ lên thực đơn ăn dặm cho bé chỉ trong vài giây dựa trên nguyên liệu sẵn có trong tủ lạnh và **tuân thủ nghiêm ngặt quy tắc dinh dưỡng & an toàn y khoa nhi**.

Được hỗ trợ bởi **Google Gemini API** (`gemini-3.8-flash`), **Node.js (Express)** và **React (Vite) + Tailwind CSS**.

---

## ✨ Tính Năng Nổi Bật

- 👶 **Tùy chỉnh theo tháng tuổi (6 - 24 tháng)**: Tự động điều chỉnh độ thô phù hợp theo từng giai đoạn phát triển (1:10 puree, 1:7 lợn cợn nhỏ, 1:5 tập bốc nhón, cơm nát/mềm).
- 🥦 **Gợi ý từ nguyên liệu sẵn có**: Chọn nhanh nhóm Đạm, Rau củ, Dầu ăn dặm hoặc tự nhập nguyên liệu riêng của gia đình.
- 🛡️ **Bộ lọc an toàn Y khoa Nhi (Pediatric Guardrails)**:
  - Tuyệt đối **KHÔNG** nêm mật ong, muối, đường, nước mắm, hạt nêm, bột ngọt cho trẻ dưới 12 tháng.
  - Loại bỏ hoàn toàn nguy cơ hóc dị vật (không để nguyên hạt cứng, quả tròn nguyên vẹn).
- 📋 **Checklist nấu ăn tương tác**: Bấm check từng bước nấu ăn để đánh dấu hoàn thành (hiển thị mờ & gạch ngang).
- 🔍 **Chế độ Nấu Bếp Phóng To (Kitchen Focus Mode)**: Mở rộng 1 thẻ món ăn toàn màn hình với cỡ chữ lớn, tối ưu cho mẹ vừa nhìn công thức vừa nấu ăn tại quầy bếp.
- 🛒 **Sao chép danh sách đi chợ 1 chạm**: Tự động lọc ra những nguyên liệu còn thiếu để mẹ đi chợ tiện lợi.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ (Local)

### 1. Yêu cầu hệ thống
- [Node.js](https://nodejs.org/) v18+ và npm.

### 2. Cài đặt & Cấu hình
```bash
# Clone dự án
git clone https://github.com/YOUR_USERNAME/BeChef.git
cd BeChef

# Cài đặt dependencies
npm install
cd client && npm install && cd ..

# Cấu hình biến môi trường
cp .env.example .env
```
Mở file `.env` và thêm `GEMINI_API_KEY` của bạn (nếu không có key, ứng dụng sẽ tự động kích hoạt bộ gợi ý chuẩn y khoa Offline Fallback).

### 3. Khởi động ứng dụng
```bash
npm start
```
Mở trình duyệt tại: **http://localhost:5001**

---

## 🌐 Hướng Dẫn Deploy Miễn Phí (Cho mọi người dùng thử)

Dự án gồm backend Express và frontend React nên nền tảng **Render.com** là lựa chọn triển khai miễn phí nhanh nhất:

1. **Đăng nhập [Render.com](https://render.com/)** bằng tài khoản GitHub.
2. Chọn **New +** ➡️ **Web Service** ➡️ Kết nối với repository **BeChef**.
3. Điền thông tin cấu hình:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server.js`
4. Trong phần **Environment Variables**, thêm:
   - `GEMINI_API_KEY`: *(Key Gemini của bạn)*
   - `PORT`: `10000` *(hoặc để trống, Render tự cấp)*
5. Bấm **Deploy Web Service** ➡️ Sau 2-3 phút, bạn sẽ có link công khai (ví dụ: `https://bechef.onrender.com`) để gửi cho bạn bè, hội nhóm phụ huynh trải nghiệm!

---

## 🧪 Kiểm Thử Tự Động (QA Test Suites)

Dự án tích hợp bộ kiểm thử tự động 100% bao gồm Supertest (Backend API) và React Testing Library (Frontend):

```bash
# Chạy toàn bộ 22 tests
npm test

# Chạy vòng lặp tự sửa lỗi (Self-healing loop)
npm run test:runner
```

---

## 💬 Đóng Góp Ý Kiến (Feedback)

Dự án đang trong giai đoạn thử nghiệm để lắng nghe ý kiến từ cộng đồng phụ huynh:
- Bạn thấy gợi ý món ăn có phù hợp với bé nhà mình không?
- Bạn mong muốn có thêm tính năng nào khác?

👉 Hãy mở mục [Issues](https://github.com/YOUR_USERNAME/BeChef/issues) để gửi nhận xét nhé. Xin cảm ơn sự ủng hộ của bạn! ❤️
