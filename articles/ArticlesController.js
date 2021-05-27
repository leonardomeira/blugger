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


module.exports = router;