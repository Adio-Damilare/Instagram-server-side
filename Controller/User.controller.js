const { userModel, userPost } = require("../Model/User.model")
const cloudinary = require("cloudinary")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


const SigninJwt = (e) => {
    let token = jwt.sign({ ...e }, `${process.env.JWT_SECRET}`, { expiresIn: "5h" })
    return token
}



const Signup = async (req, res) => {
    const Email = req.body.Email;

    userModel.findOne({ Email }, (error, result) => {
        if (error) {
            res.send({ message: "Registration failed", status: false })
        }
        else {
            if (result) {
                res.send({ message: "Email has already been  vused", status: false })
            }
            else {
                let form = new userModel(req.body)
                form.save((error) => {
                    if (error) {
                        res.send({ message: "Registration failed", status: false })

                    } else {
                        res.send({ message: "Registration succeful", status: true, })
                    }
                })
            }
        }
    })
}
const signIn = async (req, res) => {
    const Password = req.body.Password;
    userModel.findOne({ Email: req.body.Email }, (err, user) => {
        if (err) {
            res.send({ message: "unable to signin", status: false })
        }
        else {
            if (user !== null) {
                user.comparePassword(Password, (err, isMatch) => {
                    if (err) {
                        res.send({ message: "Wrong email or password", status: false })
                    }
                    else {
                        if (isMatch) {
                            delete user.Password
                            let token = SigninJwt(user);
                            res.send({ message: "your welcome ", token, status: true },)
                        }
                        else {
                            console.log(isMatch)
                            res.send({ message: "get out of here ", status: false })
                        }
                    }
                })
            }
            else {
                res.send({ message: "Wrong email or password", status: false })

            }
        }
    })
}


const FetchCurrentUser = (req, res, next) => {
    try {
        let token = (req?.headers?.authorization?.split(" ")[1])
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, result) => {
            if (err) {
                res.send({ message: err.message, status: false })
            }
            else {
                userModel.findById(result._doc._id, (err, salt) => {
                    if (err) {
                        console.log(err)
                        res.send({ message: "error 404", status: false })
                    }
                    else {
                        res.send({ message: "good of you", user: salt, status: true })
                    }
                })
            }
        })
    } catch (ex) {
        next(ex)
    }
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
            console.log(error.message)
            res.send({ Bad: "bad", status: false })
        }
        else {
            const ProfilePic = result.secure_url
            userModel.findByIdAndUpdate(id, { ProfilePic }, (err, result) => {
                if (err) {
                    res.send({ Bad: "bad", status: false })
                }
                else {
                    console.log("done")
                    res.send({ good: "good", ProfilePic, status: true })
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
    const { imagePost, caption, userId, location, Username, Time } = (req.body);
    let ImageUpload = [];
    for (i = 0; i < imagePost.length; i++) {
        let { secure_url } = await cloudinary.v2.uploader.upload(imagePost[i].image, (error, result) => {
            if (error) {
                res.send({ message: "post unable to save", status: false })
                return error
            } else {
                return result
            }
        })
        ImageUpload.push({ image: secure_url })
    }
    let Likes = { NumberOfLike: 0, people: [] }
    let post = {
        ImageUpload,
        Caption: caption,
        Username,
        Time,
        Likes,
        Comment: [],
        Userid: userId,
        Location: location
    }
    userPost.create(post, (err, salt) => {
        if (err) {
            console.log(err.message)
            res.send({ message: "post unable to save3", status: false })
        } else {
            let id = userId
            userModel.findOneAndUpdate({ _id: id }, { $push: { post: salt._id } }, (err, result) => {
                if (err) {
                    res.send({ message: "post unable to save", status: false })
                } else {
                    res.send({ message: "post succesfuly", postId: salt._id, status: true })
                }
            })
        }
    })


}
const userFollowing = (req, res) => {
    let { userToFollow, currentUserId } = req.body

    userModel.findOneAndUpdate({ _id: userToFollow }, { $push: { Follow: currentUserId } }, (err, result) => {
        if (err) {
            res.send({ message: "request fail", status: false })
        } else {
            userModel.findOneAndUpdate({ _id: currentUserId }, { $push: { Friends: userToFollow } }, (err, salt) => {
                if (err) {
                    res.send({ message: "request fail", status: false })
                } else {
                    res.send({ message: "successful", status: true })
                }
            })
        }
    })
    //   
}
const likes = (req, res) => {
    let { postId, UserId } = req.body
    console.log("i don lAND")
    userPost.findOneAndUpdate({ _id: postId }, { $inc: { "Likes.NumberOfLike": +1 }, $push: { "Likes.people": UserId } }, (err, result) => {
        if (err) {
            res.send({ message: "request fail", status: false })
        } else {
            res.send({ message: "successful", status: true })
        }
    })
}

const CommentOnPost = (req, res, next) => {
    try {

        const { postId, comment } = req.body;
        userPost.findOneAndUpdate({ _id: postId }, {
            $push: {
                Comment: comment
            }
        },(err,result)=>{
            if(err){
                res.send({ message: "request fail", status: false })
            }else{
                res.send({ message: "successful", status: true })   
            }
        })


    } catch (ex) {
        next(ex)
    }
}

module.exports = {CommentOnPost, Signup, signIn, fetchUser, FetchCurrentUser, findOneUser, uploadImge, uploadpost, userFollowing, likes }