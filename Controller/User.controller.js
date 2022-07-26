const { userModel, userPost } = require("../Model/User.model")
const cloudinary = require("cloudinary")
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
const getLandingPage = (req, res) => {
   userPost.find({},(err,result)=>{
    if(err){
        res.send({ message: "Request fail", status: false })
    }
    else{
        let shuffle = (array) => array.sort(() => Math.random() - 0.5);
        let userPost=shuffle(result)
        res.send({ message: "successfuly", status: true ,userPost})
    }
   })
}
const Signup = (req, res) => {
    const Email = req.body.Email
    userModel.findOne({ Email }, (error, result) => {
        if (error) {
            res.send({ message: "Registration failed", status: false })
        }
        else {
            if (result) {
                res.send({ message: "Email has already been use by another costumer", status: false })
            }
            else {

                let form = new userModel(req.body)
                form.save((error) => {
                    if (error) {
                        res.send({ message: "Registration failed", status: false })

                    } else {
                        userModel.findOne({ Email }, (error, result) => {
                            if (error) {
                                res.send({ message: "Registration failed", status: false })
                            }
                            else {
                                const id = result._id
                                res.send({ message: "Registration succeful", status: true, id })
                            }
                        })
                    }
                })
            }
        }
    })

}
const signIn = (req, res) => {
    const Password = req.body.Password;
    userModel.findOne({ Email: req.body.Email }, (err, user) => {
        if (err) {
            res.send({ message: "unable to signin", status: false })
        }
        else {
            console.log(user)
            user.comparePassword(Password, (err, isMatch) => {
                if (err) {
                    console.log("wrong Email")
                }
                else {
                    if (isMatch) {
                        const id = user._id
                        console.log(isMatch)
                        res.send({ message: "your welcome ", id, status: true },)
                    }
                    else {
                        console.log(isMatch)
                        res.send({ message: "get out of here ", status: false })
                    }
                }
            })
        }
    })
}

const fetchUser = (req, res) => {
    userModel.find({}, (err, result) => {
        if (err) {
            res.send({ message: "Unable to fetch user due to some problem with network", status: false })
        }
        else {
            res.send({ user: result, status: true })
        }
    })
}


const uploadImge = (req, res) => {
    const file = req.body.file
    const id = req.body.id
    cloudinary.v2.uploader.upload(file, (error, result) => {
        if (error) {
            console.log(error)
            res.send({ Bad: "bad", status: false })
        }
        else {
            const ProfilePic = result.secure_url
            userModel.findByIdAndUpdate(id, { ProfilePic }, (err, result) => {
                if (err) {
                    res.send({ Bad: "bad", status: false })
                }
                else {
                    console.log(result + " " + result.ProfilePic)
                    res.send({ good: "good", ProfilePic: result.ProfilePic, status: false })
                }
            })
        }
    });

}
const findOneUser = (req, res) => {
    const id = req.body.id;
    userModel.findById(id, (err, result) => {
        if (err) {
            console.log(err)
            res.send({ message: "error 404", status: false })
        }
        else {
            res.send({ message: "good of you", user: result, status: true })
        }
    })
}

const uploadpost = async (req, res) => {
    console.log("the man of the people")
    let send = await userPost.find({})
    const { imagePost, caption, userId, location, Username, Time } = (req.body);
    let ImageUpload = []
    for (i = 0; i < imagePost.length; i++) {
        let { secure_url } = await cloudinary.v2.uploader.upload(imagePost[i].image, (error, result) => {
            if (error) {
                res.send({message:"post unable to save",status:false})
                return error
            } else {
                return result
            }
        })

        ImageUpload.push({ image: secure_url })
    }

    let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"]
    let TimeStamp = { day: days[Time.day], date: Time.date, Month: Time.month }
    let PostId=send.length+1
    let post = {
        PostId,
        ImageUpload,
        Caption: caption,
        Username,
        TimeStamp,
        Likes: [],
        Comment: [],
        Userid: userId,
        Location:location
    }
    let form = new userPost(post)
    form.save((err,) => {
        if (err) {
            console.log(err)
            res.send({message:"post unable to save",status:false})
        } else {
            let id =userId
             userModel.findOneAndUpdate({id},{$push:{post:PostId}},(err,result)=>{
                if(err){
                    res.send({message:"post unable to save",status:false})
                }else{
                    res.send({message:"post succesfuly",status:true})
                }
             })
        }
    })


}
const userFollowing=(req,res)=>{
    let id=req.body.followUser;
    const followuser = req.body.id
    userModel.findById(id,(err,result)=>{
        if(err){
            res.send({message:"request fail",status:false})
        }else{
            let {Follow}=result
            let find = Follow.filter((val,index)=>val==followuser)
        }
    } )
       userModel.findOneAndUpdate({id},{$push:{Follow: followuser}},(err,result)=>{
                if(err){
                    res.send({message:"request fail",status:false})
                }else{
                    
                }})
}

module.exports = { Signup, signIn, fetchUser, findOneUser, uploadImge, getLandingPage, uploadpost }