// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytes } = require("firebase/storage");
const { readdirSync, statSync, readFileSync } = require("fs");

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

// Hàm đẩy ảnh lên Firebase Storage và lưu trong các thư mục tương tự
async function uploadImagesToFirebase(localFolderPath) {
  try {
    const files = readdirSync(localFolderPath);

    for (const file of files) {
      const filePath = `${localFolderPath}/${file}`;
      const stats = statSync(filePath);

      if (stats.isDirectory()) {
        // Nếu là thư mục, gọi lại hàm đệ quy để xử lý thư mục con
        await uploadImagesToFirebase(filePath);
      } else {
        // Nếu là file, xác định tên thư mục chứa và tên file
        const storageRef = ref(storage, `images/${filePath}`);
        console.log(filePath)
        const fileData = readFileSync(filePath, 'utf8');
        await uploadBytes(storageRef, fileData);
        console.log(`${file} uploaded successfully.`);
      }
    }
  } catch (error) {
    console.error("Error uploading files:", error);
  }
}

// Gọi hàm để đẩy ảnh lên Firebase
uploadImagesToFirebase(localFolderPath);
