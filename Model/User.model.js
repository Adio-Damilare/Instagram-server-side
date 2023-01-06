const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const userSchema = new mongoose.Schema({
    Fullname: String,
    Username: String,
    Email: String,
    Password: String,
    ProfilePic:String,
    post:Array,
    PhoneNumber: Number,
    Birthday: Object,
    Friends:Array,
    Follow:Array,
    Verified:{
        token:0,
        verify:false
    },
});
const generalPost= new mongoose.Schema({
    Username:String,
    Userid:String,
    ImageUpload:Array,
    Likes:Object,
    Location:String,
    comment:Array,
    Time:String,
    Caption:String,
})

const MessageSchema=new mongoose.Schema({
    message:{
            type:String,
            required:true
    },
    users:{
        type:Array,
        required:true
    },
    sender:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const salt = 10
userSchema.pre("save",  function(next){
    bcrypt.hash(this.Password, salt, (hashError, hash) => {
        if (hashError) {
            return next(hashError)
        }
        else {
            this.Password = hash
            this.ProfilePic=this.Fullname.slice(0,1)
            console.log(this.ProfilePic)
            next()
        }
    })
})
userSchema.methods.comparePassword=function(candidatePassword,cb){
        bcrypt.compare(candidatePassword,this.Password, function(err,isMatch){
            if(err){
                return cb(err)
            }
            else{
                cb(null,isMatch)
            }
        })
    }
const userPost= mongoose.model("user_post",generalPost)
const userModel =mongoose.model("My_tb",userSchema)
const Message=mongoose.model("messages",MessageSchema)
module.exports = {userModel,userPost,Message}

