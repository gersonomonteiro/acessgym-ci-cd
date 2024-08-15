//https://siddharth-lakhara.medium.com/understanding-sequelize-associations-part-2-one-to-many-1-n-mapping-10a7d7929a5b
const Receipt = require('../models/Receipt')
const Client = require('../models/Client')
const { sendEmail, yearAndmonth } = require('../helper/helper')
const { Op } = require('sequelize')


const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const pdf = require('html-pdf')

module.exports = {
    async index(req, res) {
        
        let from = req.body.from
        let to = req.body.to

        if (from == '') {
            from = yearAndmonth(1)            
        }
        if (to == '') {
            to = yearAndmonth(0)           
        }
        const receipt = await Receipt.findAll({
            where: {
                createdAt: {
                    [Op.between]:
                        [from, to],
                },
            },
            order: [
                ['createdAt', 'DESC']
            ],
            include: [
                {
                    association: 'client',
                    attributes: ['id', 'fullName', 'email'],
                },
                {
                    association: 'monthlyPayment'
                },
            ],
        })
        return res.json({ receipt })
    },

    store(req, res) {
        const client = Client.findOne({
            where: {
                id: req.body.client_id,
            },
            attributes: ['fullName', 'email'],
        })
            .then((client) => {
                const monthNames = {
                    janeiro: 0, fevereiro: 1, marco: 2, abril: 3, maio: 4, junho: 5,
                    julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11
                };
                let lastMonthPaid = monthNames[req.body.monthlyPayment[0].month];
                let monthName
                const listPrice = []
                for (let i = 0; i < req.body.monthlyPayment.length; i++) {
                    const item = req.body.monthlyPayment[i];

                    if (item.price <= 0){
                        return res.status(400).json({
                            message: 'Valor invalido!',
                        })
                    }
                    const priceAfterDiscount = item.price * (1 - item.discount / 100);
                    listPrice.push(priceAfterDiscount)
                    const currentMonth = monthNames[item.month];
                    // Verifica se o mês atual está em sequência
                    if (i > 0 && (currentMonth - lastMonthPaid !== 1)) {
                        return res.status(400).json({
                            message: 'Sequencia de mês invalida!',
                        });
                    }

                        lastMonthPaid = currentMonth;
                        monthName = item.month
                        console.log(lastMonthPaid)
                }
                
                
                const totalPayment = listPrice.reduce((x, y) => x + y, 0);

                const clientName = client.fullName
                const timestamp = Date.now()
                const fileName =
                    clientName.replace(/\s+/g, '_') + '_' + timestamp + '.pdf'
                const createReceipt = Receipt.create(
                    {
                        client_id: req.body.client_id,
                        receiptNumber: timestamp,
                        totalPayment: totalPayment,
                        fileName: fileName,
                        monthlyPayment: req.body.monthlyPayment,
                    },
                    {
                        include: [
                            {
                                association: 'monthlyPayment',
                            },
                        ],
                    }
                )
                    .then((createReceipt) => {
                        const currentYear = new Date().getFullYear();
                        const currentDay = new Date().getDate();
                        const lastPaymentDate = new Date(currentYear, monthNames[monthName], currentDay);
                        Client.update({ monthlyPaymentDate: lastPaymentDate, ative: 1 }, {
                                where: { id: req.body.client_id },
                        }).then(() => {
                            const receipt = {
                                receiptNumber: timestamp,
                                createdAt: createReceipt.createdAt.toDateString(),
                                clientName: clientName,
                                totalPayment: totalPayment,
                                monthlyPayment: req.body.monthlyPayment,
                             }
                            ejs.renderFile(
                                path.join(__dirname, '../views/', 'template.ejs'),
                                {
                                    receipt: receipt,
                                },
                                (err, data) => {
                                    if (err) {
                                        res.send(err)
                                    } else {
                                        let options = {
                                            height: '17.25in',
                                            width: '13.5in',
                                            header: {
                                                height: '30mm',
                                            },
                                            footer: {
                                                height: '30mm',
                                            },
                                            format: 'Letter',
                                            phantomPath: '/usr/src/app/node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs'
                                        }
                                        
                                        pdf.create(data, options).toFile(
                                            `uploads/${fileName}`,
                                            function (err, data) {
                                                if (err) {
                                                    //res.send(err)
                                                    console.log(err)
                                                } else {
                                                    res.send({
                                                        message:
                                                            'Recibo criado com sucesso!',
                                                    })
                                                }
                                            }
                                        )
                                    }
                                }
                            )
                        })
                        })
                    .catch((err) => {
                        return res.status(422).json({
                            message: 'Falha em criar recibo!',
                            error: err.message,
                        })
                    })
            })
            .catch((err) => {
                return res.status(422).json({
                    message: 'Falha em criar recibo!',
                    error: err.message,
                })
            })
    },
    async remove(req, res) {
        await Receipt.destroy({
            where: {
                id: req.params.id,
            },
        })
            .then((receipt) => {
                if (receipt == 0) {
                    return res.status(400).json({
                        message: 'Receipt not deleted!',
                    })
                } else {
                    return res.json({
                        message: 'Receipt deleted successfully!',
                    })
                }
            })
            .catch((err) =>
                res.json({
                    message: err.message,
                })
            )
    },

    async sendReceiptByEmail(req, res) {
        const receipt = await Receipt.findOne({
            where: {
                id: req.body.id,
            },
            attributes: ['fileName'],
            include: [
                {
                    association: 'client',
                    attributes: ['id', 'fullName', 'email'],
                },
                {
                    association: 'monthlyPayment',
                    attributes: ['month'],
                },
            ],
        })
            .then((receipt) => {
                if (receipt == null) {
                    return res.status(400).json({
                        message: 'Recibo não encontrado!',
                    })
                }

                const monthlyPayment = receipt.monthlyPayment
                let months = ''

                for (let index = 0; index < monthlyPayment.length; index++) {
                    months += monthlyPayment[index].month + ' '
                }

                const client = receipt.client
                const absolutePath = path.resolve(
                    __dirname,
                    '..',
                    '..',
                    'uploads',
                    receipt.fileName
                )
                try {
                    if (fs.existsSync(absolutePath)) {
                        const attachments = fs.readFileSync(absolutePath, {
                            encoding: 'base64',
                        })

                        const message = {
                            Messages: [
                                {
                                    From: {
                                        Email: 'accessgym.cv@gmail.com',
                                        Name: 'Accessgym',
                                    },
                                    To: [
                                        {
                                            Email: client.email,
                                            Name: client.fullName,
                                        },
                                    ],
                                    Subject: 'Recibo Pagamento Mensalidade (' + months + ')',
                                    TextPart:
                                        'Segue em anexo o seu recibo de pagamento de mensalidade(s)',
                                    Attachments: [
                                        {
                                            ContentType: 'text/plain',
                                            Filename: 'recibo.pdf',
                                            Base64Content: attachments,
                                        },
                                    ],
                                },
                            ],
                        }
                        const email = sendEmail(message)
                        email.then((result) => {
                            return res.status(200).json({
                                message: 'Email enviado com sucesso!',
                            })
                        })
                        .catch((err) => {
                            console.log(err.statusCode)
                            return res.status(400).json({
                                message: 'Email não enviado!',
                            })
                        })
                    } else {
                        return res.status(400).json({
                            message: 'Recibo não encontrado!',
                        })
                    }
                } catch (err) {
                    return res.status(400).json({
                        message: 'Recibo não encontrado!!',
                    })
                }
            })
            .catch((err) => {
                console.log(err)
                return res.status(400).json({
                    message: 'Erro em encontrar recibo!',
                })
            })
    },
}
