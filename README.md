
# 📘 Bé Học Tiếng Việt 1 - Hướng Dẫn Triển Khai

Ứng dụng được xây dựng trên nền tảng web hiện đại, không cần máy chủ (Serverless), có thể chạy trực tiếp trên bất kỳ dịch vụ lưu trữ web tĩnh nào.

## 🚀 Cách triển khai nhanh lên Vercel (Khuyên dùng)

1. **Chuẩn bị mã nguồn**: Đảm bảo bạn đã có toàn bộ các tệp tin trong thư mục dự án.
2. **Đưa lên GitHub**: Tạo một kho lưu trữ (Repository) mới trên GitHub và đẩy mã nguồn lên đó.
3. **Kết nối với Vercel**:
   - Truy cập [Vercel](https://vercel.com/) và đăng nhập bằng GitHub.
   - Nhấn **"Add New"** -> **"Project"**.
   - Chọn kho lưu trữ chứa ứng dụng này.
4. **Cấu hình Biến Môi Trường (Rất quan trọng)**:
   - Trong quá trình cài đặt, tìm mục **"Environment Variables"**.
   - Thêm một biến mới: 
     - Key: `API_KEY`
     - Value: [Dán mã Gemini API Key của bạn vào đây]
5. **Hoàn tất**: Nhấn **"Deploy"**. Sau 1 phút, bạn sẽ có một địa chỉ web (VD: `be-hoc-tieng-viet.vercel.app`) để gửi cho phụ huynh và học sinh.

## 📱 Cách cài đặt ứng dụng vào điện thoại (PWA)

Sau khi đã có địa chỉ web:
- **Trên iPhone (Safari)**: Nhấn nút **Chia sẻ (Share)** -> Chọn **"Thêm vào màn hình chính" (Add to Home Screen)**.
- **Trên Android (Chrome)**: Nhấn dấu **3 chấm** -> Chọn **"Cài đặt ứng dụng"** hoặc **"Thêm vào màn hình chính"**.

Ứng dụng sẽ xuất hiện như một App thực thụ với biểu tượng riêng, không còn thanh địa chỉ trình duyệt, giúp bé tập trung học tập hơn.

## 🛠 Lưu ý về Dữ liệu
Hiện tại ứng dụng sử dụng `localStorage` để lưu trữ dữ liệu học sinh và tiến trình. Điều này có nghĩa là dữ liệu sẽ được lưu trên **trình duyệt của thiết bị đó**. 
- Nếu thầy cô muốn quản lý tập trung, hãy sử dụng cùng một thiết bị hoặc trình duyệt.
- Dữ liệu sẽ không bị mất khi tải lại trang, nhưng sẽ mất nếu xóa bộ nhớ đệm trình duyệt.
