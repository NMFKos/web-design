const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const House = new Schema({
    title: { type: String, min: 10},
    description: { type: String, min: 50 },
    character: { type: Array, min: 2 },
    address: { type: String, match: /[a-zA-Z0-9]/ },
    phone: { type: Number, match: /[0-9]/ },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    zalo_contact: { type: Number, min: 10 }
  });

module.exports = mongoose.model('House', House)