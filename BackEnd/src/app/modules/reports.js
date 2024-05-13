const { ObjectId } = require("mongodb");
const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const Reports = new Schema({
    _id: { type: ObjectId },
    post_id: { type: ObjectId },
    user_id: { type: String }, // người đi report
    user_name: { type: String }, // bài đăng bị report
    reason: {type: String},
    state: {type: String},
    time: { type: Date, default: Date.now }
  });

module.exports = mongoose.model('Reports', Reports)