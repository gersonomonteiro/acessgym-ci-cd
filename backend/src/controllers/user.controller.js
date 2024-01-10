const User = require('../models/User')
const Image = require('../models/Image')
const { update } = require('../models/User')
const bcrypt = require('bcryptjs')
const constants = require('../config/constants.config')

module.exports = {
    async index(req, res) {
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
    },
    async show(req, res) {
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
    },

    async store(req, res) {
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
    },

    async update(req, res) {
        //console.log(req.file);
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
            })
            .catch(function (err) {
                return res.json(err)
            })
    },

    async remove(req, res) {
        await User.destroy({
            where: {
                id: req.params.id,
            },
        })
            .then((user) => {
                if (user == 0) {
                    return res.status(400).json({
                        message: 'User not deleted!',
                    })
                } else {
                    return res.json({
                        message: 'User deleted successfully!',
                    })
                }
            })
            .catch((err) =>
                res.json({
                    message: err.message,
                })
            )
    },
    async updatePassword(req, res) {
        const { oldPwd, newPwd, confirmPwd } = req.body

        const data = {
            password: bcrypt.hashSync(newPwd, 8),
        }
        User.findOne({
            where: {
                id: req.params.id,
            },
        })
            .then((user) => {
                if (!bcrypt.compareSync(oldPwd, user.password)) {
                    return res.status(400).send({
                        message: 'Old password incorret!',
                    })
                } else {
                    if (newPwd != confirmPwd) {
                        return res.status(400).send({
                            message: 'Passwords do not match.',
                        })
                    } else {
                        const user = User.update(data, {
                            where: {
                                id: req.params.id,
                            },
                        })
                            .then((user) => {
                                return res.send({
                                    message: 'Password update successfully',
                                })
                            })
                            .catch(function (err) {
                                return res.json(err)
                            })
                    }
                }
            })
            .catch(function (err) {
                return res.json(err)
            })
    },
}
