const Client = require('../models/Client')
const Image = require('../models/Image')
const helper = require('../helper/helper')
const constants = require('../config/constants.config')
const moment = require('moment')
const { checkPermission, isAdminOrSuperadmin } = require('../helper/authHelper');


module.exports = {
    
    async index(req, res) {
        if (await checkPermission(req, 'READ_CLIENT') || await isAdminOrSuperadmin(req)) {
            const client = await Client.findAll({
                include: [
                    {
                        association: 'image',
                        attributes: ['path'],
                    },
                ],
            })
            return res.json({ client })
        }else{
            return res.status(403).send({ message: 'Sem permissão para listar clientes.' });
        }
    },
    async show(req, res) {
        if (await checkPermission(req, 'READ_CLIENT') || await isAdminOrSuperadmin(req)) {
            const client = Client.findOne({
                where: {
                    cardCode: req.body.cardCode,
                },
                include: [
                    {
                        association: 'image',
                        attributes: ['path'],
                    },
                    {
                        association: 'access',
                    },
                ],
            })
                .then((client) => {
                    if (client) {
                        if (client.image) {
                            client.image.path = `${constants.URL_IMAGE}/api/uploads/${client.image.path}`
                        }
                        return res.json({ client })
                    } else {
                        return res.json({ message: 'Client not found' })
                    }
                })
                .catch((err) => {
                    return res.json(err).message
                })
        }else{
            return res.status(403).send({ message: 'Sem permissão para listar cliente.' });
        }
    },
    async showById(req, res) {
        if (await checkPermission(req, 'READ_CLIENT') || await isAdminOrSuperadmin(req)) {
            const client = Client.findOne({
                where: {
                    id: req.params.id,
                },
                include: [
                    {
                        association: 'image',
                        attributes: ['path'],
                    },
                    {
                        association: 'access',
                    },
                ],
            })
                .then((client) => {
                    if (client) {
                        if (client.image) {
                            client.image.path = `${constants.URL_IMAGE}/api/uploads/${client.image.path}`
                        }
                        return res.json({ client })
                    } else {
                        return res.json({ message: 'Cliente não encontrado.' })
                    }
                })
                .catch((err) => {
                    return res.json(err).message
                })
        }else{
            return res.status(403).send({ message: 'Sem permissão para listar cliente.' });
        }
    },
    async store(req, res) {
        if (await checkPermission(req, 'CREATE_CLIENT') || await isAdminOrSuperadmin(req)) {
            let data
            const {
                fullName,
                phone,
                email,
                cardCode,
                genre,
                address,
                birthday,
                ative,
                monthlyPaymentDate,
            } = req.body

            if (req.file) {
                data = {
                    fullName,
                    phone,
                    email,
                    cardCode,
                    genre,
                    address,
                    birthday,
                    ative: true,
                    monthlyPaymentDate: new Date(),
                    image: {
                        path: req.file.filename,
                    },
                }
            } else {
                data = {
                    fullName,
                    phone,
                    email,
                    cardCode,
                    genre,
                    address,
                    birthday,
                    ative: true,
                    monthlyPaymentDate: new Date(),
                }
            }
            const client = Client.findOne({
                where: {
                    cardCode: cardCode,
                },
            })
                .then((client) => {
                    console.log(client)
                    if (client) {
                        res.status(400).send({
                            message: 'Falha! Cliente já existe!',
                        })
                    } else {
                        Client.create(data, {
                            include: [
                                {
                                    association: 'image',
                                },
                            ],
                        })
                            .then((client) => {
                                res.status(200).send({
                                    message:
                                        'Cliente registado com sucesso!',
                                })
                            })
                            .catch((err) => {
                                return res.status(422).json(err.message)
                            })
                    }
                })
                .catch((err) => {
                    return res.status(422).json(err.message)
                })
        }else{
            return res.status(403).send({ message: 'Sem permissão para criar cliente.' });
        }
    },
    async update(req, res) {
        if (await checkPermission(req, 'UPDATE_ROLE') || await isAdminOrSuperadmin(req)) {
            const {
                fullName,
                phone,
                email,
                address,
                birthday,
                ative,
                monthlyPaymentDate,
            } = req.body

            const data = {
                fullName,
                phone,
                email,
                address,
                birthday,
                ative,
                monthlyPaymentDate,
            }

            const client = await Client.update(data, {
                where: {
                    id: req.params.id,
                },
            })
                .then((client) => {
                    if (req.file) {
                        const image = Image.findOne({
                            where: {
                                client_id: req.params.id,
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
                                                client_id: req.params.id,
                                            },
                                        }
                                    )
                                } else {
                                    const image = Image.create(
                                        {
                                            path: req.file.filename,
                                            client_id: req.params.id,
                                        },
                                        {
                                            where: {
                                                client_id: req.params.id,
                                            },
                                        }
                                    )
                                }
                                console.log(image)
                                //return res.json({ client, image })
                            })
                            .catch(function (err) {
                                return res.json(err)
                            })
                    }
                    if (client == 0) {
                        return res.json({
                            message: 'Falha, cliente não atualizada',
                        })
                    } else {
                        return res.json({
                            message: 'Cliente atualizado com  sucesso.',
                        })
                    }
                })
                .catch(function (err) {
                    return res.json(err).message
                })
        }else{
            return res.status(403).send({ message: 'Sem permissão para atualizar cliente.' });
        }
    },
    async remove(req, res) {
        if (await checkPermission(req, 'DELETE_ROLE') || await isAdminOrSuperadmin(req)) {
            await Client.destroy({
                where: {
                    id: req.params.id,
                },
            })
                .then((client) => {
                    if (client == 0) {
                        return res.status(400).json({
                            message: 'Falha, cliente não removido!',
                        })
                    } else {
                        return res.json({
                            message: 'Cliente removido com  sucesso.',
                        })
                    }
                })
                .catch((err) =>
                    res.json({
                        message: err.message,
                    })
                )
        }else{
            return res.status(403).send({ message: 'Sem permissão para remover cliente.' });
        }
    },

    async inspiredMonthlyFee(req, res) {
        await Client.findAll({
            where: {
                ative: true,
            },
        })
            .then((client) => {
                if (client.length > 0) {                    
                    for (let index = 0; index < client.length; index++) {
                        // Exemplo de uso
                        const userSubscriptionDate = new Date(client[index].monthlyPaymentDate); // Data de inscrição do usuário
                        const expired = helper.isSubscriptionExpired(userSubscriptionDate);
                        if (
                            expired
                        ) {
                            const data = {
                                ative: false,
                            }
                            c = Client.update(data, {
                                where: {
                                    id: client[index].id,
                                },
                            })
                                .then((c) => {
                                    console.log(`cliente ${client[index].fullName} atualizado`)
                                })
                                .catch(function (err) {
                                    console.log(`cliente ${client[index].fullName} não atualizado`)
                                    console.log/(err.message)
                                })
                        } else {
                            console.log('No client to update')
                        }
                    }
                } else {
                    return res.send({ message: 'No client to update' })
                }
            })
            .catch((err) =>
                res.json({
                    message: err.message,
                })
            )
    },
    async sendClientNotificationByEmail(req, res) {
        await Client.findAll({
            where: {
                ative: true,
            },
        })
            .then((client) => {                
                if (client.length > 0) {
                    for (let index = 0; index < client.length; index++) {                        
                        
                        if (helper.diffDays(3, client[index].monthlyPaymentDate)) {
                            console.log(client[index].email)
                            const emailMsg = {
                                Messages: [
                                    {
                                        From: {
                                            Email: 'accessgym.cv@gmail.com',
                                            Name: 'Accessgym',
                                        },
                                        To: [
                                            {
                                                Email: client[index].email,
                                                Name: client[index].fullName,
                                            },
                                        ],
                                        Subject: 'Mensalidade de ginásio',
                                        TextPart:
                                            'Prezado(a) cliente, gostaríamos de lembrá-lo(a) que a sua mensalidade do ginásio vence em 3 dias.',
                                    },
                                ],
                            }
                            const email = helper.sendEmail(emailMsg)
                            email.then((result) => {
                                console.log(`Email de notificação enviado com sucesso para ${client[index].fullName} (${ client[index].email})!`)                                
                                /*return res.status(200).json({
                                    message: 'Email enviado com sucesso!',
                                })*/
                            })
                            .catch((err) => {
                                console.log(err.statusCode)
                                console.log(`Email de notificação não enviado com sucesso para ${client[index].fullName} (${ client[index].email})!`)                                
                                /*return res.status(400).json({
                                    message: 'Email não enviado!',
                                })*/
                            })
                        } 
                        if (helper.diffDays(0, client[index].monthlyPaymentDate)) {
                            console.log(client[index].email)
                            const emailMsg = {
                                Messages: [
                                    {
                                        From: {
                                            Email: 'accessgym.cv@gmail.com',
                                            Name: 'Accessgym',
                                        },
                                        To: [
                                            {
                                                Email: client[index].email,
                                                Name: client[index].fullName,
                                            },
                                        ],
                                        Subject: 'Mensalidade de ginásio',
                                        TextPart:
                                            'Prezado(a) cliente, gostaríamos de informá-lo(a) que a sua mensalidade do ginásio está vencida. Para continuar tendo acesso às nossas instalações, solicitamos que realize o pagamento o mais breve possível.',
                                    },
                                ],
                            }
                            const email = helper.sendEmail(emailMsg)
                            email.then((result) => {
                                console.log(`Email de notificação enviado com sucesso para ${client[index].fullName} (${ client[index].email})!`)                                
                                /*return res.status(200).json({
                                    message: 'Email enviado com sucesso!',
                                })*/
                            })
                            .catch((err) => {
                                console.log(err.statusCode)
                                console.log(`Email de notificação não enviado com sucesso para ${client[index].fullName} (${ client[index].email})!`)                                
                                /*return res.status(400).json({
                                    message: 'Email não enviado!',
                                })*/
                            })                        
                        }                      
                    }                   
                    return res.send({ message: 'Notificação Enviado ao(s) cliente(s)' })
                } else {
                    return res.send({ message: 'Sem cliente para enviar notificação' })
                }
            })
            .catch((err) =>
                res.json({
                    message: err.message,
                })
            )
    },
}
