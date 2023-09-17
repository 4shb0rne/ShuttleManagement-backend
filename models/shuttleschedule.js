'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShuttleSchedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.RegistrationFormDetail, {
        foreignKey: 'scheduleID',
        as: 'schedulesDetails' // This creates an alias for the relation for easier querying
    });
    }
  }
  ShuttleSchedule.init({
    scheduleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true  
    },
    departingLocation: DataTypes.STRING,
    destinationLocation: DataTypes.STRING,
    departureTime: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'ShuttleSchedule',
  });
  return ShuttleSchedule;
};