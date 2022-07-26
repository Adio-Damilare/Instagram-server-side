const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const userSchema =new mongoose.Schema({
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
    Verfied:Boolean
});
const generalPost= new mongoose.Schema({
    PostId:Number,
    Username:String,
    Userid:String,
    ImageUpload:Array,
    Likes:Array,
    Location:String,
    comment:Array,
    TimeStamp:Object,
    Caption:String,
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

module.exports = {userModel,userPost}