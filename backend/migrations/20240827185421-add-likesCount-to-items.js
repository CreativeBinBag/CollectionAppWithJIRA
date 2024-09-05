'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('items', 'likesCount', {

      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    })
   
  },

down: async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('Items', 'likesCount');

  }
};
