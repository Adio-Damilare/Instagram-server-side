const express =require("express");
const app =express()
const cors=require("cors")
const mongoose =require("mongoose")
const bodyParser=require("body-parser")
require("dotenv").config()
app.use(bodyParser.urlencoded({extended:true,limit:"50mb"}));
app.use(bodyParser.json({limit:"50mb"}))
app.use(cors())
const userModel=require("./Model/User.model")
const UserRoute=require("./Routes/User.Routes")
const URI=process.env.URI
mongoose.connect(URI,(err)=>{
    if(err){
        console.log("error from connection")
    }
    else{
        console.log("connect successful")
    }
})
app.use("/user",UserRoute)
app.get("/",(req,res)=>{
    res.send("Hello  Damilare from Gambari ")
})
const PORT=process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`App is listening at port ${PORT}`)
})