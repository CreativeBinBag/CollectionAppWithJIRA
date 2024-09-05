'use strict';

const { DataTypes, QueryInterface } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the column exists before adding it
    const tableDescription = await queryInterface.describeTable('items');
    if (!tableDescription.likesCount) {
      await queryInterface.addColumn('items', 'likesCount', {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Check if the column exists before removing it
    const tableDescription = await queryInterface.describeTable('items');
    if (tableDescription.likesCount) {
      await queryInterface.removeColumn('items', 'likesCount');
    }
  }
};

