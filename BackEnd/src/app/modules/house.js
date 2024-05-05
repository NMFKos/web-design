const { ObjectId } = require("mongodb");
const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const House = new Schema({
    _id: { type: ObjectId },
    user_id: { type: ObjectId },
    title: { type: String, min: 10},
    price: { type: String },
    description: { type: String },
    address: { type: String, match: /[a-zA-Z0-9]/ },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    number_phone: { type: String, match: /[0-9]/ },
    zalo_contact: { type: String, match: /[0-9]/ }
  });

module.exports = mongoose.model('House', House)