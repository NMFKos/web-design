const User = require('../modules/user')
const bcrypt = require('bcrypt');
const Posts = require('../modules/post')
const Images = require('../modules/image')
const { initializeApp } = require("firebase/app");
const { getStorage, ref, getDownloadURL, listAll } = require("firebase/storage");
const { ObjectId } = require('mongodb');

const firebaseConfig = {
    apiKey: "AIzaSyDF36H8mFiTkXTyvRD6z-4YHmqsNCZ4yxE",
    authDomain: "images-a66c0.firebaseapp.com",
    projectId: "images-a66c0",
    storageBucket: "images-a66c0.appspot.com",
    messagingSenderId: "1081654025998",
    appId: "1:1081654025998:web:7515c882788d914a3c415f",
    measurementId: "G-Z6TTKT1H0N"
};

async function getFirstImageUrl(folderPath) {
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    const listRef = ref(storage, folderPath);
    const listResult = await listAll(listRef);

    let firstImageUrl = null;
    if (listResult.items.length > 0) {
        const item = listResult.items[0];
        firstImageUrl = await getDownloadURL(item);
    }
    
    return firstImageUrl;
}

class UserController {
    index(req, res) {
        User.findOne({ _id: req.userId }) // Tìm kiếm người dùng theo id từ params
        .then(user => {
            if (!user) {
                throw new Error('User not found');
            }
            // Truyền dữ liệu người dùng tới view 'account'
            res.render('account', {
                showHeader: true,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                successMessage: req.flash('success'),
                errorMessage: req.flash('error'),
            });
        })
        .catch(error => {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        });
    }
    // Trong UserController
    update(req, res) {
        const id = req.userId;
        const updatedData = req.body;
        User.findByIdAndUpdate(id, updatedData, { new: true })
            .then(result => {
                req.flash('success', 'Profile updated successfully');
                res.redirect('/account');
            })
            .catch(err => {
                req.flash('error', 'An error occurred while updating the profile');
                res.redirect('/account');
            });
    }
    password(req, res) {
        res.render('changepassword', {showHeader: true, successMessage: req.flash('success'), errorMessage: req.flash('error') });
    }
    async changePassword(req, res) {
        const { oldpassword, newpassword } = req.body;
        try {
            // Find the user in the database
            const user = await User.findOne({ _id: req.userId });
            // Check if the old password is correct
            if (oldpassword !== user.password) {
            req.flash('error', 'Incorrect old password');
            return res.redirect('/account/change-password');
            }
            // Update the password in the database
            user.password = newpassword;
            await user.save();
            req.flash('success', 'Password updated successfully');
            res.redirect('/account/change-password');
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    }
    showPosts(req, res) {
        Posts.find({ user_id: req.userId })
        .then(async posts => {
            if (!posts) {
                throw new Error('404 Not found');
            }
            const postData = posts.map(p => p.toObject());
            for (const post of postData) {
                const folderPath = post.images;
                const imagesData = await getFirstImageUrl(folderPath);
                post.thumbnailData = imagesData;
            }
            res.render('uploadbaidang', { showHeader: true, postData });
        })
        .catch(error => {
            console.error('Error fetching houses from database:', error);
            res.status(500).send('Internal Server Error');
        });
    }
}

module.exports = new UserController();


