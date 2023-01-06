const express=require("express")
const Router=express.Router()
const UserController=require("../Controller/User.controller")
Router.post("/",UserController.Signup)
Router.post("/signin",UserController.signIn)
Router.get("/fetchuser",UserController.fetchUser)
Router.post("/findoneuser",UserController.findOneUser)
Router.post("/uploadimage",UserController.uploadImge)
Router.post("/uploadpost",UserController.uploadpost)
Router.post("/follow",UserController.userFollowing)
Router.post("/like",UserController.likes)
Router.get("/token",UserController.FetchCurrentUser);
Router.post("/comment",UserController.CommentOnPost)



module.exports=Router