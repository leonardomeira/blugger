const Sequelize = require('sequelize')
const connection = require('../database/database')

const User = connection.define('users', {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})


module.exports = User