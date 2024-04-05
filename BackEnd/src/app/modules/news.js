const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const News = new Schema({
    title: { type: String, min: 10},
    description: { type: String, min: 50 },
    content: { type: String, min: 500 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

module.exports = mongoose.model('News', News)