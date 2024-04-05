const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const House = new Schema({
    _id: {type: String, length: 8},
    user_id: { type: String, length: 8 },
    title: { type: String, min: 10},
    price: { type: String },
    description: { type: String },
    address: { type: String, match: /[a-zA-Z0-9]/ },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    number_phone: { type: String, match: /[0-9]/ },
    zalo_contact: { type: String, match: /[0-9]/ }
  });

module.exports = mongoose.model('House', House)