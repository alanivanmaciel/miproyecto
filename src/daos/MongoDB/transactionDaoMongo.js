import transactionModel from "./models/transactions.models.js";

class transactionDaoMongo {
    constructor() {
        this.transactionModel = transactionModel
    }

    get = () => {
        return this.transactionModel.find({})
    }

    find = (filter) => {
        return this.transactionModel.find(filter)
    }

    create = (transaction) => {
        return this.transactionModel.create(transaction)
    }

    updateAmount = (data) => {
        const { _id, amount } = data
        return this.transactionModel.findByIdAndUpdate({ _id: _id }, { amount: amount })
    }
}

export default transactionDaoMongo