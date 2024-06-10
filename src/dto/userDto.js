class UserDtoCreate {
    constructor(user) {
        this.fullname = `${user.firstname} ${user.lastname}`,
            this.firstname = user.firstname,
            this.lastname = user.lastname,
            this.email = user.email,
            this.password = user.password,
            this.age = user.age,
            this.imgProfile = user.imgProfile
    }
}

class UserDtoGet {
    constructor(user) {
        this.fullname = `${user.firstname} ${user.lastname}`,
            this.email = user.email,
            this.role = user.role
    }
}

export { UserDtoCreate, UserDtoGet }