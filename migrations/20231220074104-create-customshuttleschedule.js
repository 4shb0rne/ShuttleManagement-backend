"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("customshuttleschedules", {
            customScheduleID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            departingLocation: {
                type: Sequelize.STRING,
            },
            destinationLocation: {
                type: Sequelize.STRING,
            },
            departureTime: {
                type: Sequelize.TIME,
            },
            day: {
                type: Sequelize.DATE,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("customshuttleschedules");
    },
};
