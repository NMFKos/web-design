const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const Admin = new Schema({
    name: { type: String, min: 1},
    password: { type: String, match: /[a-zA-Z0-9]/ },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

module.exports = mongoose.model('Admin', Admin)