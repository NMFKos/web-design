const Post = require('../modules/post');
const User = require("../modules/user")
const Stats = require("../modules/stats")
const Reports = require("../modules/reports")
const { initializeApp } = require('firebase/app')
const {getStorage, ref, getDownloadURL, listAll} = require('firebase/storage');

const firebaseConfig = {
    apiKey: "AIzaSyDF36H8mFiTkXTyvRD6z-4YHmqsNCZ4yxE",
    authDomain: "images-a66c0.firebaseapp.com",
    projectId: "images-a66c0",
    storageBucket: "images-a66c0.appspot.com",
    messagingSenderId: "1081654025998",
    appId: "1:1081654025998:web:7515c882788d914a3c415f",
    measurementId: "G-Z6TTKT1H0N"
};

async function getImage(imgPath){
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);
    const imageUrl = await getDownloadURL(ref(storage, imgPath));
    return imageUrl;
}

class AdminController {
    index(req, res) {
        let postData, statsData;
        Stats.find({}).exec()
        .then(stats =>{
            if(!stats){
                throw new Error('Stats not found');
            }
            statsData = stats.slice(0, 1).map(stats => stats.toObject());
            return User.find({}).sort({ createdAt: -1 }).exec();
        })
        .then(async user=> {
            if(!user){
                throw new Error('404 NOT FOUND');
            }
            const userData = user.slice(0, 14).map(user => user.toObject());
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
        Reports.find({}).sort({state: 1}).exec()
        .then(async reports => {
            if(!reports){
                throw new Error('Reports not found');
            }
            const report = reports.filter(p => p.state>=0).map(p=>p.toObject());
            const reportData = await Promise.all(
                report.map(async (p) => {
                    const post = await Post.findOne({ _id: p.post_id }).select('slug');
                    return {
                        ...p,
                        slug: post ? post.slug : null
                    };
                })
            );
            res.render('reports', {showAdmin: true, reportData});
        })
        .catch(error => {
            console.log('Error fetching reports from database');
            res.status(500).send(error);
        })
    }

    requests(req, res){
        let postData;
        Post.find({status: 0}).sort({type_post: -1})
        .then(async post => {
            if(!post){
                throw new Error('User not found');
            }
            postData = await Promise.all(post.map(async p => {
                const postObject = p.toObject();
                const user = await User.findById(p.user_id);
                if (user) {
                  postObject.user = user.toObject();
                }
                return postObject;
              }));
            res.render('request', {showAdmin: true, postData});
        })
        .catch(error => {
            console.error('Error fetching new posts from database');
            res.status(500).send(error);
        }) 
    }

    updateReportStatus(req, res, next){
        Reports.findByIdAndUpdate(req.params.id, { state: 1 }, { new: true })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    updatePostStatus(req, res, next) {
        Post.findByIdAndUpdate(req.params.id, { status: 1 }, { new: false })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    deleteReport(req, res, next){
        Reports.findByIdAndUpdate(req.params.id, { state: -1 }, { new: true })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    deletePost(req, res, next)
    {
        Post.findByIdAndUpdate(req.params.id, { status: -1 }, { new: true })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    logout(req, res) {
        req.session.destroy();
        res.redirect('/');
    }
}
module.exports = new AdminController;