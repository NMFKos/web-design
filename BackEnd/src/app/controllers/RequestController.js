const Post = require('../modules/post');
const User = require("../modules/user");
const mongoose = require('mongoose');
const { initializeApp } = require('firebase/app');
const {getStorage, ref, getDownloadURL, listAll} = require('firebase/storage');



const firebaseConfig = {
    apiKey: "AIzaSyDF36H8mFiTkXTyvRD6z-4YHmqsNCZ4yxE",
    authDomain: "images-a66c0.firebaseapp.com",
    projectId: "images-a66c0",
    storageBucket: "images-a66c0.appspot.com",
    messagingSenderId: "1081654025998",
    appId: "1:1081654025998:web:7515c882788d914a3c415f",
    measurementId: "G-Z6TTKT1H0N"
};


class RequestController
{
    
}