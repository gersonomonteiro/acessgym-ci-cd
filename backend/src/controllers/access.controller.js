const Access = require('../models/Access')
const Client = require('../models/Client')

module.exports = {
    async index(req, res) {
        const access = await Access.findAll({
            include: [
                {
                    association: 'client',
                    attributes: ['fullName', 'genre', 'birthday'],
                },
            ],
        })
        return res.json({ access })
    },

    store(req, res) {
        const { cardCode, status } = req.body
        const client = Client.findOne({
            where: {
                cardCode: cardCode,
            },
        })
            .then((client) => {
                if (client) {
                    const access = Access.create({
                        client_id: client.id,
                        status,
                    }).then((access) => {
                        return res.json(access)
                    })
                } else {
                    return res.status(400).json({
                        message: 'Client not Found!',
                    })
                }
            })
            .catch((err) => {
                return res.status(422).json(err.message)
            })
    },
}
