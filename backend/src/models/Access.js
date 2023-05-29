const { Model, DataTypes } = require('sequelize')

class Access extends Model {
    static init(sequelize) {
        super.init(
            {
                client_id: {
                    type: DataTypes.INTEGER,
                },
                status: {
                    type: DataTypes.BOOLEAN,
                },
            },
            {
                sequelize,
                tableName: 'accesses',
            }
        )
    }
    static associate(models) {
        this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' })
    }
}

module.exports = Access
