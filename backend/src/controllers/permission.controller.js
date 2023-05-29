const Permission = require('../models/Permission')

module.exports = {
    async index(req, res) {
        const permission = await Permission.findAll({})
        return res.json({ permission })
    },

    async show(req, res) {},

    async store(req, res) {
        const { name, description } = req.body
        if (!name) {
            res.status(400).send({ message: 'Permission name invalid!' })
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
                        message: 'Failed! Permission already exist!',
                    })
                } else {
                    Permission.create({
                        name,
                        description,
                    }).then((permission) => {
                        return res.json({
                            message: 'Permission created successfully',
                        })
                    })
                }
            })
            .catch(function (err) {
                return res.json(err)
            })
    },

    async update(req, res) {
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
                        message: 'Permission not updated',
                    })
                } else {
                    return res.json({
                        message: 'Permission updated successfully',
                    })
                }
            })
            .catch((err) => {
                return res.json({
                    message: err.message,
                })
            })
    },

    async remove(req, res) {
        await Permission.destroy({
            where: {
                id: req.params.id,
            },
        })
            .then((permission) => {
                if (permission == 0) {
                    return res.status(400).json({
                        message: 'Permission not deleted!',
                    })
                } else {
                    return res.json({
                        message: 'Permission deleted successfully!',
                    })
                }
            })
            .catch((err) =>
                res.json({
                    message: err.message,
                })
            )
    },
}
