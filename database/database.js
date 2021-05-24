const { Sequelize } = require('sequelize')

const connection = new Sequelize('blugger', 'root', '562347', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection