const { ObjectId, Int32 } = require("mongodb");
const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    _id: { type: ObjectId },
    name: { type: String, min: 10},
    password: { type: String },
    email: { type: String },
    address: { type: String },
    phone: { type: String, match: /[0-9]/ },
    role: { type: Number },
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }, { versionKey: false });

module.exports = mongoose.model('User', User)