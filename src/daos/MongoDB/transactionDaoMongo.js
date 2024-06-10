import transactionModel from "./models/transactions.models.js";

class transactionDaoMongo {
    constructor() {
        this.transactionModel = transactionModel
    }

    get = () => {
        return this.transactionModel.find({})
    }

    getBy = (filter) => {
        return this.transactionModel.findOne(filter)
    }

    create = (transaction) => {
        return this.transactionModel.create(transaction)
    }
}

export default transactionDaoMongo