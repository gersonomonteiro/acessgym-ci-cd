const User = require('../models/User')
const Image = require('../models/Image')
const { update } = require('../models/User')
const bcrypt = require('bcryptjs')
const constants = require('../config/constants.config')
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.config");
const { checkPermission, isAdminOrSuperadmin } = require('../helper/authHelper');

module.exports = {
    async index(req, res) {
        if (await checkPermission(req, 'READ_USER') ||  await isAdminOrSuperadmin(req)) { 
            const user = await User.findAll({
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    {
                        association: 'image',
                        attributes: ['path'],
                    },
                    {
                        association: 'roles',
                        include: [{ association: 'permission' }],
                    },
                ],
            })

            return res.json({ user })
        }else{
            return res.status(403).send({ message: 'Sem permissão para listar utilizadores.' });
        }
    },
    async show(req, res) {
        if (await checkPermission(req, 'READ_USER') || await checkPermission(req, 'UPDATE_USER') ||  await isAdminOrSuperadmin(req)) { 
            const user = await User.findOne({
                where: {
                    email: req.body.email,
                },
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    {
                        association: 'image',
                        attributes: ['path'],
                    },
                    {
                        association: 'roles',
                        include: [{ association: 'permission' }],
                    },
                ],
            })
                .then((user) => {
                    if (user) {
                        if (user.image) {
                            user.image.path = `${constants.URL_IMAGE}/api/uploads/${user.image.path}`
                        }

                        return res.json({ user })
                    } else {
                        return res.json({ message: 'User not found' })
                    }
                })
                .catch((err) => {
                    return res.json(err).message
                })
        }else{
            return res.status(403).send({ message: 'Sem permissão para listar utilizador.' });
        }
    },

    async store(req, res) {
        if (await checkPermission(req, 'CREATE_USER') ||  await isAdminOrSuperadmin(req)) { 
            const { firstname, lastname, phone, email, password, ative } = req.body

            const user = await User.create(
                {
                    firstname,
                    lastname,
                    phone,
                    email,
                    password,
                    ative,
                    image: {
                        path: req.file.filename,
                    },
                },
                {
                    include: [
                        {
                            association: 'image',
                        },
                    ],
                }
            )
            
            return res.json(user)
        }else{
            return res.status(403).send({ message: 'Sem permissão para criar utilizador.' });
        }
    },

    async update(req, res) {
        if (await checkPermission(req, 'UPDATE_USER') ||  await isAdminOrSuperadmin(req)) { 
            const { firstname, lastname, phone, email, ative } = req.body

            const data = {
                firstname,
                lastname,
                phone,
                email,
                ative,
            }
            
            const user = await User.update(data, {
                where: {
                    id: req.params.id,
                },
            })
                .then((user) => {
                    if (user != 0) {
                        if (req.file) {
                            const image = Image.findOne({
                                where: {
                                    user_id: req.params.id,
                                },
                            })
                                .then((image) => {
                                    if (image) {
                                        const image = Image.update(
                                            {
                                                path: req.file.filename,
                                            },
                                            {
                                                where: {
                                                    user_id: req.params.id,
                                                },
                                            }
                                        )
                                    } else {
                                        const image = Image.create(
                                            {
                                                path: req.file.filename,
                                                user_id: req.params.id,
                                            },
                                            {
                                                where: {
                                                    user_id: req.params.id,
                                                },
                                            }
                                        )
                                    }
                                    
                                    return res.json({
                                        message: 'User update successfully!',
                                    })
                                })
                                .catch(function (err) {
                                    return res.json(err)
                                })
                    } else {
                        return res.json({
                            message: 'User update successfully!',
                        })
                    }
                }else{
                        return res.status(400).json({
                            message: 'User not found!',
                        })
                    }
                })
                .catch(function (err) {
                    return res.json(err)
                })
        }else{
            return res.status(403).send({ message: 'Sem permissão para atualizar utilizador.' });
        }
    },

    async remove(req, res) {
        if (await checkPermission(req, 'DELETE_USER') ||  await isAdminOrSuperadmin(req)) {
            await User.destroy({
                where: {
                    id: req.params.id,
                },
            })
                .then((user) => {
                    if (user == 0) {
                        return res.status(400).json({
                            message: 'Utilizador não eliminado!',
                        })
                    } else {
                        return res.json({
                            message: 'Utilizador eliminado com sucesso!',
                        })
                    }
                })
                .catch((err) =>
                    res.json({
                        message: err.message,
                    })
                )
        }else{
            return res.status(403).send({ message: 'Sem permissão para remover utilizador.' });
        }
    },

    async  resetPassword(req, res) {
        try {
            const { newPwd, confirmPwd } = req.body;
            const userIdToReset = req.params.id; // ID do utilizador cuja senha será redefinida
    
            // Verifica se o utilizador atual tem as permissões necessárias (admin ou superadmin)
            if (!isAdminOrSuperadmin(req)) {
                return res.status(403).send({
                    message: 'Acesso negado. Apenas administradores podem redefinir palavras-passe.',
                });
            }
    
            // Verifica se as novas palavras-passe coincidem
            if (newPwd !== confirmPwd) {
                return res.status(400).send({
                    message: 'As palavras-passe não coincidem.',
                });
            }
    
            // Procura o utilizador cuja senha será redefinida
            const user = await User.findOne({ where: { id: userIdToReset } });
    
            if (!user) {
                return res.status(404).send({
                    message: 'Utilizador não encontrado.',
                });
            }
    
            // Atualiza a senha do utilizador
            const hashedPassword = bcrypt.hashSync(newPwd, 8);
            await User.update({ password: hashedPassword }, { where: { id: userIdToReset } });
    
            return res.send({
                message: 'Palavra-passe redefinida com sucesso.',
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                message: 'Ocorreu um erro ao redefinir a palavra-passe.',
                error: err.message,
            });
        }
    },

    async updatePassword(req, res) {
        try {
            const { oldPwd, newPwd, confirmPwd } = req.body;
            
            // Verifica se as novas palavras-passe coincidem
            if (newPwd !== confirmPwd) {
                return res.status(400).send({
                    message: 'As palavras-passe não coincidem.',
                });
            }
    
            // Obtenha o ID do utilizador a partir do token JWT
            const token = req.headers['x-access-token'];
            const decodedToken = jwt.verify(token, authConfig.secret);
            const userId = decodedToken.parametro.id;
            
            // Procura o utilizador com base no ID
            const user = await User.findOne({ where: { id: userId } });
    
            // Verifica se a senha antiga está correta
            const passwordIsValid = bcrypt.compareSync(oldPwd, user.password);
            if (!passwordIsValid) {
                return res.status(400).send({
                    message: 'A senha antiga está incorreta.',
                });
            }
    
            // Atualiza a password com a nova senha
            const hashedPassword = bcrypt.hashSync(newPwd, 8);
            await User.update({ password: hashedPassword }, { where: { id: userId } });
    
            return res.send({
                message: 'Palavra-passe atualizada com sucesso.',
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                message: 'Ocorreu um erro ao atualizar a palavra-passe.',
                error: err.message,
            });
        }
    }
    
}
