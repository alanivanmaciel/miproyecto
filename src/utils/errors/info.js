const generateProductErrorInfo = (product) => {
    return `One or more properties where incomplete or not valid.
    List of require properties:
        * title: needs to be a String, recived ${product.title}
        * code: needs to be a String, recived ${product.code}
        * description: needs to be a String, recived ${product.description}
        * price: needs to be a String, recived ${product.price}
        * stock: needs to be a String, recived ${product.stock}
        * category: needs to be a String, recived ${product.category}
    `
}

export default generateProductErrorInfo