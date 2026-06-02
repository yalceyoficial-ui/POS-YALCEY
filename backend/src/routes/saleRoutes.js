const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { create, getAll } = require('../controllers/saleController')

router.post('/', auth, create)
router.get('/', auth, getAll)

module.exports = router