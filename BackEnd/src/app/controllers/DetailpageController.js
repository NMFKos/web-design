const Post = require('../modules/post');
const User = require('../modules/user');
// const Report = require('../modules/reports');
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

async function getImageUrls(folderPath) {
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    const listRef = ref(storage, folderPath);
    const listResult = await listAll(listRef);

    const imageUrls = [];
    for (const item of listResult.items) {
        const downloadUrl = await getDownloadURL(item);
        imageUrls.push(downloadUrl);
    }
    return imageUrls
}

async function getImage(imgPath) {
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const imageUrl = await getDownloadURL(ref(storage, imgPath));
    return imageUrl
}

class DetailController {
    index(req, res) {
        let postData, userData;
        Post.findOne({ slug: req.params.slug })
        .then(post => {
            if (!post) {
                throw new Error('House not found');
            }
            postData = post.toObject();
            return User.findOne({ _id: post.user_id });
        })
        .then(async user => {
            if (!user) {
                throw new Error('User not found');
            }
            userData = user.toObject();
            const folderPath = postData.images;
            const imagesData = await getImageUrls(folderPath);
            const avatarData = await getImage(user.avatar);
            userData.avatar_image = avatarData;
            res.render('detailpage', { showHeader: true, postData, userData, imagesData });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        });
    }
    // Hàm report không sử dụng
    report(req, res) {
        let houseData, userData;
        House.findOne({ slug: req.params.slug })
        .then(house => {
            if (!house) {
                throw new Error('House not found');
            }
            houseData = house.toObject();
            return User.findOne({ _id: house.user_id });
        })
        .then(user => {
            if (!user) {
                throw new Error('User not found');
            }
            userData = user.toObject();
            const payload = req.body;
            // Tạo một instance của model Report
            const newReport = new Report({
                _id: new mongoose.Types.ObjectId(),
                user_id: userData._id,
                house_id: houseData._id,
                name: userData.name,
                email: userData.email,
                content: payload['content']
            });
            // Lưu dữ liệu vào MongoDB
            return newReport.save();
        })
        .then(() => {
            console.log('Data has been saved successfully');
            res.render('detailpage', { showHeader: true, houseData, userData })
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        });
    }
}

module.exports = new DetailController;
