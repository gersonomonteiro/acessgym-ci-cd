const Role = require('../models/Role')
const Permission = require('../models/Permission')
const { checkPermission, isAdminOrSuperadmin } = require('../helper/authHelper');
const { Op } = require('sequelize')
const User = require('../models/User')

module.exports = {
    async index(req, res) {

        if (await checkPermission(req, 'READ_ROLE') ||  await isAdminOrSuperadmin(req)) {          
        
            const role = await Role.findAll({
                include: [
                    {
                        association: 'permission',
                    },
                ],
            })
            return res.json({ role })
        }else{
            return res.status(403).send({ message: 'Sem permissão para listar roles.' });
        }
    },

    async show(req, res) {

        if (await checkPermission(req, 'READ_ROLE') || await isAdminOrSuperadmin(req)) {          
        
            const role = await Role.findOne({
                where: {
                    id: req.params.id,
                },
                include: [
                    {
                        association: 'permission',
                    },
                    {
                        association: 'users',
                        attributes: ['id', 'email'],
                    },
                ],
            })
                .then((role) => {
                    if (role) {
                        return res.json({ role })
                    } else {
                        return res.json({ message: 'Role not found' })
                    }
                })
                .catch((err) => {
                    return res.json(err).message
                })
        }else{
            return res.status(403).send({ message: 'Sem permissão para listar roles.' });
        }
    },

    async store(req, res) {
        if (await checkPermission(req, 'CREATE_ROLE') || await isAdminOrSuperadmin(req)) {
            const { name, description, permissions, users } = req.body
            //console.log(permissions.length)
            if (!name) {
                res.status(400).send({ message: 'Role name invalid!' })
            } else {
                if (permissions && users) {
                    //console.log(permissions)
                    if (permissions.length == 0 || users.length == 0 ||  !Array.isArray(users)) {
                        res.status(400).send({
                            message:
                                'Role não permitida sem permissões ou utilizador!',
                        })
                    } else {
                        // duplicate role
                        Role.findOne({
                            where: {
                                name: name,
                            },
                        })
                            .then((role) => {
                                if (role) {
                                    res.status(400).send({
                                        message: 'Falhou! Role já existe!',
                                    })
                                } else {
                                    Role.create({
                                        name,
                                        description,
                                    })
                                        .then((role) => {                                            
                                            Permission.findAll({
                                                where: {
                                                    name: {
                                                        [Op.or]:
                                                            req.body.permissions,
                                                    },
                                                },
                                            })
                                                .then((permissions) => {
                                                    // Checkconsole.log(permissions)
                                                    role.setPermission(permissions)
                                                        .then((permissions) => {
                                                            User.findAll({
                                                                where: {
                                                                    id: {
                                                                        [Op.or]:
                                                                            req.body.users,
                                                                    },
                                                                },
                                                            })
                                                                .then((users) => {
                                                                    role.setUsers(
                                                                        users
                                                                    )
                                                                        .then(
                                                                            () => {
                                                                                return res.send(
                                                                                    {
                                                                                        message:
                                                                                            'Role created successfully',
                                                                                    }
                                                                                )
                                                                            }
                                                                        )
                                                                        .catch(
                                                                            function (
                                                                                err
                                                                            ) {
                                                                                return res.json(
                                                                                    err
                                                                                )
                                                                            }
                                                                        )
                                                                })
                                                                .catch((err) => {
                                                                    return res.json({
                                                                        message: err.message,
                                                                    })
                                                                })
                                                        })
                                                        .catch(function (err) {
                                                            return res.json(err)
                                                        })
                                                })
                                                .catch(function (err) {
                                                    return res.json(err)
                                                })
                                        })
                                        .catch(function (err) {
                                            return res.json(err)
                                        })
                                }
                            })
                            .catch(function (err) {
                                return res.json(err)
                            })
                    }
                } else {
                    return res.status(400).send({
                        message: 'Role não permitida sem permissões ou utilizador!',
                    })
                }
            }
        }else {
            return res.status(403).send({ message: 'Sem permissão para criar roles.' });
        }
    },

    async roleAddPermission(req, res) {
        if (await checkPermission(req, 'UPDATE_ROLE') || await isAdminOrSuperadmin(req)) {
            // duplicate role
            Role.findOne({
                where: {
                    id: req.params.id,
                },
            })
                .then((role) => {
                    if (req.body.permissions) {
                        if (req.body.permissions.length == 0) {
                            return res.status(400).send({
                                message:
                                    'The role must have at least one permission',
                            })
                        } else {
                            Permission.findAll({
                                where: {
                                    name: {
                                        [Op.or]: req.body.permissions,
                                    },
                                },
                            })
                                .then((permissions) => {
                                    if (permissions.length <= 0) {
                                        return res.status(400).send({
                                            message: 'Permission not updated ',
                                        })
                                    }
                                    role.setPermission(permissions)
                                        .then(() => {
                                            return res.send({
                                                message:
                                                    'Permission updated successfully',
                                            })
                                        })
                                        .catch(function (err) {
                                            return res.json(err)
                                        })
                                })
                                .catch(function (err) {
                                    return res.json(err)
                                })
                        }
                    } else {
                        return res.status(400).send({
                            message: 'Permission not updated ',
                        })
                    }
                })
                .catch(function (err) {
                    return res.json(err)
                })
        }else{
            return res.status(403).send({ message: 'Sem permissão para atualizar roles.' });
        }
    },

    async update(req, res) {
        if (await checkPermission(req, 'UPDATE_ROLE') || await isAdminOrSuperadmin(req)) { 
            await Role.findOne({
                where: {
                    name: req.body.name,
                },
            }).then((role) => {
                if (role) {
                    res.status(400).send({
                        message: 'Failed! Role already exist!',
                    })
                } else {
                    Role.update(
                        {
                            name: req.body.name,
                        },
                        {
                            where: {
                                id: req.params.id,
                            },
                        }
                    )
                        .then((role) => {
                            if (role == 0) {
                                return res.json({
                                    message: 'Role name not updated',
                                })
                            } else {
                                return res.json({
                                    message: 'Role name updated successfully',
                                })
                            }
                        })
                        .catch((err) => {
                            return res.json({
                                message: err.message,
                            })
                        })
                }
            })
        }else{
            return res.status(403).send({ message: 'Sem permissão para atualizar roles.' });
        }
    },

    async remove(req, res) {
        
        if (await checkPermission(req, 'DELETE_ROLE')  || await isAdminOrSuperadmin(req)) { 
             Role.destroy({
                where: {
                    id: req.params.id,
                },
            })
            .then((role) => {
                if (role == 0) {
                    return res.status(400).json({
                        message: 'Role not deleted!',
                    })
                } else {
                    return res.json({
                        message: 'Role deleted successfully!',
                    })
                }
            })
            .catch((err) =>
                res.json({
                    message: err.message, 
                })
        
            )
        }else{
            return res.status(403).send({ message: 'Sem permissão para remover roles.' });
        }
    },

    async roleUpdateUser(req, res) {
        if (await checkPermission(req, 'UPDATE_ROLE') || await isAdminOrSuperadmin(req)) {
            // duplicate role
            Role.findOne({
                where: {
                    id: req.params.id,
                },
            })
                .then((role) => {
                    if (req.body.users) {
                        if (req.body.users.length == 0) {
                            res.status(400).send({
                                message: 'The role must have at least one user',
                            })
                        } else {
                            User.findAll({
                                where: {
                                    id: {
                                        [Op.or]: req.body.users,
                                    },
                                },
                            })
                                .then((users) => {
                                    role.setUsers(users)
                                        .then(() => {
                                            res.send({
                                                message:
                                                    'Role updated successfully',
                                            })
                                        })
                                        .catch(function (err) {
                                            return res.json(err)
                                        })
                                })
                                .catch(function (err) {
                                    return res.json(err)
                                })
                        }
                    } else {
                        return res.status(400).send({
                            message: 'Role not updated ',
                        })
                    }
                })
                .catch(function (err) {
                    return res.json(err)
                })
        }else{
            return res.status(403).send({ message: 'Sem permissão para atualizar roles.' });
        }
    },
}
