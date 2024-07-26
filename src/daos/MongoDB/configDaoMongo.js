import configModel from "./models/config.models.js";

class configDaoMongo {
    constructor() {
        this.configDaoMongo = configModel
    }

    get = () => {
        return this.configDaoMongo.find({})
    }

    find = ({ user, category }) => {        
        const projection = category === 'Ingreso' ? { 'categories.Ingreso': 1 } : { 'categories.Egreso': 1 };
        return this.configDaoMongo.findOne({ user }, projection);
    }

    create = (user) => {
        return this.configDaoMongo.create(user)
    }

    addIngresoCategory = (user, newCategory) => {
        return this.configDaoMongo.findOneAndUpdate(
            { user },
            { $addToSet: { "categories.Ingreso": newCategory } },
            { new: true, upsert: true }
        )
    }

}

export default configDaoMongo