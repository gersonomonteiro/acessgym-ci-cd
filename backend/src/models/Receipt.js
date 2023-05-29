const { Model, DataTypes } = require('sequelize')

class Receipt extends Model {
    static init(sequelize) {
        super.init(
            {
                client_id: {
                    type: DataTypes.INTEGER,
                },
                receiptNumber: {
                    type: DataTypes.STRING,
                },
                totalPayment: {
                    type: DataTypes.STRING,
                },
                fileName: {
                    type: DataTypes.STRING,
                },
            },
            {
                sequelize,
                tableName: 'receipts',
            }
        )
    }
    static associate(models) {
        this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' })
        this.hasMany(models.MonthlyPayment, { foreignKey: 'receipt_id', as: 'monthlyPayment' })
    }
}

module.exports = Receipt
