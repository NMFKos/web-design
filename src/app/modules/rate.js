const { ObjectId } = require("mongodb");
const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const Rates = new Schema({
    _id: { type: ObjectId },
    post_id: { type: ObjectId },
    user_id: { type: ObjectId },
    username: { type: String },
    rate: { type: Number },
    comment: { type: String },
    time: { type: Date, default: Date.now }
  }, { versionKey: false });

module.exports = mongoose.model('Rates', Rates)