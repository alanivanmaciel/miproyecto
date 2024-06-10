import EErrors from "../../utils/errors/enums.js";

export const handleErrors = (error, req, res) => {
    switch (error.code) {
        case EErrors.INVALID_TYPE_ERROR:
            return res.send({
                status: 'error',
                error: error.name
            })
            break;
    
        default:
            return res.send({
                status: 'error',
                error: 'Error de server.'
            })
            break;
    }
}