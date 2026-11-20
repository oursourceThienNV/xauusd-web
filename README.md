# XAUUSD Gold Admin – Web quản trị (Next.js 16)

Giao diện quản trị mới cho bot giao dịch vàng XAUUSD. Web có giao diện tối (Gold) và sáng, chạy tốt trên mobile.

## Chức năng

| Trang | Nội dung |
|---|---|
| **Đăng nhập** | Ghi nhớ tài khoản, tự quay về khi hết phiên |
| **Dashboard** | Tổng số dư, lợi nhuận 7/30/90 ngày, biểu đồ lợi nhuận tích luỹ và theo ngày, tỷ lệ thắng, bot online, hiệu quả theo phương pháp, top tài khoản, cấu hình tốt nhất, lệnh gần nhất |
| **Tài khoản** | Lọc trạng thái / loại / từ khoá. Tạo mới, sửa, khoá / mở khoá, gia hạn license (có xem trước ngày hết hạn mới). Hiển thị trạng thái bot online |
| **Báo cáo thống kê** | Chọn nhanh khoảng ngày, sắp xếp cột, dòng tổng, xuất Excel |
| **Chi tiết tài khoản** | Thống kê, biểu đồ, lợi nhuận bot / thủ công. Lọc nguồn / BUY-SELL / WIN-LOSS, xuất Excel giao dịch |
| **Nhật ký bot** | Log từ VPS, tô màu theo mức độ, tự cập nhật mỗi 5 giây |
| **Hồ sơ & bảo mật** | Đổi mật khẩu, chọn giao diện |

## Chạy

```bash
npm install
npm run build
npm run start            # cổng 3000
# hoặc PM2:
pm2 start "npm run start" --name fe_menu
```

Cấu hình API trong `.env.production` / `.env.local`:

```
NEXT_PUBLIC_API_URL=http://180.93.144.96:8084/api/
```

> Web dùng các API mới của **xauusd-api-python** (dashboard/statistics, summary, logs, tạo/sửa tài khoản). Hãy triển khai API Python trước.
