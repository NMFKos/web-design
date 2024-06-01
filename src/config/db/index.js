const { mongoose } = require("mongoose");

async function connect() {
  try {
    await mongoose.connect('mongodb+srv://22520731:rbwZaEfYppuV0z4r@onehouse.midi87p.mongodb.net/onehouse_dev?retryWrites=true&w=majority&appName=OneHouse') 
    console.log('Connection Successfully')   
  } catch (error) {
    console.log(error)
  }
}

module.exports = { connect }
