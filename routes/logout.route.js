const { Router } = require('express')
const {getLogoutController} = require('../controllers/logout.controller')

const logoutRouter = Router()

logoutRouter.get('/', getLogoutController)

module.exports = logoutRouter;