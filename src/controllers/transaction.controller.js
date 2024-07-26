import transactionDaoMongo from "../daos/MongoDB/transactionDaoMongo.js";
import { format } from 'date-fns'

const transactionDao = new transactionDaoMongo()

class TransactionController {
    constructor() {
        this.service = transactionDao
    }

    getIncomes = async (req, res) => {
        const user = req.user.email
        const income = await this.service.find({ user: user })

        const results = income.map(result => {
            return {
                user: result.user,
                category: result.category,
                amount: result.amount,
                month: result.month,
                description: result.description,
                created: format(new Date(result.created_at), 'dd/MM/yyyy')
            }
        })

        res.render('incomes', {
            user,
            results
        })
    }
}

export default TransactionController