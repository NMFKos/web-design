Mô hình MVC (Model - Views - Controller)  
- Model là nơi chứa schema của mongoose để upload data theo định dạng các trường, do MongoDB có đặc điểm là các Document có thể hoàn toàn khác nhau  
- Views là nơi chứa các file handlebars để hiển thị trang web từ phía server cho client (có thể thay đổi tài nguyên trang web), lưu ý là viết code css vào file scss không ghi trực tiếp vào css (chạy 2 terminal song song khi cần điều chỉnh file css - nodemon tự động cập nhật thay đổi scss vào css tương ứng)  
- Controller chọc vào Model lấy dữ liệu và hiển trị trên trang web  
- Routes là các luồng hiển thị (/login, /post, ...)  
- Source: https://www.youtube.com/watch?v=z2f7RHgvddc&list=PL_-VfJajZj0VatBpaXkEHK_UPHL7dW6I3
