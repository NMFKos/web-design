const Posts = require('../modules/post')
const Images = require('../modules/image')
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

async function getImage(folderPath) {
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    const listRef = ref(storage, folderPath);
    const listResult = await listAll(listRef);

    const firstDownloadUrl = await getDownloadURL(listResult.items[0]);
    return firstDownloadUrl;
}

class SiteController {
    index(req, res) {
        Posts.find({}).exec()
        .then(async posts => {
            if (!posts) {
                throw new Error('404 Not found');
            }
            const postData = posts.slice(30, 40).map(p => p.toObject());
            // Thêm mã để lấy imagesData cho mỗi bài đăng
            // for (const post of postData) {
            //     const folderPath = post.images;
            //     const imagesData = await getImage(folderPath);
            //     post.thumbnailData = imagesData;
            // }
            res.render('home', { showHeader: true, postData });
        })
        .catch(error => {
            console.error('Error fetching houses from database:', error);
            res.status(500).send('Internal Server Error');
        });
    }
    
    login(req, res) {
        res.render('login', { showHeader: false });
    }
}

module.exports = new SiteController;