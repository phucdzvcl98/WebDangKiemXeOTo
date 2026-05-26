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
      User.belongsTo(models.Allcode, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData' })
      User.belongsTo(models.Allcode, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' })
      User.hasOne(models.Markdown, { foreignKey: 'centerId' })
      User.hasOne(models.Center_Infor, { foreignKey: 'centerId' })

      User.hasMany(models.Schedule, { foreignKey: 'centerId', as: 'centerData' })

      User.hasMany(models.Booking, { foreignKey: 'ownId', as: 'ownData' })

    }
  };
  User.init({
    centerId: DataTypes.STRING,
    ownId: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    fullName: DataTypes.STRING,
    address: DataTypes.STRING,
    gender: DataTypes.STRING,
    image: DataTypes.BLOB('long'),
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING,



  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};