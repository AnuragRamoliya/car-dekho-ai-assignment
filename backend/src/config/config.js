require('dotenv').config();

const base = {
  username: process.env.DB_USER || 'cardekho',
  password: process.env.DB_PASSWORD || 'cardekho_password',
  database: process.env.DB_NAME || 'cardekho_shortlist',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  dialect: 'mysql',
  logging: false
};

module.exports = {
  development: base,
  test: base,
  production: base
};
