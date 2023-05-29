const { Model, Sequelize } = require('sequelize')

class Client extends Model {
    static init(sequelize) {
        super.init(
            {
                fullName: {
                    type: Sequelize.STRING,
                },
                phone: {
                    type: Sequelize.STRING,
                },
                email: {
                    type: Sequelize.STRING,
                },
                cardCode: {
                    type: Sequelize.STRING,
                },
                genre: {
                    type: Sequelize.STRING,
                },
                address: {
                    type: Sequelize.STRING,
                },
                birthday: {
                    type: Sequelize.DATE,
                },
                ative: {
                    type: Sequelize.BOOLEAN,
                },
                monthlyPaymentDate: {
                    type: Sequelize.DATE,
                },
            },
            {
                sequelize,
                tableName: 'clients',
            }
        )
    }

    static associate(models) {
        this.hasOne(models.Image, { foreignKey: 'client_id', as: 'image' })
        this.hasMany(models.Access, { foreignKey: 'client_id', as: 'access' })
        this.hasMany(models.Receipt, { foreignKey: 'client_id', as: 'receipt' })
    }
}
module.exports = Client
