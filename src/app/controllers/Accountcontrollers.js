const User = require('../modules/user')
const path = require('path');
const Posts = require('../modules/post')
const googleUser = require('../modules/google')
const { initializeApp } = require("firebase/app");
const { getStorage, ref, getDownloadURL, listAll, uploadBytes } = require("firebase/storage");
const { readdirSync, readFileSync, statSync, unlinkSync } = require("fs");

const firebaseConfig = {
    apiKey: "AIzaSyDF36H8mFiTkXTyvRD6z-4YHmqsNCZ4yxE",
    authDomain: "images-a66c0.firebaseapp.com",
    projectId: "images-a66c0",
    storageBucket: "images-a66c0.appspot.com",
    messagingSenderId: "1081654025998",
    appId: "1:1081654025998:web:7515c882788d914a3c415f",
    measurementId: "G-Z6TTKT1H0N"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const metadata = {
    contentType: 'image/jpeg',
  };

async function getFirstImageUrl(folderPath) {
    const listRef = ref(storage, folderPath);
    const listResult = await listAll(listRef);

    let firstImageUrl = null;
    if (listResult.items.length > 0) {
        const item = listResult.items[0];
        firstImageUrl = await getDownloadURL(item);
    }
    
    return firstImageUrl;
}

async function getImageUrl(ImagePath) {
    const ImageRef = ref(storage, ImagePath);
    ImageUrl = await getDownloadURL(ImageRef)
    
    return ImageUrl;
}

async function uploadImagesToFirebase(userId) {
    try {
        let files = readdirSync('src/public/storage');
        files.sort((a, b) => {
            const aStat = statSync(path.join('src/public/storage', a));
            const bStat = statSync(path.join('src/public/storage', b));
            return bStat.birthtime - aStat.birthtime;
          });
        const file = files[0];
        const filePath = path.join('src/public/storage', String(file));
        const uploadPath = `${userId}/${file}`;
        const extname = path.extname(filePath).toLowerCase();
        if (extname === '.jpg' || extname === '.jpeg') {
            const storageRef = ref(storage, `user-avatar/${uploadPath}`);
            const fileData = readFileSync(filePath);
            await uploadBytes(storageRef, fileData, metadata);
            console.log(`${uploadPath} uploaded successfully.`);
            unlinkSync(filePath);
            console.log(`${filePath} deleted successfully.`);
        } else {
            console.log(`${filePath} is not a JPG image. Skipping upload.`);
            return null;
        }
        return uploadPath;
    } catch (error) {
        console.error("Error uploading files:", error);
    }
  }

class UserController {
    async index(req, res) {
        try {
            let user = await User.findOne({ _id: req.userId });
            if (!user) {
                user = await googleUser.findOne({ _id: req.userId });
            }
            if (!user) {
                return res.status(404).send('User not found');
            }
            res.render('account', {
                showHeader: true,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                successMessage: req.flash('success'),
                errorMessage: req.flash('error'),
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    // Trong UserController
    async update(req, res) {
        try {
            const updatedData = req.body;
            let avatarData;

            // Check if session.provider exists and handle avatar update
            if (!req.session.provider) {
                avatarData = await uploadImagesToFirebase(req.userId);
                if (avatarData) {
                    req.session.avatar = await getImageUrl(`user-avatar/${avatarData}`);
                }
            }

            // Construct the update object based on the presence of avatar data
            const updateFields = {
                name: updatedData.name,
                email: updatedData.email,
                phone: updatedData.phone,
                address: updatedData.address,
            };

            if (avatarData) {
                updateFields.avatar = `user-avatar/${avatarData}`;
            }

            // Update the user document in the User collection
            let user = await User.findByIdAndUpdate(
                req.userId,
                updateFields,
                { new: true }
            );

            // If user not found in User collection, update in googleUser collection
            if (!user) {
                user = await googleUser.findByIdAndUpdate(
                    req.userId,
                    updateFields,
                    { new: true }
                );
            }

            // Handle the case where the user is not found in both collections
            if (!user) {
                return res.status(404).send('User not found');
            }
    
            if (!user) {
                req.flash('error', 'User not found');
                return res.redirect('back');
            }
            req.flash('success', 'Profile updated successfully');
            res.render('account', {
                showHeader: true,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                successMessage: req.flash('success')[0],
                errorMessage: req.flash('error'),
            });
        } catch (err) {
            req.flash('error', 'An error occurred while updating the profile');
            res.redirect('back');
        }
    }    
    password(req, res) {
        res.render('changepassword', {showHeader: true, successMessage: req.flash('success'), errorMessage: req.flash('error') });
    }
    async changePassword(req, res) {
        const { oldpassword, newpassword } = req.body;
        try {
            // Find the user in the database
            let user = await User.findOne({ _id: req.userId });
            if (!user) {
                user = await googleUser.findOne({ _id: req.userId });
            }
            if (!user) {
                return res.status(404).send('User not found');
            }
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
            res.render('yourPosts', { showHeader: true, postData });
        })
        .catch(error => {
            console.error('Error fetching houses from database:', error);
            res.status(500).send('Internal Server Error');
        });
    }
}

module.exports = new UserController();