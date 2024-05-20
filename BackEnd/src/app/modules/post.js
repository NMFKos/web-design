const { ObjectId, Double, Int32 } = require("mongodb");
const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const Post = new Schema({
    _id: { type: ObjectId },
    user_id: { type: ObjectId },
    title: { type: String },
    description: { type: String },
    price: { type: Number },
    address: { type: String },
    type_house: { type: String },
    type_post: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    endAt: { type: Date, default: Date.now },
    status: {type: Number},
    area: {type: Number},
    slug: { type: String },
    images: {type: String}
  }, { versionKey: false });

module.exports = mongoose.model('Post', Post)