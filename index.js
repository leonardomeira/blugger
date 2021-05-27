const express = require('express')
const app = express()
const connection = require('./database/database')

//Controllers
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')

//Models
const Article = require('./articles/Article')
const Category = require('./categories/Category')

app.set('view engine', 'ejs') // Setando a template engine

app.use(express.static('public')) // Setando a pasta de arq. estáticos

//Embedded express bodyparser
app.use(express.urlencoded({ extended: false }))
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

app.use('/', [categoriesController, articlesController])

app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {
        res.render('index', { articles: articles })
    })
})

app.get("/:slug", (req, res) => {
    let slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if (article != undefined) {
            res.render('article', { article })
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})

app.listen(4000, () => {
    console.log('Server is running')
})