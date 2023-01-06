const express=require("express")
const Router=express.Router()
const Postcontroller=require("../Controller/Post.controller")
Router.get("/",Postcontroller.getAllPosts)

module.exports=Router