const Post = require('../modules/post');
const User = require("../modules/user")
const Stats = require("../modules/stats")
const Reports = require("../modules/reports")
const mongoose = require('mongoose')
const { initializeApp } = require('firebase/app')
const {getStorage, ref, getDownloadURL, listAll} = require('firebase/storage')

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

async function getImage(imgPath){
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const imageUrl = await getDownloadURL(ref(storage, imgPath));
    return imageUrl;
}

function updatePostStatus(postId, status) {
    fetch('/update-post-status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: postId, status: status }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Cập nhật thành công');
            location.reload(); // Tải lại trang để cập nhật thay đổi
        } else {
            alert('Có lỗi xảy ra, vui lòng thử lại');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Có lỗi xảy ra, vui lòng thử lại');
    });
}

class AdminController {
    index(req, res) {
        let postData, statsData;
        Stats.find({})
        .then(stats =>{
            if(!stats){
                throw new Error('Stats not found');
            }
            statsData = stats.map(stats => stats.toObject());
            return User.find({}).exec();
        })
        .then(async user=> {
            if(!user){
                throw new Error('404 NOT FOUND');
            }
            const userData = user.slice(30, 42).map(user => user.toObject());
            for (const user of userData)
            {
                const avatarData = await getImage(user.avatar); // lấy URL avatar của user
                user.avatar = avatarData;
            }
            res.render('admin', {showAdmin: true, userData, statsData});
        })
        .catch(error => {
            console.error('Error fetching user from database');
            res.status(500).send(error);
        })
    }

    reports(req, res) {
        Reports.find({}).exec()
        .then(reports => {
            if(!reports){
                throw new Error('Reports not found');
            }
            const reportData = reports.map(p=>p.toObject());
            res.render('reports', {showAdmin: true, reportData});
        })
        .catch(error => {
            console.log('Error fetching reports from database');
            res.status(500).send(error);
        })
    }

    requests(req, res){
        let userData;
        User.find({}).exec()
        .then(user => {
            if(!user){
                throw new Error('User not found');
            }
            userData = user.map(user => user.toObject());
            return Post.find({}).exec();
        })
        .then(posts => {
            if(!posts){
                throw new Error('Post not found');
            }
            const postData = posts.filter(p => p.status==0).map(p=>p.toObject());
            let newPosts = postData.map( post => {
                let user = userData.find(user => user._id === post.user_id);
                return{
                    ...post,
                    username: user ? user.username: 'unknown'
                };
            });
            
            res.render('request', {showAdmin: true, newPosts});
        })
        .catch(error => {
            console.error('Error fetching new posts from database');
            res.status(500).send(error);
        }) 
    }

    async updatePostStatus(req, res)
    {
        const {id, status} = req.body;
        try {
            const post = await Post.findByIdAndUpdate(id, { status: status }, { new: true });
            if (!post) {
                return res.status(404).json({ success: false, message: 'Post not found' });
            }
            res.json({ success: true, message: 'Post status updated successfully' });
        } catch (error) {
            console.error('Error updating post status:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
    logout(req, res) {
        req.session.destroy();
        res.redirect('/');
    }
}
module.exports = new AdminController;