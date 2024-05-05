const { ObjectId } = require("mongodb");
const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const Image = new Schema({
    _id: { type: ObjectId },
    post_id: { type: ObjectId },
    url: { type: String }
  });

module.exports = mongoose.model('Image', Image)