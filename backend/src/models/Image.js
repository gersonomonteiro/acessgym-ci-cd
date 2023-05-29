const { Model, DataTypes } = require('sequelize')

class Image extends Model {
    static init(sequelize) {
        super.init(
            {
                path: {
                    type: DataTypes.STRING,
                },
                user_id: {
                    type: DataTypes.INTEGER,
                },
                client_id: {
                    type: DataTypes.INTEGER,
                },
            },
            {
                sequelize,
                tableName: 'images',
            }
        )
    }
    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
        this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' })
    }
}

module.exports = Image
