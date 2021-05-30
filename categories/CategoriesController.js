const { Router } = require('express')
const express = require('express')
const router = express.Router()
const slugify = require('slugify')
const Category = require('./Category')

router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new')
})

router.post('/admin/categories/new/save', (req, res) => {
    var title = req.body.title
    if (title != undefined) {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/admin/categories')
        })
    } else {
        res.redirect('/admin/categories/new', {req: req})
    }
})

router.get('/admin/categories', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/categories/all', { categories: categories, req: req })
    })
})

router.post('/admin/categories/delete', (req, res) => {
    var id = req.body.id
    if (id != undefined) {
        if (!isNaN(id)) {

            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin/categories')
            })

        } else { //NaN
            res.redirect('/admin/categories')
        }
    } else { //Undefined
        res.redirect('/admin/categories')
    }
})

router.get('/admin/categories/edit/:id', (req, res) => {
    var id = req.params.id

    if (isNaN(id)) {
        res.redirect('/admin/categories')
    }

    Category.findByPk(id).then(category => {
        if (category != undefined) {
            res.render('admin/categories/edit', { category: category, req: req})
        } else {
            res.redirect('/admin/categories')
        }
    }).catch(error => {
        res.redirect('/admin/categories')
    })
})

router.post('/admin/categories/update', (req, res) => {
    let id = req.body.id
    let title = req.body.title

    Category.update({title: title, slug: slugify(title)}, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect('/admin/categories')
    })
})

module.exports = router;