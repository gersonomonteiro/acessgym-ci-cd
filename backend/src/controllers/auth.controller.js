const config = require('../config/auth.config')
const User = require('../models/User')
const Role = require('../models/Role')
const Image = require('../models/Image')

const { Op } = require('sequelize')

var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')

function gerarToken(parametro = {}) {
    return jwt.sign({ parametro }, config.secret, {
        expiresIn: 14400, //4h
    })
}

exports.signup = (req, res) => {
    const errors = validationResult(req)
    let data
    const { firstname, lastname, phone, email, password, ative } = req.body

    if (req.file) {
        data = {
            firstname,
            lastname,
            phone,
            email,
            password: bcrypt.hashSync(password, 8),
            ative,
            image: {
                path: req.file.filename,
            },
        }
    } else {
        data = {
            firstname,
            lastname,
            phone,
            email,
            password: bcrypt.hashSync(password, 8),
            ative,
        }
    }

    if (!errors.isEmpty()) {
        return res.status(422).json(errors)
    } else {
        // duplicate email
        User.findOne({
            where: {
                email: email,
            },
        })
            .then((user) => {
                if (user) {
                    res.status(400).send({
                        message: 'Failed! Email is already in use!',
                    })
                } else {
                    User.create(data, {
                        include: [
                            {
                                association: 'image',
                            },
                        ],
                    })
                        .then((user) => {
                            user.password = undefined
                            //res.status(200).json(user)
                            //console.log(req.body.roles)
                            if (req.body.roles) {
                                Role.findAll({
                                    where: {
                                        name: {
                                            [Op.or]: req.body.roles,
                                        },
                                    },
                                }).then((roles) => {
                                    //console.log(roles)
                                    user.setRoles(roles).then(() => {
                                        res.send({
                                            user,
                                            roles,
                                            message:
                                                'User created successfully',
                                        })
                                    })
                                })
                            } else {
                                // user role = 1
                                user.setRoles([3]).then((roles) => {
                                    res.send({
                                        user,
                                        roles,
                                        message: 'User created successfully',
                                    })
                                })
                            }
                            //res.status(200).json(user)
                        })
                        .catch((err) => {
                            return res.status(422).json(err)
                        })
                }
            })
            .catch((err) => {
                res.status(500).send({
                    mensagem: err.message,
                })
            })
    }
}

exports.signin = (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json(errors)
    } else {
        User.findOne({
            where: {
                email: req.body.email,
            },
            include: [
                {
                    association: 'image',
                },
            ],
        })
            .then((user) => {
                if (!user) {
                    return res
                        .status(401)
                        .send({ message: 'nome de utilizador ou senha incorreto!' })
                }

                if (!bcrypt.compareSync(req.body.password, user.password)) {
                    return res.status(401).send({
                        message: 'nome de utilizador ou senha incorreto!',
                    })
                }
                user.password = undefined
                //user.image.path = `http://localhost:8080/api/uploads/${user.image.path}`
                res.send({
                    user,
                    token: gerarToken({ id: user.id }),
                })
            })
            .catch((err) => {
                console.log(err)
                res.status(500).send({
                    message:
                        'Ocorreu um erro inesperado tente novamente mais tarde ou entre em contato com o administrador!',
                })
            })
    }
}
