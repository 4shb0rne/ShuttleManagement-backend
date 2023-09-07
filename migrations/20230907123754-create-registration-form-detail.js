'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RegistrationFormDetails', {
      scheduleID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'ShuttleSchedules',
          key: 'scheduleID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      registrationID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'RegistrationForms',
          key: 'RegistrationID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('RegistrationFormDetails');
  }
};