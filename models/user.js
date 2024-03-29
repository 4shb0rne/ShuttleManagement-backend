"use strict";
const { Model, ARRAY } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    User.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            username: DataTypes.STRING,
            password: DataTypes.STRING,
            user_role: DataTypes.STRING,
            access_rights: DataTypes.JSON,
        },
        {
            sequelize,
            modelName: "User",
        }
    );
    return User;
};
