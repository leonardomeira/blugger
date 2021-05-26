const { Router } = require('express')
const express = require('express')
const router = express.Router()
const slugify = require('slugify')
const Category = require('./Category')

router.get('/admin/categories/new', (req, res) => {
    res.render('admin/categories/new')
})

router.post('/admin/categories/save', (req, res) => {
    var title = req.body.title
    if(title != undefined) {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect('/admin/categories')
        })
    } else {
        res.redirect('/admin/categories/new')
    }
})

router.get('/admin/categories', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/categories/all', {categories: categories})
    })
})

router.post('/admin/categories/delete', (req, res) => {
    var id = req.body.id
    if (id !=undefined) {
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

module.exports = router;