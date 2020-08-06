'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Adoption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Adoption.belongsTo(models.User,{foreignKey:'adopterId'});
    }
  };
  Adoption.init({
    petId: DataTypes.INTEGER,
    adopterId: DataTypes.INTEGER,
    adoptionDate: DataTypes.DATE,
    rejectionDate: DataTypes.DATE,
    cancelDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Adoption',
  });
  return Adoption;
};