'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.RegistrationForm, {
        foreignKey: 'registrationID',
        onDelete: 'CASCADE' // this means if a RegistrationForm is deleted, its details are also deleted
      });
    }
  }
  Attendance.init({
    AttendanceID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true  
    },
    registrationID: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};