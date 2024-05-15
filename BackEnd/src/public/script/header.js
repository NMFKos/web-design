const heartIcon = document.getElementById('heart-icon');
const notiIcon = document.getElementById('bell-icon');

// Thêm sự kiện mouseover
heartIcon.addEventListener('mouseover', function() {
    // Thay đổi class của icon để chuyển sang icon khác
    heartIcon.classList.remove('fa-regular');
    heartIcon.classList.add('fa-solid');
});

// Thêm sự kiện mouseout
heartIcon.addEventListener('mouseout', function() {
    // Thay đổi class của icon để quay lại icon ban đầu
    heartIcon.classList.remove('fa-solid');
    heartIcon.classList.add('fa-regular');
});

// Thêm sự kiện mouseover
notiIcon.addEventListener('mouseover', function() {
    // Thay đổi class của icon để chuyển sang icon khác
    notiIcon.classList.remove('fa-regular');
    notiIcon.classList.add('fa-solid');
});

// Thêm sự kiện mouseout
notiIcon.addEventListener('mouseout', function() {
    // Thay đổi class của icon để quay lại icon ban đầu
    notiIcon.classList.remove('fa-solid');
    notiIcon.classList.add('fa-regular');
});