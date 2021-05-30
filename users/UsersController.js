const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const User = require('./User')
const session = require('express-session')

router.get('/admin/users', (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/all', {users})
    })
})

router.get('/admin/users/register', (req, res) => {
    res.render('admin/users/register')
})

router.post('/users/register', (req, res) => {
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
    res.render('admin/users/login')
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
                    email: user.email
                }
            } else {
                res.redirect('/login')
            }
        } else {
            res.redirect('/login')
        }
    })
})

module.exports = router