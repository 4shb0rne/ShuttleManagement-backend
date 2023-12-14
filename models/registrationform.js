"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RegistrationForm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.RegistrationFormDetail, {
        foreignKey: "registrationID",
        as: "details",
      });
    }
  }
  RegistrationForm.init(
    {
      RegistrationID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      binusianID: DataTypes.STRING,
      name: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      email: DataTypes.STRING,
      purpose: DataTypes.STRING,
      useDate: DataTypes.DATE,
      otp: { type: DataTypes.STRING, defaultValue: false },
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "RegistrationForm",
    }
  );
  return RegistrationForm;
};
