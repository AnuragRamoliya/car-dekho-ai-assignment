'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cars', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      make: { type: Sequelize.STRING(80), allowNull: false },
      model: { type: Sequelize.STRING(120), allowNull: false },
      variant: { type: Sequelize.STRING(120), allowNull: false },
      body_type: {
        type: Sequelize.ENUM('hatchback', 'sedan', 'suv', 'muv', 'coupe'),
        allowNull: false
      },
      fuel_type: {
        type: Sequelize.ENUM('petrol', 'diesel', 'electric', 'hybrid', 'cng'),
        allowNull: false
      },
      transmission: { type: Sequelize.ENUM('manual', 'automatic'), allowNull: false },
      price_min: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      price_max: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      mileage_kmpl: { type: Sequelize.FLOAT, allowNull: true },
      range_km: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true },
      seating_capacity: { type: Sequelize.INTEGER.UNSIGNED, allowNull: false },
      safety_rating: { type: Sequelize.FLOAT, allowNull: false },
      engine_cc: { type: Sequelize.INTEGER.UNSIGNED, allowNull: true },
      battery_kwh: { type: Sequelize.FLOAT, allowNull: true },
      power_bhp: { type: Sequelize.FLOAT, allowNull: false },
      image_url: { type: Sequelize.STRING(500), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false }
    });
    await queryInterface.addIndex('cars', ['make', 'model']);
    await queryInterface.addIndex('cars', ['body_type']);
    await queryInterface.addIndex('cars', ['fuel_type']);
    await queryInterface.addIndex('cars', ['price_min', 'price_max']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cars');
  }
};
