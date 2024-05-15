const { Int32 } = require("mongodb")
const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://22520209:j7v5sUMUiHyYlTVi@duongdat.2vqpvm2.mongodb.net/test?retryWrites=true&w=majority")

const LoginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    address:{
        type: String,
        require: true
    },
    phone:{
        type: Number,
        required: true
    }

})

const collection = new mongoose.model("Collection1", LoginSchema)

module.exports=collection