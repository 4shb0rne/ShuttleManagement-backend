'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupRegistrationForm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.GroupRegistrationFormDetail, {
        foreignKey: 'groupRegistrationID',
        as: 'details'
    });
    }
  }
  GroupRegistrationForm.init({
    groupRegistrationID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    email: {
      type: DataTypes.STRING
    },
    phoneNumber: {
      type: DataTypes.STRING
    },
    purpose: {
      type: DataTypes.STRING
    },
    forms: {
      type: DataTypes.JSON
    },
    useDate: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'GroupRegistrationForm',
    tableName: 'GroupRegistrationForms',
    timestamps: true, // This ensures createdAt and updatedAt fields are used
  });
  return GroupRegistrationForm;
};