const Posts = require('../modules/post')
const Users = require('../modules/user')
const googleUser = require('../modules/google')
const mongoose = require('mongoose')
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

async function getImageUrl(ImagePath) {
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    const ImageRef = ref(storage, ImagePath);
    ImageUrl = await getDownloadURL(ImageRef)
    
    return ImageUrl;
}

class SiteController {
    index(req, res) {
        Posts.find({}).sort({ type_post: -1 }).exec()
        .then(async posts => {
            if (!posts) {
                throw new Error('404 Not found');
            }
            const postData = posts.slice(0, 11).map(p => p.toObject());
            for (const post of postData) {
                const folderPath = post.images;
                const imagesData = await getFirstImageUrl(folderPath);
                post.thumbnailData = imagesData;
            }
            res.render('home', { showHeader: true, postData });
        })
        .catch(error => {
            console.error('Error fetching houses from database:', error);
            res.status(500).send('Internal Server Error');
        });
    }

    filter(req, res, type_house) {
        Posts.find({ type_house }).exec()
        .then(async posts => {
            if (posts.length === 0) {
                throw new Error('404 Not found');
            }
            const postData = posts.slice(1, 10).map(p => p.toObject());
            for (const post of postData) {
                const folderPath = post.images;
                const imagesData = await getFirstImageUrl(folderPath);
                post.thumbnailData = imagesData;
            }
            res.render('home', { showHeader: true, postData });
        })
        .catch(error => {
            console.error('Error fetching houses from database:', error);
            res.status(500).send('Internal Server Error');
        });
    }

    search(req, res) {
        const payload = req.body;
        const house = payload['typeHouse'].replace('Căn hộ', '').trim();
        const district = payload['district'];
        const districtRegex = new RegExp(`\\b${district}\\b`, 'i');

        const matchArea = handler(payload['area'], /\d+(?=m2)/g);
        let minArea = matchArea[0];
        let maxArea = matchArea[1];

        const matchPrice = handler(payload['price'], /\d+/g);
        let minPrice = null;
        let maxPrice = null;
        if (matchPrice.length === 2) {
            minPrice = matchPrice[0];
            maxPrice = matchPrice[1];
        }
        else if (matchPrice.length === 1) {
            minPrice = matchPrice[0];
            maxPrice = 100;
        }

        Posts.find({ 
            price: { $gte: minPrice, $lte: maxPrice },
            area: { $gte: minArea, $lte: maxArea },
            address: { $regex: districtRegex },
            type_house: house
         })
        .then(async posts => {
            if (posts.length === 0) {
                throw new Error('404 Not found');
            }
            const postData = posts.map(p => p.toObject());
            for (const post of postData) {
                const folderPath = post.images;
                const imagesData = await getFirstImageUrl(folderPath);
                post.thumbnailData = imagesData;
            }
            res.render('home', { showHeader: true, postData });
        })
        .catch(error => {
            console.error('Error fetching houses from database:', error);
            res.status(500).send('Internal Server Error');
        });
        
    }

    showPriceList(req, res) {
        res.render('banggia', { showHeader: true });
    }
    
    login(req, res) {
        const payload = req.body;
        // sign up
        if (Object.keys(payload).length === 6) {
            if (payload['password'] !== payload['password-auth']) {
                res.redirect('/dang-nhap');
            } else {
                const newUsers = new Users({
                    _id: new mongoose.Types.ObjectId(),
                    name: payload['name'],
                    password: payload['password'],
                    email: payload['email'],
                    address: "Việt Nam",
                    phone: payload['phone'],
                    role: 0,
                    avatar: "user-avatar/default-avatar.jpg"
                });
                newUsers.save()
                    .then(() => {
                        res.redirect('/dang-nhap');
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        res.status(500).send('Internal Server Error');
                    });
            }
        }        
        // sign in
        else if (Object.keys(payload).length === 2) {
            Users.findOne({ phone: payload['phone'], password: payload['password'] })
            .then(async user => {
                if (!user) {
                    res.redirect('/dang-nhap');
                }
                // Lưu ID người dùng vào session
                req.session.userId = user._id;
                req.session.username = user.name;
                req.session.avatar = await getImageUrl(user.avatar);
                if (user.role === 0) {
                    res.redirect('/');
                }
                else {
                    res.redirect('/admin');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                res.status(500).send('Internal Server Error');
            });
        }
        // error
        else {
            res.send('Error');
        }
    }

    showLogin(req, res) {
        res.render('login', { showHeader: false });
    }

    logout(req, res) {
        req.session.destroy();
        res.redirect('/');
    }
}

module.exports = new SiteController;
