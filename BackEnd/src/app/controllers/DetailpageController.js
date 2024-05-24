const Post = require('../modules/post');
const User = require('../modules/user');
const Rate = require('../modules/rate')
const Report = require('../modules/reports')
const mongoose = require('mongoose')
const { initializeApp } = require("firebase/app");
const { getStorage, ref, getDownloadURL, listAll } = require("firebase/storage");
const rate = require('../modules/rate');

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
    async index(req, res) {
        try {
            const post = await Post.findOne({ slug: req.params.slug });
            if (!post) {
                throw new Error('House not found');
            }
            const postData = post.toObject();
    
            const rates = await Rate.find({ post_id: post._id });
            const ratesData = rates.map(r => r.toObject());
            // Tính trung bình cộng
            const totalRate = ratesData.reduce((total, rate) => total + rate.rate, 0);
            const avgRating = totalRate / ratesData.length;
            ratesData.avg = avgRating.toFixed(1);
    
            const owner = await User.findOne({ _id: post.user_id });
            if (!owner) {
                throw new Error('Owner not found');
            }
            const ownerData = owner.toObject();
    
            const folderPath = postData.images;
            const imagesData = await getImageUrls(folderPath);

            const user = await User.findOne({ _id: req.userId });
            if (!user) {
                res.render('detailpage', {
                    showHeader: true,
                    postData,
                    ownerData,
                    ratesData,
                    imagesData
                });
            }
            else {
                const userData = user.toObject();

                res.render('detailpage', {
                    showHeader: true,
                    postData,
                    ownerData,
                    userData,
                    ratesData,
                    imagesData
                });
            }
            
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    }    

    ReportRating(req, res) {
        const payload = req.body;
        let userData, postData;
        // rate & comment
        if (Object.keys(payload).length === 2) {
            Post.findOne({ slug: req.params.slug })
            .then(post => {
                if (!post) {
                    throw new Error('Post not found');
                }
                postData = post.toObject();
                return User.findOne({ _id: req.userId });
            })
            .then(user => {
                if (!user) {
                    throw new Error('User not found');
                }
                userData = user.toObject();
                // Tạo một instance của model Report
                const newRate = new Rate({
                    _id: new mongoose.Types.ObjectId(),
                    user_id: userData._id,
                    post_id: postData._id,
                    username: userData.name,
                    rate: payload['rating'],
                    comment: payload['comment-value']
                });
                // Lưu dữ liệu vào MongoDB
                return newRate.save();
            })
            .then(() => {
                res.redirect('back')
            })
            .catch(error => {
                console.error('Error:', error);
                res.status(500).send('Internal Server Error');
            });
        }
        // report
        else if (Object.keys(payload).length === 1) {
            Post.findOne({ slug: req.params.slug })
            .then(post => {
                if (!post) {
                    throw new Error('Post not found');
                }
                postData = post.toObject();
                return User.findOne({ _id: req.userId });
            })
            .then(user => {
                if (!user) {
                    throw new Error('User not found');
                }
                userData = user.toObject();
                // Tạo một instance của model Report
                const newReport = new Report({
                    _id: new mongoose.Types.ObjectId(),
                    user_id: userData._id,
                    post_id: postData._id,
                    username: userData.name,
                    comment: payload['report-value']
                });
                // Lưu dữ liệu vào MongoDB
                return newReport.save();
            })
            .then(() => {
                res.redirect('back');
            })
            .catch(error => {
                console.error('Error:', error);
                res.status(500).send('Internal Server Error');
            });
        }
        else {
            res.send('Up coming');
        }
    }
}

module.exports = new DetailController;
