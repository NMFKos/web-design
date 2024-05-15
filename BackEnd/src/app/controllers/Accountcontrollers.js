<<<<<<< HEAD
const User = require('../modules/user')
const Images = require('../modules/image')
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

class UserController {
    index(req, res) {
        User.findOne({ _id: req.params.id }) // Tìm kiếm người dùng theo id từ params
        .then(user => {
            if (!user) {
                throw new Error('User not found');
            }
            // Truyền dữ liệu người dùng tới view 'account'
            res.render('account', {
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
        const id = req.params.id;
        const updatedData = req.body;
        // Update the data in the database
        // Assuming you're using Mongoose to interact with MongoDB
        User.findByIdAndUpdate(id, updatedData, { new: true }, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    }

    async changePassword(req, res) {
        const { oldpassword, newpassword } = req.body;
    
        try {
            // Find the user in the database
            const user = await User.findOne({ _id: req.user._id });
    
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
}

module.exports = new UserController();


=======
const User = require('../modules/user')
const bcrypt = require('bcrypt');
const Images = require('../modules/image')
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

class UserController {
    index(req, res) {
        User.findOne({ _id: 'fe88fc4996855e8d511afc1e' }) // Tìm kiếm người dùng theo id từ params
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
        const id = 'fe88fc4996855e8d511afc1e';
        const updatedData = req.body;
        // Update the data in the database
        // Assuming you're using Mongoose to interact with MongoDB
        User.findByIdAndUpdate(id, updatedData, { new: true }, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    }
    password(req, res) {
        res.render('changepassword', { showHeader: true });
    }
    async changePassword(req, res) {
        const { oldpassword, newpassword } = req.body;
    
        try {
            // Find the user in the database
            const user = await User.findOne({ _id: 'fe88fc4996855e8d511afc1e' });
    
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
}

module.exports = new UserController();


>>>>>>> c6ac1e0eb9374366dbd91556ad5304f8c64c08c3
