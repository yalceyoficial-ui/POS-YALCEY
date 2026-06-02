const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const roleGuard = require('../middleware/roleGuard')
const {
  getAll, getOne, create, update, remove, adjustStock
} = require('../controllers/productController')

router.get('/', auth, getAll)
router.get('/:id', auth, getOne)
router.post('/', auth, roleGuard('ADMIN'), create)
router.put('/:id', auth, roleGuard('ADMIN'), update)
router.delete('/:id', auth, roleGuard('ADMIN'), remove)
router.patch('/:id/stock', auth, adjustStock)

module.exports = router