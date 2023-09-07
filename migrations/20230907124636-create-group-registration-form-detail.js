'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GroupRegistrationFormDetails', {
      groupRegistrationID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'GroupRegistrationForms',
          key: 'groupRegistrationID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
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
    await queryInterface.dropTable('GroupRegistrationFormDetails');
  }
};