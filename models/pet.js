'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pet extends Model {
    static associate(models) {
     Pet.belongsTo(models.User, { foreignKey: "id" });
      // Pet.belongsToMany(models.User, {
      //   through: "Adoption",
      //   foreignKey: "petId",
      //   otherKey: "adopterId",
      // });
      Pet.belongsTo(models.Status,{foreignKey:"statusId"}) 
  
      
      Pet.hasMany(models.Picture, { foreignKey: "petId" });
      
      
      // Pet.hasOne(models.User, { foreignKey: "id" });
    }
  }
  Pet.init({
    userId: DataTypes.INTEGER,
    statusId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pet',
  });
  return Pet;
};