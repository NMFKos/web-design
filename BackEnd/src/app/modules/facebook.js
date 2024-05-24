const { ObjectId, Int32 } = require("mongodb");
const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const facebookUser = new Schema({
    id: { type: Number },
    name: { type: String, min: 10},
    email: { type: String },
    address: { type: String },
    phone: { type: String, match: /[0-9]/ },
    provider: { type: String },
    role: { type: Number },
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }, { versionKey: false });

module.exports = mongoose.model('facebookUser', facebookUser)