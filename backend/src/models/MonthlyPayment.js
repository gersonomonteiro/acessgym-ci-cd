const { Model, DataTypes } = require('sequelize')

class MonthlyPayment extends Model {
    static init(sequelize) {
        super.init(
            {
                receipt_id: {
                    type: DataTypes.INTEGER,
                },
                price: {
                    type: DataTypes.STRING,
                },
                month: {
                    type: DataTypes.STRING,
                },
                discount: {
                    type: DataTypes.STRING,
                },
            },
            {
                sequelize,
                tableName: 'monthly_payments',
            }
        )
    }
    static associate(models) {
        this.belongsTo(models.Receipt, { foreignKey: 'receipt_id', as: 'receipt' })
    }
}

module.exports = MonthlyPayment
