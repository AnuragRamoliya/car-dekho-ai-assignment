'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shortlist_items', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      session_id: { type: Sequelize.STRING(120), allowNull: false },
      car_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'cars', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      created_at: { type: Sequelize.DATE, allowNull: false }
    });
    await queryInterface.addConstraint('shortlist_items', {
      fields: ['session_id', 'car_id'],
      type: 'unique',
      name: 'shortlist_items_session_car_unique'
    });
    await queryInterface.addIndex('shortlist_items', ['session_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('shortlist_items');
  }
};
