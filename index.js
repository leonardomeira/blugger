const express = require('express')
const app = express()
const connection = require('./database/database')

app.set('view engine', 'ejs') // Setando a template engine

app.use(express.static('public')) // Setando a pasta de arq. estáticos

//Embedded express bodyparser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//Database
connection
    .authenticate()
    .then(() => {
        console.log('Successfully connected to the DB')
    })
    .catch((error) => {
        console.log(`An error has occured while trying to connect to the DB: ${error}`)
    })

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(4000, () => {
    console.log('Server is running')
})