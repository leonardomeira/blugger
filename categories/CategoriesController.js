const { Router } = require('express')
const express = require('express')
const router = express.Router()

router.get('/categories', (req, res) => {
    res.send('Lista de categorias')
})

router.get('/admin/categories/new', (req, res) => {
    res.send('Nova categoria')
})

module.exports = router;