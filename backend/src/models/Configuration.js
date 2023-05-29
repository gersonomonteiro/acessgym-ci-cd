const { Model, DataTypes } = require('sequelize')

class Configutation extends Model {
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: DataTypes.STRING,
                },
                value: {
                    type: DataTypes.STRING,
                },
            },
            {
                sequelize,
                tableName: 'configutations',
            }
        )
    }
}

module.exports = Configutation
