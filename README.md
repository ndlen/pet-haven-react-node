# Pet Haven

**Pet Haven** là hệ thống quản lý dịch vụ và sản phẩm cho thú cưng, hỗ trợ đặt lịch hẹn, mua hàng, quản lý người dùng, nhân viên, sản phẩm, dịch vụ và thanh toán trực tuyến qua VietQR.

---

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng chính](#tính-năng-chính)
- [Cấu trúc thư mục & Nhánh Git](#cấu-trúc-thư-mục--nhánh-git)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cài đặt & Chạy dự án](#cài-đặt--chạy-dự-án)
- [Cấu hình biến môi trường](#cấu-hình-biến-môi-trường)
- [Cấu trúc API Backend](#cấu-trúc-api-backend)
- [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
- [Quy trình phát triển & Đóng góp](#quy-trình-phát-triển--đóng-góp)
- [Kiểm thử & Debug](#kiểm-thử--debug)
- [Bảo mật & Lưu ý](#bảo-mật--lưu-ý)
- [Liên hệ](#liên-hệ)

---

## Giới thiệu

Pet Haven là hệ thống quản lý cửa hàng thú cưng, cung cấp các chức năng đặt lịch hẹn dịch vụ, mua sản phẩm, quản lý đơn hàng, xác thực người dùng, phân quyền quản trị, và thanh toán trực tuyến. Ứng dụng gồm 2 phần: **backend** (Node.js/Express/MongoDB) và **frontend** (React/Ant Design).

---

## Tính năng chính

- Đăng ký, đăng nhập, xác thực email (JWT, email verification)
- Phân quyền: admin, nhân viên, khách hàng
- Quản lý sản phẩm, dịch vụ, lịch hẹn, đơn hàng, người dùng
- Đặt lịch hẹn dịch vụ cho thú cưng
- Đặt hàng sản phẩm, quản lý giỏ hàng
- Thanh toán qua VietQR hoặc khi nhận hàng (COD)
- Quản lý nhân viên, phân công lịch hẹn
- Thống kê, lịch sử mua hàng
- Giao diện thân thiện, hỗ trợ dark/light mode

---

## Cấu trúc thư mục & Nhánh Git

### Cấu trúc thư mục

```
pet-haven/
│
├── backend/         # Source code backend (Node.js/Express)
│   ├── app.js
│   ├── .env
│   ├── package.json
│   ├── controllers/
│   ├── dtos/
│   ├── middlewares/
│   ├── models/
│   └── routes/
│
├── frontend/        # Source code frontend (React)
│   ├── package.json
│   ├── proxy.js
│   ├── public/
│   └── src/
│
└── README.md        # File hướng dẫn tổng hợp (nhánh master)
```

### Các nhánh Git

- **master**: Chứa file README.md hướng dẫn tổng hợp, không chứa source code.
- **frontend**: Chứa toàn bộ mã nguồn React (thư mục `frontend/`).
- **backend**: Chứa toàn bộ mã nguồn Node.js/Express (thư mục `backend/`).

---

## Công nghệ sử dụng

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Yup, Bcrypt, Axios, Nodemailer
- **Frontend:** React, Ant Design, Axios, React Router, NProgress, Moment.js
- **Khác:** VietQR API, Proxy Express cho kiểm tra thanh toán

---

## Cài đặt & Chạy dự án

### 1. Clone project

```sh
git clone https://github.com/ndlen/pet-haven.git
cd pet-haven
```

### 2. Cài đặt backend

```sh
cd backend
npm install
```

### 3. Cài đặt frontend

```sh
cd ../frontend
npm install
```

### 4. Chạy backend

```sh
cd ../backend
npm start
```
Hoặc để auto reload khi dev:
```sh
npm run dev
```

### 5. Chạy proxy VietQR (nếu dùng)

```sh
cd ../frontend
node proxy.js
```
Proxy này hỗ trợ kiểm tra giao dịch VietQR (mặc định chạy ở port 3002).

### 6. Chạy frontend

```sh
cd ../frontend
npm start
```

Truy cập [http://localhost:3001](http://localhost:3001) để sử dụng ứng dụng.

---

## Cấu hình biến môi trường

Tạo file `.env` trong thư mục `backend` với nội dung ví dụ:

```env
MONGO_URI=mongodb://localhost:27017/pet-haven
JWT_SECRET=mysecretkey123456789
PORT=3000

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

**Giải thích:**
- `MONGO_URI`: Đường dẫn kết nối MongoDB.
- `JWT_SECRET`: Chuỗi bí mật để ký và xác thực JWT.
- `PORT`: Cổng chạy backend (mặc định 3000).
- `EMAIL_USER`: Email gửi xác thực (nên dùng Gmail và bật "App Password").
- `EMAIL_PASS`: Mật khẩu ứng dụng của Gmail (không dùng mật khẩu thường).

**Lưu ý bảo mật:** Không commit file `.env` lên git.

---

## Cấu trúc API Backend

### Đăng ký, xác thực, đăng nhập

- `POST /api/auth/register`  
  Đăng ký tài khoản, gửi email xác thực.
- `GET /api/auth/verify-email?token=...`  
  Xác thực email qua link gửi về email.
- `POST /api/auth/login`  
  Đăng nhập, trả về JWT.

### Quản lý người dùng

- `GET /api/users` (admin)
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Quản lý sản phẩm, dịch vụ

- `GET /api/products`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)
- Tương tự cho `/api/services`

### Đặt lịch hẹn

- `POST /api/appointments`
- `GET /api/appointments`
- `PUT /api/appointments/:id` (admin/nhân viên)

### Đơn hàng & Thanh toán

- `POST /api/orders`
- `GET /api/orders`
- `POST /api/payment/vietqr`  
  Sinh mã QR thanh toán
- `POST /api/payment/check`  
  Kiểm tra trạng thái thanh toán

---

## Hướng dẫn sử dụng

### Đăng ký & xác thực email

1. Người dùng đăng ký tài khoản, hệ thống gửi email xác thực.
2. Nhấp vào link xác thực trong email để kích hoạt tài khoản.
3. Sau khi xác thực, có thể đăng nhập và sử dụng các chức năng.

### Phân quyền

- **Admin:** Quản lý người dùng, nhân viên, sản phẩm, dịch vụ, lịch hẹn, đơn hàng.
- **Nhân viên:** Xem và xử lý lịch hẹn được phân công.
- **Khách hàng:** Đặt lịch hẹn, đặt hàng, thanh toán, xem lịch sử.

### Đặt hàng & thanh toán

- Thêm sản phẩm/dịch vụ vào giỏ hàng.
- Chọn phương thức thanh toán (COD hoặc VietQR).
- Nếu chọn VietQR, hệ thống sinh mã QR và kiểm tra giao dịch tự động.

### Quản lý

- Admin đăng nhập tại `/admin/login`.
- Quản lý qua các trang: người dùng, nhân viên, sản phẩm, dịch vụ, lịch hẹn, đơn hàng.

---

## Quy trình phát triển & Đóng góp

1. **Fork** dự án và tạo nhánh mới từ `frontend` hoặc `backend` tùy phần muốn sửa.
2. **Commit** code rõ ràng, có mô tả.
3. **Pull request** về nhánh tương ứng.
4. **Review** và hợp nhất vào nhánh chính.

**Quy ước commit:**  
`[backend|frontend] <tính năng>: <mô tả ngắn>`

---

## Kiểm thử & Debug

- **Backend:**  
  - Sử dụng Postman để test API.
  - Kiểm tra log trong terminal khi chạy server.
  - Đảm bảo các biến môi trường đúng, đặc biệt là email và JWT.
- **Frontend:**  
  - Sử dụng DevTools để kiểm tra request/response.
  - Kiểm tra lỗi CORS nếu frontend và backend chạy khác port.
- **Kiểm thử email:**  
  - Kiểm tra hộp thư spam nếu không nhận được email xác thực.
  - Đảm bảo đã bật "App Password" cho Gmail.

---

## Bảo mật & Lưu ý

- Không commit file `.env` hoặc thông tin nhạy cảm lên git.
- Đổi `JWT_SECRET` và `EMAIL_PASS` khi deploy production.
- Sử dụng HTTPS khi triển khai thực tế.
- Đặt quyền truy cập đúng cho các API (middleware kiểm tra JWT và role).
- Định kỳ thay đổi mật khẩu email gửi xác thực.

---

## Liên hệ

- Email: nguyenduclenqna@gmail.com
- Facebook: https://facebook.com/duclenit

---

**Pet Haven** - Ứng dụng quản lý dịch vụ và sản phẩm cho thú cưng.
