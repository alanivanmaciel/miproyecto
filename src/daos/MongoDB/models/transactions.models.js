import { Schema, model } from "mongoose"

const trasactionsCollection = 'transactions'

const transactionsSchema = new Schema({
    user_id: ObjectId,
    amount: Number,
    transaction_type: String,
    category: String,
    description: String,
    month: String,
    transaction_date: ISOdate,
    created_at: ISOdate,
    updated_at: ISOdate,
})

const transactionModel = model(trasactionsCollection, transactionsSchema)

export default transactionModel