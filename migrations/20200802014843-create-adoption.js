'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Adoptions', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      petId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references:{
          model:'Pets',//Table name
          key:'id'
        }
      },
      adopterId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references:{
          model:'Users',
          key:'id'
        }
      },
      adoptionDate: {
        type: Sequelize.DATE
      },
      rejectionDate: {
        type: Sequelize.DATE
      },
      cancelDate: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Adoptions');
  }
};