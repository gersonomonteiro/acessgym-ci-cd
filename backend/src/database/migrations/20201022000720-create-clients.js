'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('clients', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            fullName: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            phone: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            email: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true,
            },
            cardCode: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            genre: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            address: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            birthday: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            ative: {
                allowNull: false,
                type: Sequelize.BOOLEAN,
            },
            monthlyPaymentDate: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
        })
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('clients')
    },
}
