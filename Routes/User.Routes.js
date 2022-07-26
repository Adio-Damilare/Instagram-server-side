const express=require("express")
const Router=express.Router()
const UserController=require("../Controller/User.controller")
Router.post("/",UserController.Signup)
Router.post("/signin",UserController.signIn)
Router.get("/fetchuser",UserController.fetchUser)
Router.get("/home",UserController.getLandingPage)
Router.post("/findoneuser",UserController.findOneUser)
Router.post("/uploadimage",UserController.uploadImge)
Router.post("/uploadpost",UserController.uploadpost)

module.exports=Router