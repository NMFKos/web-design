function initMap() {
    // Tạo một đối tượng bản đồ và đặt trung tâm ở tọa độ 21°00'35.8"N 105°48'09.4"E
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 21.009944, lng: 105.802611 },
        zoom: 15,
    });

    // Thêm một đánh dấu tại tọa độ đã cho
    const marker = new google.maps.Marker({
        position: { lat: 21.009944, lng: 105.802611 },
        map: map,
        title: "21°00'35.8\"N 105°48'09.4\"E"
    });
}
