'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pet extends Model {
    static associate(models) {
     Pet.belongsTo(models.User, { foreignKey: "userId" });
      Pet.belongsToMany(models.User, {
        through: "Adoption",
        foreignKey: "petId",
        otherKey: "adopterId",
      });
      Pet.hasOne(models.Status, { foreignKey: "id" });
      Pet.hasMany(models.Picture, { foreignKey: "petId" });
    }
  }
  Pet.init({
    userId: DataTypes.INTEGER,
    statusId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pet',
  });
  return Pet;
};