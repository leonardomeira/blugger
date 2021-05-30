const express = require('express')
const app = express()
const session = require('express-session')
const connection = require('./database/database')

//Controllers
const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/ArticlesController')
const usersController = require('./users/UsersController')

//Models
const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./users/User')

app.set('view engine', 'ejs') // Setando a template engine

//Sessions
app.use(session({
    secret: "w56f1e4654fw6ef4wa6",
    cookie: {
        maxAge: 30000000 // Tempo de expiração da sessão
    }
}))

app.use(express.static('public')) // Pasta de arq. estáticos

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

app.use('/', [categoriesController, articlesController, usersController])

app.get('/session', (req, res) => {
    req.session.treinamento = 'Training'
    req.session.user = {
        username: "leomeira",
        email: 'teste@email.com',
        id: 1
    }
    res.send('Sessão gerada')
})

app.get('/leitura', (req, res) => {
    res.json({
        treinamento: req.session.treinamento,
        user: req.session.user
    })
})

app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4,
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', { articles: articles, categories: categories, req: req })
        })
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
            Category.findAll().then(categories => {
            res.render('article', { article: article, categories: categories, req: req })
        })
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})

app.get('/category/:slug', (req, res) => {
    let slug = req.params.slug
    Category.findOne({
        where: {
            slug
        },
        include: [{model: Article}]
    }).then(category => {
        if (category != undefined) {
            Category.findAll().then(categories => {
                res.render('index', {articles: category.articles, categories})
            })
        } else {
            res.redirect('/')
        }
    }).catch(erro => {
        res.redirect('/')
    })
})

app.listen(80, () => {
    console.log('Server is running')
})
