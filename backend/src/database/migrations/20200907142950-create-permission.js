'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('permissions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            description: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
        })
        await queryInterface.bulkInsert('permissions', [
            { name: 'CREATE_USER', description: 'Criar Utilizador', createdAt: new Date(), updatedAt: new Date() },
            { name: 'READ_USER', description: 'Ver Utilizador', createdAt: new Date(), updatedAt: new Date() },
            { name: 'UPDATE_USER', description: 'Atualizar Utilizador', createdAt: new Date(), updatedAt: new Date() },
            { name: 'DELETE_USER', description: 'Apagar Utilizador', createdAt: new Date(), updatedAt: new Date() },

          ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('permissions', null, {});
        await queryInterface.dropTable('permissions')
    }
};