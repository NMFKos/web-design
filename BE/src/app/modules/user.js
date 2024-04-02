const { mongoose } = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    name: { type: String, min: 1},
    password: { type: String, match: /[a-zA-Z0-9]/ },
    address: { type: String, match: /[a-zA-Z0-9]/ },
    phone: { type: String, match: /[0-9]/ },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    house_id: { type: String, default: 'None' },
    zalo_contact: { type: Number, match: /[0-9]/ }
  });

module.exports = mongoose.model('User', User)