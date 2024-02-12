'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Dosen', {
      binusianID: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      kodeDosen: {
        type: Sequelize.STRING
      },
      emails: {
        type: Sequelize.TEXT,
        allowNull: true,
        get() {
          const value = this.getDataValue('emails');
          return value ? JSON.parse(value) : null;
        },
        set(val) {
          this.setDataValue('emails', JSON.stringify(val));
        }
      },
      namaDosen: {
        type: Sequelize.STRING
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Dosen');
  }
};
