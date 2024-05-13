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
        let postData, userData;
        Reports.find({}).exec()
        .then(reports => {
            if(!reports){
                throw new Error('Reports not found');
            }
            const reportData = reports.map(p=>p.toObject());
            res.render('reports', {showAdmin: true, reportData});
        })
        // .then(posts =>{
        //     if(!posts){
        //         throw new Error('Posts not found');
        //     }
        //     postData = posts.slice(30, 42).map(post => post.toObject());
        //     return User.find({}).exec();
            
        // })
        // .then(user => {
        //     if(!user){
        //         throw new Error('User not found');
        //     }
        //     userData = user.slice(30, 42).map(user => user.toObject());
        //     res.render('reports', { showAdmin: true, postData , userData});
        // })
        .catch(error => {
            console.log('Error fetching reports from database');
            res.status(500).send(error);
        })
    }

    // reports(req, res){
    //     Reports.find({})
    //     .then(report => {
    //         if(!report){
    //             throw new Error('Reports not found');
    //         }
    //         const reportData = reports.map(rep => rep.toObject());
    //         res.render('reports', {showAdmin: true, reportData});
    //     })
    //     .catch(error => {
    //         console.log('Error fetching reports from database');
    //         res.status(500).send(error);
    //     })
    // }
}
module.exports = new AdminController;