"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Dosen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  Dosen.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      kodeDosen: DataTypes.STRING,
      email: DataTypes.STRING,
      namaDosen: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Dosen",
      tableName: 'Dosen',
      timestamps: false
    }
  );
  return Dosen;
};
