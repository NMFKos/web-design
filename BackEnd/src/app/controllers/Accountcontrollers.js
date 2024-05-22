const User = require('../modules/user')
const Posts = require('../modules/post')
const path = require('path');
const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytes, listAll, getDownloadURL} = require("firebase/storage");
const { readdirSync, readFileSync, unlinkSync } = require("fs");

const firebaseConfig = {
    apiKey: "AIzaSyDF36H8mFiTkXTyvRD6z-4YHmqsNCZ4yxE",
    authDomain: "images-a66c0.firebaseapp.com",
    projectId: "images-a66c0",
    storageBucket: "images-a66c0.appspot.com",
    messagingSenderId: "1081654025998",
    appId: "1:1081654025998:web:7515c882788d914a3c415f",
    measurementId: "G-Z6TTKT1H0N"
};

// Initialize Firebase
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

async function getImageUrl(imagePath) {
    try {
        const storageRef = ref(storage, imagePath);
        const imageUrl = await getDownloadURL(storageRef);
        console.log(imageUrl);
        return imageUrl;
    } catch (error) {
        console.error('Error getting image URL:', error);
        throw error;
    }
}

async function uploadLatestAvatarImage(userId) {
    try {
        const dirPath = 'src/public/avatar';
        const files = readdirSync(dirPath);

        if (files.length === 0) {
            console.log('No files found in the directory.');
            return;
        }

        // Lấy file mới nhất
        const latestFile = files
            .map(file => ({ file, time: statSync(path.join(dirPath, file)).mtime }))
            .sort((a, b) => b.time - a.time)[0].file;

        const filePath = path.join(dirPath, latestFile);
        const uploadPath = `user-avatar/${userId}/${latestFile}`;
        const extname = path.extname(filePath).toLowerCase();

        if (extname === '.jpg' || extname === '.jpeg') {
            const storageRef = ref(storage, uploadPath);
            const fileData = readFileSync(filePath);
            await uploadBytes(storageRef, fileData, metadata);
            console.log(`${uploadPath} uploaded successfully.`);
            //unlinkSync(filePath);
            console.log(`${filePath} deleted successfully.`);
        } else {
            console.log(`${filePath} is not a JPG image. Skipping upload.`);
        }

        return uploadPath;
    } catch (error) {
        console.error('Error uploading the file:', error);
    }
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
            .then(async result => {
                // const avatarPath = uploadLatestAvatarImage(id);
                // req.session.avatar = await getImageUrl(avatarPath);
                res.redirect('/account');
            })
            .catch(err => {
                res.send(err);
            });
    }
    password(req, res) {
        res.render('changepassword', { showHeader: true });
    }
    async changePassword(req, res) {
        const { oldpassword, newpassword } = req.body;
        try {
            // Find the user in the database
            const user = await User.findOne({ _id: req.userId });
            // Check if the old password is correct
            if (oldpassword !== user.password) {
                return res.status(400).send('Incorrect old password');
            }
            // Update the password in the database
            user.password = newpassword;
            await user.save();
    
            res.send('Password updated successfully');
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


