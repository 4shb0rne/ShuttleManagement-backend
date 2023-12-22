"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Customshuttleschedule extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Customshuttleschedule.init(
        {
            customScheduleID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            departingLocation: DataTypes.STRING,
            destinationLocation: DataTypes.STRING,
            departureTime: DataTypes.TIME,
            day: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "customshuttleschedule",
        }
    );
    return Customshuttleschedule;
};
