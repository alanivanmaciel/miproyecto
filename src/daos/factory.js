import { configObject, connectDB } from "../config/connectDB.js";

let UserDao;
let ProductDao;
let CartsDao;

switch (configObject.persistence) {
    case 'FILE':
        const productModule = await import("./FileSystem/productDaoFile.js");
        ProductDao = productModule.default;
        const cartsModule = await import("./FileSystem/cartsDaoFile.js");
        CartsDao = cartsModule.default;
        break;
    case 'MEMORY':

        break;
    default:
        connectDB();
        const userModule = await import("./MongoDB/userDaoMongo.js");
        UserDao = userModule.default;

        const productModuleMongo = await import("./MongoDB/productDaoMongo.js");
        ProductDao = productModuleMongo.default;
        
        break;
}

export default { UserDao, ProductDao, CartsDao };
