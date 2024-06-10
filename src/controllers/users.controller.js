import { userRepository } from "../repositories/index.js"
// import CartController from "./carts.controller.js"


class UserController {
    constructor() {
        this.service = userRepository
    }

    getUsers = async (req, res) => {
        try {
            const user = req.user.email
            const result = await this.service.getUsers()

            const users = result.map(user => {
                let roleUpdate
                if (user.role === 'premium') {
                    roleUpdate = 'user'
                } else if (user.role === 'user') {
                    roleUpdate = 'premium'
                } else {
                    roleUpdate = false
                }
                return {
                    id: user._id.toString(),
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    password: user.password,
                    imgProfile: user.imgProfile,
                    role: user.role,
                    isActive: user.isActive ? 'Activo' : 'Inactivo',
                    roleUpdate,
                }
            })

            res.render('users', {
                user: user,
                users,
            })
        } catch (error) {
            res.send({ status: 'error', message: error })
        }
    }

    createUser = async (req, res) => {
        try {
            const newUser = req.body
            return await this.service.createUser(newUser)
        } catch (error) {
            res.send({ status: 'Error usersController', error: error })
        }
    }

    getUser = async (req, res) => {
        const filter = req
        try {
            return await this.service.getUser(filter)
        } catch (error) {
            res.send(error)
        }
    }

    deleteUser = async (req, res) => {
        try {
            const uid = req
            return await this.service.deleteUser(uid)
        } catch (error) {
            res.send({ status: 'Error Delete UserController', error: error })
        }
    }

    updateRole = async (req, res) => {
        const _id = req.params.uid;
        try {
            const user = await this.service.getUser({ _id: _id });
            if (!user) {
                return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
            }

            const searchDocument = ['identificacion', 'domicilio', 'estDeCuenta'];
            const userDocuments = user.documents.map(doc => doc.name);

            const verifyDocuments = searchDocument.every(doc => userDocuments.includes(doc));

            if (user.role === 'user') {
                if (!verifyDocuments) {
                    return res.status(400).send({ status: 'error', message: 'El usuario debe tener cargados los documentos de identificación, domicilio y estado de cuenta para actualizar a premium.' });
                }
                const update = await this.service.updateUser(_id, { role: 'premium' });
                res.send({ status: 'success', message: 'Rol actualizado a premium', user: update });
            } else if (user.role === 'premium') {
                const update = await this.service.updateUser(_id, { role: 'user' });
                res.send({ status: 'success', message: 'Rol actualizado a user', user: update });
            }

        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message });
        }
    }

    last_connection = async (req, res) => {
        const _id = req
        const last_connection = new Date()
        const update = await this.service.updateUser(_id, { last_connection: last_connection })
    }

    documents = async (req, res) => {
        try {
            const { uid } = req.params;
            const files = req.files;
            const { firstname, lastname, email } = req.body

            const user = await this.service.getUser({ _id: uid });
            if (!user) {
                return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
            }
            user.firstname = firstname
            user.lastname = lastname

            const documentFields = ['identificacion', 'domicilio', 'estDeCuenta'];

            documentFields.forEach(field => {
                if (files[field]) {
                    files[field].forEach(file => {
                        const documentsIndex = user.documents.findIndex(doc => doc.name === file.fieldname);
                        if (documentsIndex !== -1) {
                            user.documents[documentsIndex].reference = `/uploads/documents/${file.filename}`;
                        } else {
                            user.documents.push({
                                name: file.fieldname,
                                reference: `/uploads/documents/${file.filename}`
                            });
                        }
                    });
                }
            });

            await user.save();
            res.status(200).send({ status: 'success', message: 'Documentos subidos correctamente' });
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message });
        }

    }
}

export default UserController