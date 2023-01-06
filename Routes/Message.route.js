const express=require("express")
const Router=express.Router();
const MessageController=require("../Controller/Message.controller");
Router.post("/",MessageController.GetAllMessages);
Router.post("/addmessage",MessageController.AddMessage)

module.exports=Router