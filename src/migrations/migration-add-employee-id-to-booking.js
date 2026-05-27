'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Bookings', 'employeeId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Bookings', 'employeeId');
  }
};