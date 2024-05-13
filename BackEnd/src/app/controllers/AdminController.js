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
        let postData;
        User.find({}).exec() 
        .then(async user=> {
            if(!user){
                //Nếu không tìm thấy thông tin user
                throw new Error('404 NOT FOUND');
            }
            const userData = user.slice(30, 42).map(user => user.toObject());
            for (const user of userData)
            {
                const avatarData = await getImage(user.avatar);
                user.avatar = avatarData;
            }
            res.render('admin', {showAdmin: true, userData});
        })
        .catch(error => {
            console.error('Error fetching user from database');
            res.status(500).send('INTERNAL SERVER ERROR');
        })
    }
    stats(req, res){
        Stats.find({}).exec()
        .then(async stats => {
            if(!stats){
                throw new Error('404 NOT FOUND');
            }
            const statsData = stats.map(stat => stat.toObject());
            res.render('admin', {showAdmin: true, statsData});
        })
        .catch(error => {
            console.error('Error fetching stats from database');
            res.status(500).send('INTERNAL SERVER ERROR');
        })
    }
}
module.exports = new AdminController;