'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {

      await queryInterface.createTable('configutations', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
                unique: true,
            },
            value: {
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
        // Insert data into the table
        await queryInterface.bulkInsert('configutations', [
          { name: 'setup', value: 'false', createdAt: new Date(), updatedAt: new Date() }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('configutations', null, {});
        await queryInterface.dropTable('configutations')
    }
};