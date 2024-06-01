const Posts = require('../modules/post')
const Users = require('../modules/user')
const googleUser = require('../modules/google')
const mongoose = require('mongoose')
const { initializeApp } = require("firebase/app");
const { getStorage, ref, getDownloadURL, listAll } = require("firebase/storage");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'onehousecompany@gmail.com',
        pass: 'rdav eviw rpak fnxb'
    }
});

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

function handler(m_string, regex) {
    const match = m_string.match(regex);
    if(!match) {
        return [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
    }

    if (match.length === 2) {
        return match;
    }
    else if (match.length === 1) {
        return [match[0], Number.MAX_SAFE_INTEGER]
    }
}

class SiteController {
    index(req, res) {
        Posts.find({ status: 1 }).sort({ type_post: -1 }).exec()
        .then(async posts => {
            if (!posts) {
                throw new Error('404 Not found');
            }
            const postData = posts.slice(0, 20).map(p => p.toObject());
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
        let houseRegex = null;
        if (house === "Phòng trọ, nhà trọ") {
            houseRegex = /[a-zA-Z]+/g;
        }
        else {
            houseRegex = new RegExp(`\\b${house}\\b`, 'i');
        }
        const district = payload['district'];
        let districtRegex = null;
        if (district === "TP. Hồ Chí Minh") {
            districtRegex = /[a-zA-Z]+/g;
        }
        else {
            districtRegex = new RegExp(`\\b${district}\\b`, 'i');
        }

        const matchArea = handler(payload['area'], /\d+(?=m2)/g);
        let minArea = matchArea[0];
        let maxArea = matchArea[1];

        const matchPrice = handler(payload['price'], /\d+/g);
        let minPrice = matchPrice[0];
        let maxPrice = matchPrice[1];

        // console.error(
        //     `price: { $gte: ${minPrice}, $lte: ${maxPrice} },
        //     area: { $gte: ${minArea}, $lte: ${maxArea} },
        //     address: { $regex: ${districtRegex} },
        //     type_house: { $regex: ${houseRegex} }`);

        Posts.find({ 
            price: { $gte: minPrice, $lte: maxPrice },
            area: { $gte: minArea, $lte: maxArea },
            address: { $regex: districtRegex },
            type_house: { $regex: houseRegex }
         })
        .then(async posts => {
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
        res.render('servicePriceList', { showHeader: true });
    }
    
    login(req, res) {
        const payload = req.body;
        // sign up
        if (Object.keys(payload).length === 5) {
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
                        // Clear the session and redirect back
                        req.session.destroy(err => {
                            if (err) {
                                console.error('Error destroying session:', err);
                                // If there's an error destroying the session, still redirect back
                            }
                            return res.redirect('back');
                        });
                        return; // Ensure no further code is executed after redirect
                    }
        
                    // Save user details in the session
                    req.session.userId = user._id;
                    req.session.username = user.name;
                    req.session.avatar = await getImageUrl(user.avatar);
                    
                    // Redirect based on user role
                    if (user.role === 0) {
                        return res.redirect('/');
                    } else {
                        req.session.adminUser = true;
                        return res.redirect('/admin');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    return res.status(500).send('Internal Server Error');
                });
        } else {
            return res.redirect('/dang-nhap');
        }        
    }

    showLogin(req, res) {
        res.render('login', { showHeader: false });
    }

    logout(req, res) {
        req.session.destroy();
        res.redirect('/');
    }

    async googleAuth(req, res, profile) {
        try {
            let user = await googleUser.findOne({ sub: profile._json.sub });
    
            if (!user) {
                const newUser = new googleUser({
                    _id: new mongoose.Types.ObjectId(),
                    sub: profile._json.sub,
                    name: profile._json.name,
                    password: "onehouse",
                    email: profile._json.email,
                    avatar: profile._json.picture
                });
                await newUser.save();
                // Assign the newly created user to the `user` variable
                user = newUser;
            }
    
            // Save user ID and other details to the session
            req.session.userId = user._id;
            req.session.username = user.name;
            req.session.avatar = user.avatar;
            req.session.provider = true;
    
            // Redirect to the home page or any other desired page
            res.redirect('/');
        } catch (error) {
            console.error("Error during authentication:", error);
            res.status(500).send("Internal Server Error");
        }
    }
    showForgot(req, res) {
        res.render('emailVerify');
    }
    async forgot(req, res) {
        // Send OTP
        if (!req.body.otp) {
            try {
                req.session.otp = Math.floor(1000 + Math.random() * 9000).toString();
                req.session.emailVerify = req.body.email;
                await transporter.sendMail({
                    from: "cuongnguyen462196@gmail.com",
                    to: req.session.emailVerify,
                    subject: "Mã xác thực quên mật khẩu OneHouse",
                    html: `<b>Mã xác thực của bạn ${req.session.otp}</b>`,
                  })
                res.render('emailVerify', { email: req.session.emailVerify });
            } catch (error) {
                res.send(error);
            }
        }
        // Verify OTP
        else if (req.body.otp) {
            try {
                if (req.body.otp === req.session.otp) {
                    res.redirect('/reset-password');
                }
                else {
                    res.redirect('back');
                }
            } catch (error) {
                console.error(error);
                res.send("Lỗi khi xác thực mật khẩu")
            }
        }
        else {
            res.render('emailVerify');
        }
    }
    showReset(req, res) {
        res.render('resetpassword');
    }
    async reset(req, res) {
        const { password, passwordAuth } = req.body;
        if (password !== passwordAuth) {
            res.redirect('/reset-password');
        } else {
            const emailVerify = req.session.emailVerify;
            try {
                if (!emailVerify) {
                    return res.status(400).send('Email verification is required');
                }

                let user = await Users.findOne({ email: emailVerify });
                if (!user) {
                    return res.status(404).send('User not found');
                }

                if (!password) {
                    return res.status(400).send('Password is required');
                }
                user.password = password;

                await user.save();
                res.redirect('/dang-nhap');
            } catch (error) {
                console.error('Error updating password:', error);
                res.status(500).send('Internal Server Error');
            }
        }
    }
}

module.exports = new SiteController;