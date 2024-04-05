const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const Image = new Schema({
    house_id: { type: String, length: 8 },
    img_bin: { type: Buffer },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

module.exports = mongoose.model('Image', Image)