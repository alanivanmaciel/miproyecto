import { Schema, model } from "mongoose"

const trasactionsCollection = 'transactions'

const transactionsSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    amount: Number,
    transactionType: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    month: {
        type: String,
        required: true
    },
    // transaction_date: ISOdate,
    created_at: {
        type: Date,
        default: Date.now
    },
    // updated_at: ISOdate,
})

const transactionModel = model(trasactionsCollection, transactionsSchema)

export default transactionModel