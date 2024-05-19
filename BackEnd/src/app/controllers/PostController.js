const Posts = require('../modules/post')
const path = require('path');
const mongoose = require('mongoose')
const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytes } = require("firebase/storage");
const { readdirSync, readFileSync, unlinkSync } = require("fs");
const { ObjectId } = require("mongodb");

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
    const match = m_string.match(regex)[0];
    return `Q${match}`;
  } else {
    const partials = m_string.split(" ");
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
          res.redirect('/account/your-posts')
      })
      .catch(error => {
          console.error('Error:', error);
          res.status(500).send('Internal Server Error');
      });
  }
}

module.exports = new PostController;