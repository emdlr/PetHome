'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pictures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerId: {
        allowNull:false,
        type: Sequelize.INTEGER,
        references:{
          model:'Users',
          key:'id'
        }
      },
      petId: {
        allowNull:false,
        type: Sequelize.INTEGER,
        references:{
          model:'Pets',
          key:'id'
        },
        onDelete:'cascade'
      },
      picture: {
        allowNull:false,
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
    }).then(() => queryInterface.addIndex('Pictures', ['ownerId']));
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Pictures');
  }
};