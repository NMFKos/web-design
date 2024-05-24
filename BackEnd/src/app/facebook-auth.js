const facebookUser = require('./modules/facebook');
const mongoose = require('mongoose');
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

async function getImageUrl(ImagePath) {
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    const ImageRef = ref(storage, ImagePath);
    ImageUrl = await getDownloadURL(ImageRef)
    
    return ImageUrl;
}

const facebookAuthDal = {
    registerWithFacebook: async (req, res, oauthUser) => {
        try {
            let user = await facebookUser.findOne({
                id: oauthUser._id
            });

            if (user) {
                req.session.userId = user._id;
                req.session.username = user.name;
            } else {
                const newUser = new facebookUser({
                    id: oauthUser._id,
                    name: oauthUser.displayName,
                    email: oauthUser.emails ? oauthUser.emails[0].value : null, // Facebook might not provide email
                    role: 0,
                    address: "Việt Nam",
                    phone: '0123456789',
                    avatar: "user-avatar/default-avatar.jpg",
                    provider: "facebook"
                });
                await newUser.save();
                req.session.userId = newUser._id;
                req.session.username = newUser.name;
                req.session.avatar = await getImageUrl(newUser.avatar);
            }

            return { userId: req.session.userId, username: req.session.username, avatar: req.session.avatar };
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    }
};

module.exports = facebookAuthDal;