'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Pet, { foreignKey: "userId" });

      User.hasMany(models.Adoption,{foreignKey:"adopterId"});
      
      User.belongsToMany(models.Role, {
        through: "UserRole",
        foreignKey: "userId",
        otherKey: "roleId",
      });
    }
  };
  User.init({
    name: DataTypes.STRING,
    lastname: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    telephone: DataTypes.STRING,
    email: DataTypes.STRING,
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    zip: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};