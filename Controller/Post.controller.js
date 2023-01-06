const { userModel, userPost } = require("../Model/User.model")


const getAllPosts = (req, res) => {
    userPost.find({}, (err, result) => {
        if (err) {
            console.log("error")
            res.send({ message: "Request fail", status: false })
        }
        else {
            let shuffle = (array) => array.sort(() => Math.random() - 0.5);
            let userPost = shuffle(result)
            res.send({ message: "successfuly", status: true, userPost })
        }
    })
}

module.exports ={getAllPosts}