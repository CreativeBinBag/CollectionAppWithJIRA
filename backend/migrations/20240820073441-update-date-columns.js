'use strict';
const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change the column type to DATEONLY for all relevant columns
    await queryInterface.changeColumn('items', 'custom_date1_value', {
      type: DataTypes.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('items', 'custom_date2_value', {
      type: DataTypes.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('items', 'custom_date3_value', {
      type: DataTypes.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the column type changes if rolling back
    await queryInterface.changeColumn('items', 'custom_date1_value', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('items', 'custom_date2_value', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('items', 'custom_date3_value', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  }
};
