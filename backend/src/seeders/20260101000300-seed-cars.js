'use strict';

const cars = require('../seed/cars.json');

module.exports = {
  async up(queryInterface) {
    const [rows] = await queryInterface.sequelize.query('SELECT COUNT(*) AS count FROM cars');
    if (Number(rows[0].count) > 0) {
      console.log('Cars table already has data; skipping seed.');
      return;
    }

    const now = new Date();
    await queryInterface.bulkInsert(
      'cars',
      cars.map((car) => ({
        ...car,
        created_at: now,
        updated_at: now
      }))
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('cars', null, {});
  }
};
