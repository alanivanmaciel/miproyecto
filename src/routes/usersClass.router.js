import RouterClass from "./router.js";

class UserRouter extends RouterClass {
    intit() {
        this.get('/', ['ADMIN'],async (req, res) => {
            try {
                res.sendSuccess('Get Users')
            } catch (error) {
                res.sendServerError(error.message)
            }
        })
    }
}

export default UserRouter