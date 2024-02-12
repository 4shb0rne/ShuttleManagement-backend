'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true, 
        primaryKey: true, 
        allowNull: false 
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      user_role: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};