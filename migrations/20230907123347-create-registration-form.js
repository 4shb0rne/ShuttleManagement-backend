'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RegistrationForms', {
      RegistrationID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      binusianID: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      purpose: {
        type: Sequelize.STRING
      },
      useDate: {
        type: Sequelize.DATE
      },
      otp: {
        type: Sequelize.STRING
      },
      verification_status :{
        type: Sequelize.STRING,
        defaultValue: "Unverified"
      },
      attendance_status: {
        type: Sequelize.STRING,
        defaultValue: "Absent"
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
    await queryInterface.dropTable('RegistrationForms');
  }
};