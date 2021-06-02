const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('./User')
const Category = require('../categories/Category')
const session = require('express-session')

const MIDadminAuth = require('../middlewares/adminAuth')

router.get('/admin/users', MIDadminAuth, (req, res) => {
    User.findAll().then(users => {
        Category.findAll().then(categories => {
            res.render('admin/users/all', {users, req, categories})
        })
    })
})

router.get('/register', (req, res) => {
    Category.findAll().then(categories => {
        res.render('admin/users/register', {req: req, categories: categories})
    })
})

router.post('/register', (req, res) => {
    let username = req.body.username
    let email = req.body.email
    let password = req.body.password

    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user == undefined) {
            let salt = bcrypt.genSaltSync(10)
            let hash = bcrypt.hashSync(password, salt)

            User.create({
                username: username,
                email: email,
                password: hash
            }).then(() => {
                res.redirect('/')
            }).catch(err => {
                res.redirect('/')
            })
        } else {
            res.redirect('/admin/users')
        }
    })
})

router.get('/login', (req, res) => {
    if (req.session.user == undefined) {
        Category.findAll().then(categories => {
            res.render('admin/users/login', {categories, req: req})
        })
    } else {
        res.redirect('/')
    }
})

router.post('/authenticate', (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if (user != undefined) {
            let correct = bcrypt.compareSync(password, user.password)

            if (correct) {
                req.session.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
                res.redirect('/admin/articles')
            } else {
                res.redirect('/login')
            }
        } else {
            res.redirect('/login')
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.user = undefined
    res.redirect('/')
})

module.exports = router
