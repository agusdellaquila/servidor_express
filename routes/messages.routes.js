const { Router } = require('express')
const router = Router()
const messages = require('../controllers/messages.controller')

router.get('/:email', messages.getAllMessages)

module.exports = router