const express = require('express')
var bodyParser = require("body-parser")
const { default: mongoose } = require('mongoose')
const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded(
  {extended:true}
))

mongoose.connect("mongodb+srv://22520209:j7v5sUMUiHyYlTVi@duongdat.2vqpvm2.mongodb.net/test?retryWrites=true&w=majority")
var db = mongoose.connection
db.on('err',()=> console.log("Error in connection to Database"))
db.once('open',()=> console.log("Connected to Database"))

app.post("/signup", async (req, res)=>{
  const data ={
    username:req.body.username,
    password:req.body.password,
    email:req.body.email,
    phone:req.body.phone,
    address:req.body.address
  } 

  db.collection("user").insertOne(data,(err,collection) =>{
    if(err) {
      throw err;
    }
    console.log("Record Inserted Successfully")
  })
  return res.redirect('login.html')
})

app.post("/login",(req,res)=>{
  const login_phone = req.body.phone
  const login_password = req.body.password
  db.collection("user").findOne({phone:login_phone, passwrod:login_password}, function(err,result){
    if(err){
      console.log(err)
    }
    if(result){
      console.log("Login succesfully")
    }
    else{
      console.log("Login failed")
    }

  })
})
app.get("/", (req, res)=>{
  res.get({
    "Allow-acces-Allow-Origin":'*'
  })
  return res.redirect('index.html')
}).listen(3000);

console.log("Listening on port 3000")
