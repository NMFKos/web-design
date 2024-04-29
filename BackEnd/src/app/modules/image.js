const { ObjectId } = require("mongodb");
const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const Image = new Schema({
    _id: { type: ObjectId },
    house_id: { type: String },
    url: { type: String }
  });

module.exports = mongoose.model('Image', Image)