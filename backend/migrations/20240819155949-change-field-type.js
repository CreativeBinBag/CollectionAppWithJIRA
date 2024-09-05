'use strict';

const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('collections', 'categoryId', {

      type: DataTypes.STRING, // Change to the new datatype you need
      allowNull: false // Adjust as needed
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('collections', 'categoryId', {
      type: DataTypes.UUID, // Revert to the old datatype
      allowNull: false// Adjust as needed
    });
  }
};
