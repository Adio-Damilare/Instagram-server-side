const express = require("express");
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const socket = require("socket.io")
require("dotenv").config()
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }))
app.use(cors())
const UserRoute = require("./Routes/User.Routes")
const PostRoute = require("./Routes/Post.route")
const Message = require("./Routes/Message.route")
const URI = process.env.URI
mongoose.connect(URI, (err) => {
    if (err) {
        console.log(err.message + "error from connection")
    }
    else {
        console.log("connect successful")
    }
})
app.use("/user", UserRoute)
app.use("/post", PostRoute)
app.use("/message", Message)
const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    console.log(`App is listening at port ${PORT}`)
})
const io = socket(server, {
    cors: {
        credentials: true
    }
})


global.onlineUser = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;

    socket.on("add-user", (userId) => {
        onlineUser.set(userId, socket.id)
    })

    socket.on("check-online", (data, response) => {
        let online = onlineUser.has(data);
        if (online) {
            response({
                status: true,
            })
        } else {
            response({
                status: false,
            })

        }
    })


    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUser.get(data.To);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", (data) => {

            })
        }
    })
    socket.on("disconn", (reason) => {
        onlineUser.delete(reason);
        console.log(onlineUser)
        console.log(reason + "disconnect")
    })

    socket.on("disconnect", (reason) => {
        console.log(reason.id+" "+ "disconnect")
    })

})