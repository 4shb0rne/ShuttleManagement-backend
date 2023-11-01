'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupRegistrationFormDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.GroupRegistrationForm, {
        foreignKey: "groupRegistrationID",
        onDelete: "CASCADE",
      });

      // Association to ShuttleSchedule
      this.belongsTo(models.ShuttleSchedule, {
        foreignKey: "scheduleID",
        as: "SchedulesDetails",
        onDelete: "CASCADE",
      });
    }
  }
  GroupRegistrationFormDetail.init({
    groupRegistrationID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    scheduleID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    }
  }, {
    sequelize,
    modelName: 'GroupRegistrationFormDetail',
    autoIncrement: false,
    id: false,
  });
  return GroupRegistrationFormDetail;
};