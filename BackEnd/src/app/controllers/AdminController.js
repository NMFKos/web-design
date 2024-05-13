const Post = require('../modules/post');
const User = require("../modules/user")
const Stats = require("../modules/stats")
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
        Post.find({}).exec()
        .then(async posts =>{
            if(!posts){
                throw new Error('Posts not found');
            }
            const postData = posts.slice(30, 42).map(post => post.toObject());
            res.render('reports', { showAdmin: true, postData });
        })
    }
}
module.exports = new AdminController;