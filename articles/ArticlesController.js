const { Router } = require('express')
const express = require('express')
const router = express.Router()
const Article = require('./Article')
const Category = require('../categories/Category')
const slugify = require('slugify')
const { Sequelize } = require('../database/database')

router.get('/admin/articles', (req, res) => {
    Article.findAll({include: [{model: Category}]}).then(articles => {
        res.render('admin/articles/all', {articles: articles})
    })
})

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/articles/new', {categories: categories})
    })
})

router.post('/admin/articles/save', (req, res) => {
    let title = req.body.title
    let body = req.body.body
    let category = req.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(()=> {
        res.redirect('/admin/articles')
    })
})

router.post('/admin/articles/delete', (req, res) => {
    var id = req.body.id
    if (id != undefined) {
        if (!isNaN(id)) {

            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/articles')
            })

        } else { //NaN
            res.redirect('/admin/articles')
        }
    } else { //Undefined
        res.redirect('/admin/articles')
    }
})

router.get('/admin/articles/edit/:id', (req, res) => {
    var id = req.params.id

    if (isNaN(id)) {
        res.redirect('/admin/articles')
    }

    Article.findByPk(id).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render('admin/articles/edit', { article, categories })
            })
        } else {
            res.redirect('/admin/articles')
        }
    }).catch(error => {
        res.redirect('/admin/articles')
    })
})

router.post('/admin/articles/update', (req, res) => {
    let id = req.body.id
    let title = req.body.title
    let body = req.body.body
    let categoryId = req.body.category

    Article.update({title, body, slug: slugify(title), categoryId}, {
        where: {
            id
        }
    }).then(() => {
        res.redirect('/admin/articles')
    }).catch(erro => {
        res.redirect('/')
    })
})

router.get('/articles/page/:num', (req, res) => {
    let page = req.params.num
    let offset = 0

    if (isNaN(page) || page == 1) {
        offset = 0
    } else {
        offset = (parseInt(page) - 1) * 4
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [
            ['id', 'desc']
        ]
    }).then(articles => {

        let next
        if(offset + 4 >= articles.count) {
            next = false
        } else {
            next = true
        }

        let result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render('admin/articles/page', {result, categories})
        })

    })
})


module.exports = router;