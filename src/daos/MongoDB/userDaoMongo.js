import usersModel from "./models/user.model.js";

class UserDaoMongo {
    constructor() {
        this.usersModel = usersModel
    }

    get = () => {
        return this.usersModel.find({})
    }

    getBy = (filter) => {
        return this.usersModel.findOne(filter)
    }

    create = (newUser) => {
        return this.usersModel.create(newUser)
    }

    update = (uid, userToUpdate) => {
        return this.usersModel.findByIdAndUpdate({ _id: uid }, userToUpdate, { new: true })
    }

    delete = (uid) => {
        return this.usersModel.findByIdAndUpdate({ _id: uid }, { isActive: false })
    }
}

export default UserDaoMongo