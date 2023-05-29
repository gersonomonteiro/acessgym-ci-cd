const { Model, Sequelize } = require('sequelize')

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                firstname: {
                    type: Sequelize.STRING,
                },
                lastname: {
                    type: Sequelize.STRING,
                },
                phone: {
                    type: Sequelize.STRING,
                },
                email: {
                    type: Sequelize.STRING,
                },
                password: {
                    type: Sequelize.STRING,
                },
                ative: {
                    type: Sequelize.BOOLEAN,
                },
            },
            {
                sequelize,
                tableName: 'users',
            }
        )
    }

    static associate(models) {
        this.hasOne(models.Image, { foreignKey: 'user_id', as: 'image' })
        this.belongsToMany(models.Role, {
            foreignKey: 'user_id',
            through: 'user_roles',
            as: 'roles',
        })
    }
}
module.exports = User
