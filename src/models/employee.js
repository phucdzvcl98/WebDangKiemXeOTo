'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class Employee extends Model {

    static associate(models) {

      Employee.hasMany(models.Booking, {
        foreignKey: 'employeeId',
        as: 'employeeBookings'
      });

    }
  }

  Employee.init({
    fullName: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    centerId: DataTypes.INTEGER,
    position: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Employee',
  });

  return Employee;
};