const { Model, Sequelize } = require('sequelize')

class Permission extends Model {
    static init(sequelize) {
        super.init(
            { 
                name: {
                    type: Sequelize.STRING,
                },
                description: {
                    type: Sequelize.STRING,
                },
            },
            {
                sequelize,
                tableName: 'permissions',
            }
        ) 
    }
    static associate(models) {
        this.belongsToMany(models.Role, {
            foreignKey: 'permission_id',
            through: 'role_permissions',
            as: 'permission',
        })
    }
}

module.exports = Permission
