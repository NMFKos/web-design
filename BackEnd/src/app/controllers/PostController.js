const Posts = require('../modules/post')
const mongoose = require('mongoose')
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
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

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class PostController {
    index(req, res) {
        res.render('post', { showHeader: true });
    }

    postnew(req, res) {
        const payload = req.body;
        const randomNum = randomNumber(1, 100);
        //uploadImagesToFirebase('src\\public\\storage');
        const newPosts = new Posts({
            _id: new mongoose.Types.ObjectId(),
            user_id: 'cbc66b632bd71ddb7ccbda8f',
            title: payload['tieude'],
            description: payload['noidung'],
            price: payload['giatien'],
            address: payload['address'],
            type_house: payload['type_house'],
            type_post: 0,
            status: 0,
            area: payload['dientich'],
            slug: `demo-${randomNum}`,
            images: `images/Q10/Studio/3 tháng 2/`
        });
        newPosts.save()
        .then(() => {
            res.redirect('/account/your-posts')
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        });
    }
}

module.exports = new PostController;