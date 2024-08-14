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
            { name: 'INTERNAL', description: 'Internal', createdAt: new Date(), updatedAt: new Date() },
            { name: 'CREATE_USER', description: 'Criar Utilizador', createdAt: new Date(), updatedAt: new Date() },
            { name: 'READ_USER', description: 'Ver Utilizador', createdAt: new Date(), updatedAt: new Date() },
            { name: 'UPDATE_USER', description: 'Atualizar Utilizador', createdAt: new Date(), updatedAt: new Date() },
            { name: 'DELETE_USER', description: 'Apagar Utilizador', createdAt: new Date(), updatedAt: new Date() },
            { name: 'CREATE_ROLE', description: 'Criar role', createdAt: new Date(), updatedAt: new Date() },
            { name: 'READ_ROLE', description: 'Ver role', createdAt: new Date(), updatedAt: new Date() },
            { name: 'UPDATE_ROLE', description: 'Atualizar role', createdAt: new Date(), updatedAt: new Date() },
            { name: 'DELETE_ROLE', description: 'Apagar role', createdAt: new Date(), updatedAt: new Date() },
            { name: 'CREATE_CLIENT', description: 'Criar cliente', createdAt: new Date(), updatedAt: new Date() },
            { name: 'READ_CLIENT', description: 'Ver cliente', createdAt: new Date(), updatedAt: new Date() },
            { name: 'UPDATE_CLIENT', description: 'Atualizar cliente', createdAt: new Date(), updatedAt: new Date() },
            { name: 'DELETE_CLIENT', description: 'Apagar cliente', createdAt: new Date(), updatedAt: new Date() },
          ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('permissions', null, {});
        await queryInterface.dropTable('permissions')
    }
};