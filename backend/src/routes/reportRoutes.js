const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const roleGuard = require('../middleware/roleGuard')
const { sales, inventory } = require('../controllers/reportController')

router.get('/sales', auth, roleGuard('ADMIN'), sales)
router.get('/inventory', auth, roleGuard('ADMIN'), inventory)

module.exports = router