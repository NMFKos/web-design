const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const googleUser = new Schema({
    sub: { type: String },
    name: { type: String, min: 10 },
    password: { type: String },
    email: { type: String },
    address: { type: String, default: "" },
    phone: { type: String, match: /[0-9]/, default: "" },
    role: { type: Number, default: 0 },
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }, { versionKey: false });

module.exports = mongoose.model('google', googleUser)