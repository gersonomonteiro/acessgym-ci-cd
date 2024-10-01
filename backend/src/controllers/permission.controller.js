const Permission = require('../models/Permission')
const { checkPermission, isAdminOrSuperadmin } = require('../helper/authHelper');


module.exports = {
    async index(req, res) {
        if (await checkPermission(req, 'READ_ROLE') || await isAdminOrSuperadmin(req)) {
            const permission = await Permission.findAll({})
            return res.json({ permission })
        }else{
            return res.status(403).send({ message: 'Sem permissão para listar permissão.' });
        }
    },

    async show(req, res) {},

    async store(req, res) {
        if (await checkPermission(req, 'CREATE_ROLE') || await isAdminOrSuperadmin(req)) {
            const { name, description } = req.body
            if (!name) {
                res.status(400).send({ message: 'Nome de permissão inválido' })
            }
            // duplicate role
            await Permission.findOne({
                where: {
                    name: name,
                },
            })
                .then((permission) => {
                    if (permission) {
                        res.status(400).send({
                            message: 'Falha! Permissão já exsite!',
                        })
                    } else {
                        Permission.create({
                            name,
                            description,
                        }).then((permission) => {
                            return res.json({
                                message: 'Permissão criado com sucesso',
                            })
                        })
                    }
                })
                .catch(function (err) {
                    return res.json(err)
                })
        }else{
            return res.status(403).send({ message: 'Sem permissão para criar permissão.' });
        }
    },

    async update(req, res) {
        if (await checkPermission(req, 'UPDATE_ROLE') || await isAdminOrSuperadmin(req)) {
            await Permission.update(
                {
                    name: req.body.name,
                    description: req.body.description,
                },
                {
                    where: {
                        id: req.params.id,
                    },
                }
            )
                .then((permission) => {
                    if (permission == 0) {
                        return res.json({
                            message: 'Falha, Permissão não atualizada!',
                        })
                    } else {
                        return res.json({
                            message: 'Permissão atualizado com sucesso',
                        })
                    }
                })
                .catch((err) => {
                    return res.json({
                        message: err.message,
                    })
                })
        }else{
            return res.status(403).send({ message: 'Sem permissão para atualizar permissão.' });
        }
    },

    async remove(req, res) {
        if (await checkPermission(req, 'DELETE_ROLE') || await isAdminOrSuperadmin(req)) {
            await Permission.destroy({
                where: {
                    id: req.params.id,
                },
            })
                .then((permission) => {
                    if (permission == 0) {
                        return res.status(400).json({
                            message: 'Falha, Permissão não removido!',
                        })
                    } else {
                        return res.json({
                            message: 'Permissão removido com sucesso!',
                        })
                    }
                })
                .catch((err) =>
                    res.json({
                        message: err.message,
                    })
                )
        }else{
            return res.status(403).send({ message: 'Sem permissão para remover permissão.' });
        }
    },
}
