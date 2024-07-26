import configDaoMongo from "../daos/MongoDB/configDaoMongo.js";

const configDao = new configDaoMongo()

class configController {
    constructor() {
        this.service = configDao
    }

    getConfig = async (req, res) => {
        const user = req.user.email;
        try {
            const config = await this.service.find({ user: user, category: 'Ingreso' });
            if (!config) {
                return res.status(404).send('Configuration not found');
            }

            const configIngreso = config.categories ? config.categories.Ingreso : [];
            console.log('Ingreso Categories:', configIngreso);

            res.render('configuration', { config: configIngreso, user });
        } catch (error) {
            console.error('Error getting configuration:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    createConfig = async (req, res) => {
        const user = req.user.email
        const createConfig = await this.service.create({ user: user })
        console.log(create);

    }

    transaction = async (req, res) => {
        const transactionType = req.params.transactionType;
        const user = req.user.email;

        try {
            const config = await this.service.find({ user: user, category: transactionType });
            if (!config) {
                return res.status(404).send('Configuration not found');
            }

            console.log(transactionType);
            
            console.log(user);
            
            console.log(config);
            


            const categories = config.categories[transactionType] || [];


            res.json(categories);
        } catch (error) {
            console.error('Error getting configuration:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

export default configController