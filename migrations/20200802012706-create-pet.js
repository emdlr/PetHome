'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pets', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Users',
          key:'id'
        },
        onDelete:'cascade'
      },
      statusId: {
        allowNull:false,
        type: Sequelize.INTEGER,
        references:{
          model:'Statuses',
          key:'id'
        }
      },
      name: {
        allowNull:false,
        type: Sequelize.STRING
      },
      type: {
        allowNull:false,
        type: Sequelize.STRING
      },
      country: {
        allowNull:false,
        type: Sequelize.STRING
      },
      state: {
        allowNull:false,
        type: Sequelize.STRING
      },
      city: {
        allowNull:false,
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Pets');
  }
};