const { Sequelize } = require('sequelize')

const connection = new Sequelize('blugger', 'root', '562347', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection