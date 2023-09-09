'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('ShuttleSchedules', [{
      departingLocation: 'Anggrek',
      departureTime: '07:30:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      departingLocation: 'Anggrek',
      departureTime: '09:30:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      departingLocation: 'Anggrek',
      departureTime: '11:30:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      departingLocation: 'Anggrek',
      departureTime: '13:30:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      departingLocation: 'Anggrek',
      departureTime: '15:30:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      departingLocation: 'Anggrek',
      departureTime: '17:30:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      departingLocation: 'Alsut',
      departureTime: '07:30:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      departingLocation: 'Alsut',
      departureTime: '09:30:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      departingLocation: 'Alsut',
      departureTime: '11:30:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      departingLocation: 'Alsut',
      departureTime: '13:30:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      departingLocation: 'Alsut',
      departureTime: '15:30:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      departingLocation: 'Alsut',
      departureTime: '17:30:00',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('ShuttleSchedules', null, {});
  }
};
