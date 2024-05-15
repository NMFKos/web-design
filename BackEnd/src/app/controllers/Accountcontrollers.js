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
        // Cập nhật dữ liệu trong cơ sở dữ liệu
        // Giả sử bạn đang sử dụng Mongoose để tương tác với MongoDB
        User.findByIdAndUpdate(id, updatedData, { new: true }, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        });
    }
}

module.exports = new UserController;
