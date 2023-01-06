const { Message } = require("../Model/User.model")

const GetAllMessages = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        let Messages = await Message.find({ users: { $all: [from, to] } }).sort({ updateAt: 1 });
        if (Messages) {
            const responseMessage = Messages.map((msg) => {
                return {
                    fromSelf: msg.sender.toString() === from,
                    message: msg.message,
                    time: msg.time
                }
            })
            res.send({ data: responseMessage, status: true })
        } else {
            res.send({ message: "error", status: false })
        }

    } catch (ex) {
        next(ex)
    }
}
const AddMessage = (req, res, next) => {
    try {
        const { From, To, message, time } = req.body
        Message.create({
            message,
            users: [From, To],
            time,
            sender: From
        }, (err, result) => {
            if (err) {
                res.send({ status: false })
            } else {
                res.send({ status: true,data:result})
            }
        })

    } catch (ex) {
        next(ex)
    }
}

module.exports = { GetAllMessages, AddMessage }