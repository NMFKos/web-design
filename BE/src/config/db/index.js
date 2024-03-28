const { mongoose } = require("mongoose");
const url = 'mongodb+srv://22520174:nochance_onehousedev@onehouse.k8at76m.mongodb.net/?retryWrites=true&w=majority&appName=Onehouse'

async function connect() {
  try {
    await mongoose.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    console.log("Connect Successfully")
  } catch (error) {
    console.log(error)
  }
}

module.exports = { connect }