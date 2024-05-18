// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytes } = require("firebase/storage");
const { readdirSync, statSync, readFileSync } = require("fs");
const path = require('path');

const firebaseConfig = {
  apiKey: "AIzaSyDF36H8mFiTkXTyvRD6z-4YHmqsNCZ4yxE",
  authDomain: "images-a66c0.firebaseapp.com",
  projectId: "images-a66c0",
  storageBucket: "images-a66c0.appspot.com",
  messagingSenderId: "1081654025998",
  appId: "1:1081654025998:web:7515c882788d914a3c415f",
  measurementId: "G-Z6TTKT1H0N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
// Đường dẫn đến thư mục chứa các ảnh trên máy của bạn
const localFolderPath = "Tân Bình";
const metadata = {
  contentType: 'image/jpeg',
};

// Hàm đẩy ảnh lên Firebase Storage và lưu trong các thư mục tương tự
async function uploadImagesToFirebase(localFolderPath) {
  try {
    const files = readdirSync(localFolderPath);

    for (const file of files) {
      const filePath = `${localFolderPath}/${file}`;
      const stats = statSync(filePath);
      const extname = path.extname(filePath).toLowerCase();

      if (stats.isDirectory()) {
        // Nếu là thư mục, gọi lại hàm đệ quy để xử lý thư mục con
        await uploadImagesToFirebase(filePath);
      } else if (extname === '.jpg' || extname === '.jpeg') {
        // Nếu là file ảnh JPG, xác định tên thư mục chứa và tên file
        const storageRef = ref(storage, `images/${filePath}`);
        console.log(filePath);
        const fileData = readFileSync(filePath);
        await uploadBytes(storageRef, fileData, metadata);
        console.log(`${filePath} uploaded successfully.`);
      } else {
        // Nếu là file không phải ảnh JPG, bỏ qua và không tải lên Firebase
        console.log(`${filePath} is not a JPG image. Skipping upload.`);
      }
    }
  } catch (error) {
    console.error("Error uploading files:", error);
  }
}

// Gọi hàm để đẩy ảnh lên Firebase
uploadImagesToFirebase(localFolderPath);
