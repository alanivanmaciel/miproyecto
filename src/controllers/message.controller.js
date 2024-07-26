import messageModel from "../daos/MongoDB/models/message.models.js";

class MessageController {
    getMessage = async (req, res) => {
        const userLogged = req.user.email

        const getMessages = await messageModel.find()
        const messages = getMessages.map(message => {
            let userMessage
            let classMessage
            if (userLogged === message.user.trim()) {
                userMessage = 'Tu'
                classMessage = 'message sent'
            } else {
                userMessage = message.user.trim()
                classMessage = 'message received'
            }

            return {
                user: userMessage,
                message: message.message,
                hora: message.hora,
                class: classMessage
            }
        })

        res.render("chat", {
            user: userLogged,
            messages
        });
    }
}

export default MessageController