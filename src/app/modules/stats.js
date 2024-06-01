const { ObjectId} = require("mongodb");
const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const Stats = new Schema({
    _id: { type: ObjectId},
    year: { type: String },
    profits: { type: String },
    accesses: { type: String },
    searchs: { type: String },
  });

module.exports = mongoose.model('Stats', Stats)