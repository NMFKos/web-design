const { initializeApp } = require("firebase/app");
const { getStorage, ref, getDownloadURL, listAll } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyDF36H8mFiTkXTyvRD6z-4YHmqsNCZ4yxE",
  authDomain: "images-a66c0.firebaseapp.com",
  projectId: "images-a66c0",
  storageBucket: "images-a66c0.appspot.com",
  messagingSenderId: "1081654025998",
  appId: "1:1081654025998:web:7515c882788d914a3c415f",
  measurementId: "G-Z6TTKT1H0N"
};

async function getImageUrls() {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    const folderPath = 'images/Q10/2PN/Hoàng Dư Khương'; // Thay "ten_thu_muc" bằng tên thực của thư mục bạn muốn truy cập

    const listRef = ref(storage, folderPath);
    const listResult = await listAll(listRef);

    // Lưu trữ tất cả các URL của các ảnh trong mảng
    const imageUrls = [];
    for (const item of listResult.items) {
        const downloadUrl = await getDownloadURL(item);
        imageUrls.push(downloadUrl);
    }
    return imageUrls
}

class test {
    async index(req, res) {
        try {
            const imageUrls = await getImageUrls();
            console.log(imageUrls)
            res.render('test', { imageUrls: imageUrls });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = new test;