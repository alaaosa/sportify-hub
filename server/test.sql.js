const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('test', 'test', 'test', {
  dialect: 'mssql',
  host: 'localhost',
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  },
});

console.log('Sequelize instance created successfully');

//taskkill /F /IM node.exe