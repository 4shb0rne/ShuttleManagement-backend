"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RegistrationFormDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.RegistrationForm, {
        foreignKey: "registrationID",
        onDelete: "CASCADE",
      });

      // Association to ShuttleSchedule
      this.belongsTo(models.ShuttleSchedule, {
        foreignKey: "scheduleID",
        as: "schedulesDetails",
        onDelete: "CASCADE",
      });
    }
  }
  RegistrationFormDetail.init(
    {
      scheduleID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      registrationID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "RegistrationFormDetail",
      autoIncrement: false,
      id: false,
    }
  );
  return RegistrationFormDetail;
};
