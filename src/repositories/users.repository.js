import UserDaoMongo from "../daos/MongoDB/userDaoMongo.js"
import { UserDtoCreate } from "../dto/userDto.js"

class UserService {
    constructor(userDao) {
        this.dao = new UserDaoMongo()
    }

    getUsers = async () => await this.dao.get()
    getUser = async (filter) => await this.dao.getBy(filter)
    createUser = async (newUser) => {
        const newUserDto = new UserDtoCreate(newUser)
        return await this.dao.create(newUserDto)
    }
    updateUser = async (uid, userToUpdate) => await this.dao.update(uid, userToUpdate)
    deleteUser = async (uid) => await this.dao.delete(uid)
}

export default UserService