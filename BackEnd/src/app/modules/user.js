const { ObjectId } = require("mongodb");
const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    _id: { type: ObjectId },
    name: { type: String, min: 10},
    password: { type: String, match: /[a-zA-Z0-9]/ },
    email: { type: String, match: /[a-zA-Z0-9@.]/ },
    address: { type: String, match: /[a-zA-Z0-9]/ },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    number_phone: { type: String, match: /[0-9]/ },
    zalo_contact: { type: String, match: /[0-9]/ }
  });

module.exports = mongoose.model('User', User)