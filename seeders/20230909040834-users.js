"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        const bcrypt = require("bcryptjs");
        await queryInterface.bulkInsert("Users", [
            {
                username: "SLC",
                password: bcrypt.hashSync("SLC123", 10),
                user_role: "Admin",
                access_rights: JSON.stringify([
                    "Group Registration",
                    "Schedules",
                    "Attendance",
                ]),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                username: "SUPER",
                password: bcrypt.hashSync("SUPER123", 10),
                user_role: "Super",
                access_rights: JSON.stringify([
                    "Group Registration",
                    "Schedules",
                    "Attendance",
                    "Manage Account",
                    "Manage Dosen"
                ]),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        return queryInterface.bulkDelete("Users", null, {});
    },
};
