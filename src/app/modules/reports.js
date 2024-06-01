const { ObjectId } = require("mongodb");
const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const Reports = new Schema({
    _id: { type: ObjectId },
    post_id: { type: ObjectId }, // bài đăng bị report
    user_id: { type: ObjectId }, // người đi report
    username: { type: String },
    comment: { type: String },
    state: { type: Number, default: 0 }, // 0 là chờ duyệt, 1 là được duyệt
    time: { type: Date, default: Date.now }
  }, { versionKey: false });

module.exports = mongoose.model('Reports', Reports)