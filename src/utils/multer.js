import multer from "multer";
import __dirname from "../utils.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = '';

        if (file.fieldname === 'profile') {
            folder = 'profiles';
        } else if (file.fieldname === 'product') {
            folder = 'products';
        } else if (file.fieldname === 'identificacion' || file.fieldname === 'domicilio' || file.fieldname === 'estDeCuenta') {
            folder = 'documents';
        } else {
            folder = 'others';
        }

        cb(null, __dirname + `/public/uploads/${folder}`);
    },
    filename: (req, file, cb) => {
        cb(null, `test-${file.originalname}`)
    }
})

export const upload = multer({ storage });

const uploader = upload.fields([
    { name: 'profile', maxCount: 10 },
    { name: 'identificacion', maxCount: 1 },
    { name: 'domicilio', maxCount: 1 },
    { name: 'estDeCuenta', maxCount: 1 },
    { name: 'product', maxCount: 10 }
]);

export const handleUpload = (req, res, next) => {
    uploader(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ status: 'error', message: err.message });
        } else if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        next();
    });
};