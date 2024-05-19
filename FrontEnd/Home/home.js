const heartIcon = document.getElementById('heart-icon');
const notiIcon = document.getElementById('bell-icon');
const houseSec = document.getElementById('house-select');
const areaSec = document.getElementById('area-select');
const priceSec = document.getElementById('price-select');

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

houseSec.addEventListener('click', function() {
    const firstOption = houseSec.querySelector('option');
    firstOption.hidden = true;
});

areaSec.addEventListener('click', function() {
    const firstOption = areaSec.querySelector('option');
    firstOption.hidden = true;
});

priceSec.addEventListener('click', function() {
    const firstOption = priceSec.querySelector('option');
    firstOption.hidden = true;
});