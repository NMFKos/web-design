const Posts = require('../modules/post')
const Monthlyplan = require('../modules/monthlyplan')
const path = require('path');
const mongoose = require('mongoose')
const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytes } = require("firebase/storage");
const { readdirSync, readFileSync, unlinkSync } = require("fs");
const { ObjectId } = require("mongodb");
const PayOS = require("@payos/node");
const payos = new PayOS(
    "681c2b60-b918-415e-ad15-17373d11e649",
    "b459ff64-84d0-41e3-b3d0-318c6342b569",
    "ae8c71191e25837ef79cfca6a2d52b5a47c5227578c20d7d50a59a14bb16ac39"
);

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

async function uploadImagesToFirebase(district, typeHouse, postId) {
  try {
      const files = readdirSync('src/public/storage');
      for (const file of files) {
          const filePath = path.join('src/public/storage', file);
          const uploadPath = `${district}/${typeHouse}/${postId}/${file}`;
          const extname = path.extname(filePath).toLowerCase();
          if (extname === '.jpg' || extname === '.jpeg') {
              const storageRef = ref(storage, `images/${uploadPath}`);
              const fileData = readFileSync(filePath);
              await uploadBytes(storageRef, fileData, metadata);
              console.log(`${uploadPath} uploaded successfully.`);
              unlinkSync(filePath);
              console.log(`${filePath} deleted successfully.`);
          } else {
              console.log(`${filePath} is not a JPG image. Skipping upload.`);
          }
      }
  } catch (error) {
      console.error("Error uploading files:", error);
  }
}

function handler(m_string) {
  const regex = /\d+/;
  if (regex.test(m_string)) {
    let match = m_string.match(regex)[0];
    return `Q${match}`;
  } else {
    let partials = m_string.split(" ");
    partials = partials.slice(-2);
    return partials.join(" ");
  }
}

function slugGen(district, typeHouse, postId) {
  const partials = [district, typeHouse, postId];
  const slug = partials.map(p => 
      p.toLowerCase()
       .normalize('NFD') // Normalize Unicode
       .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
       .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
       .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
  ).join('-');
  return slug;
}

class PostController {
    index(req, res) {
        res.render('post', { showHeader: true });
    }
    postnew(req, res) {
      const payload = req.body;
      const postId = new mongoose.Types.ObjectId();
      const postIdValue = postId.toString();
      const typeHouse = payload['type_house'].replace('Căn hộ', '').trim();
      const district = handler(payload['district']);
      const slugPost = slugGen(payload['district'], payload['type_house'], postIdValue);
      
      req.session.postId = postId;

      const newPosts = new Posts({
          _id: postId,
          user_id: new ObjectId(req.userId),
          title: payload['title'],
          description: payload['description'],
          price: payload['price'],
          address: payload['address'],
          type_house: typeHouse,
          type_post: 0,
          status: 0,
          area: payload['area'],
          slug: slugPost,
          images: `images/${district}/${typeHouse}/${postIdValue}/`
      });
      newPosts.save()
      .then(() => {
          // Đẩy ảnh lên firebase
          uploadImagesToFirebase(district, typeHouse, postIdValue);
          res.redirect('/post/payment')
      })
      .catch(error => {
          console.error('Error:', error);
          res.status(500).send('Internal Server Error');
      });
  }
  async pay(req, res) {
    try {
        const latestPost = await Posts.findOne({ user_id: req.userId }).sort({ createdAt: -1 });
        if (!latestPost) {
            return res.status(404).send('Không tìm thấy bài viết.');
        }
        const payload = req.body;
        const typePost = payload.type_post === "Tin VIP" ? 1 : 0;
        let Price = null;
        let nDays = null;

        if (payload.dayOrmonth === "Đăng theo ngày") {
            Price = parseFloat(payload.time[0].split(" ")) * (2 + 3 * typePost);
            nDays = parseFloat(payload.time[0].split(" "));
        } else if (payload.dayOrmonth === "Đăng theo tuần") {
            Price = parseFloat(payload.time[1].split(" ")) * (13 + 17 * typePost);
            nDays = parseFloat(payload.time[1].split(" ")) * 7;
        } else {
            return res.status(400).send('Thời gian thanh toán không hợp lệ.');
        }

        const newMonthlyplan = new Monthlyplan({
            _id: new mongoose.Types.ObjectId(),
            post_id: new ObjectId(latestPost._id),
            user_id: new ObjectId(req.userId),
            price: Price,
            type_post: typePost,
            endAt: new Date(Date.now() + nDays * 24 * 60 * 60 * 1000)
        });

        await newMonthlyplan.save();
        await Posts.findByIdAndUpdate(latestPost._id, { type_post: typePost }, { new: true });

        const order = {
            amount: 10000,
            description: 'Thanh toán tin đăng',
            orderCode: Math.floor(Math.random() * 10101010),
            returnUrl: 'https://onehouse.onrender.com/post/payment-success',
            cancelUrl: 'https://onehouse.onrender.com/post/payment-failure',
        };

        const paymentLink = await payos.createPaymentLink(order);
        res.redirect(303, paymentLink.checkoutUrl);
    } catch (error) {
        res.status(500).send('Có lỗi xảy ra khi xử lý thanh toán.');
        console.error(error);
    }
  }
  success(req, res) {
    res.redirect('/account/your-posts');
  }
  async cancel(req, res) {
    try {
      const latestPost = await Posts.findOne({ user_id: req.userId }).sort({ createdAt: -1 });
      if (latestPost) {
        await Posts.deleteOne({ _id: latestPost._id });

        const latestMonthlyPlan = await Monthlyplan.findOne({ user_id: req.userId }).sort({ createdAt: -1 });
        if (latestMonthlyPlan) {
          await Monthlyplan.deleteOne({ _id: latestMonthlyPlan._id });
        }
    
        res.redirect('/post');
      } else {
        res.status(404).send('Không tìm thấy bài viết nào để xóa.');
      }
    } catch (error) {
      res.status(500).send('Có lỗi xảy ra khi xóa bài viết hoặc kế hoạch hàng tháng.');
      console.error(error);
    }    
  }
  show(req, res) {
    res.render('payment', { showHeader: true });
  }
}

module.exports = new PostController;