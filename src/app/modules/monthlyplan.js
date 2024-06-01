const { ObjectId } = require("mongodb");
const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const Monthlyplan = new Schema({
    _id: { type: ObjectId },
    post_id: { type: ObjectId },
    user_id: { type: ObjectId },
    price: { type: Number },
    type_post: { type: Number },
    createdAt: { type: Date, default: Date.now },
    endAt: { type: Date, default: Date.now }
  }, { versionKey: false });

module.exports = mongoose.model('Monthlyplan', Monthlyplan)