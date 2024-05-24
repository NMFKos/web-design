// Lấy tất cả các phần tử image-char
const images = document.querySelectorAll('.image-char');

// Lặp qua từng ảnh
images.forEach(image => {
    // Lấy chiều rộng và chiều cao tự nhiên của ảnh
    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;

    // Kiểm tra nếu ảnh vượt quá kích thước đã chỉ định
    if (naturalWidth > 320 || naturalHeight > 240) {
        // Thêm lớp zoomed để zoom ảnh
        image.classList.add('zoomed');
    }
});
