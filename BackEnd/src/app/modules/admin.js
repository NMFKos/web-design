const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const Admin = new Schema({
    _id: { type: String, length: 8 },
    name: { type: String, min: 10},
    password: { type: String, match: /[a-zA-Z0-9]/ },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

module.exports = mongoose.model('Admin', Admin)