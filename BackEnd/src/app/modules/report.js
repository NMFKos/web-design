const { ObjectId } = require("mongodb");
const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const Report = new Schema({
    _id: { type: ObjectId },
    user_id: { type: String }, // người đi report
    house_id: { type: String }, // bài đăng bị report
    name: { type: String }, // tên người report
    email: { type: String, match: /[a-zA-Z0-9@.]/ }, // email người report
    content: { type: String },
    createdAt: { type: Date, default: Date.now }
  }, { versionKey: false });

module.exports = mongoose.model('Report', Report)