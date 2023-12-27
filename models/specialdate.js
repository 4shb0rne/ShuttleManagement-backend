'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SpecialDate extends Model {
    static associate(models) {
      // define association here
    }
  };
  SpecialDate.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    date: DataTypes.DATE,
    reason: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SpecialDate',
  });
  return SpecialDate;
};
