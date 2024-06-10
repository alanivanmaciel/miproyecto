class MessageController {
    getMessage = async (req, res) => {
        const user = req.user.email
        
        res.render("chat",{
            user
        });
    }
}

export default MessageController