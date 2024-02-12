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
      binusianID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      kodeDosen: DataTypes.STRING,
      emails: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          const value = this.getDataValue("emails");
          return value ? JSON.parse(value) : [];
        },
        set(val) {
          this.setDataValue("emails", JSON.stringify(val));
        },
      },
      namaDosen: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Dosen",
      tableName: 'Dosen',
      timestamps: true,
    }
  );
  return Dosen;
};
