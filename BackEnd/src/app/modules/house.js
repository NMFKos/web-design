const { ObjectId } = require("mongodb");
const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const House = new Schema({
    _id: { type: ObjectId },
    user_id: { type: String },
    title: { type: String },
    price: { type: Number },
    description: { type: String },
    address: { type: String },
    area: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

module.exports = mongoose.model('House', House)