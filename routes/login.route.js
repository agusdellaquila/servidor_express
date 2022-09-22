const { Router } = require('express')
const {getLoginController, postLoginController} = require('../controllers/login.controller')

const loginRouter = Router()

loginRouter.get('/', getLoginController)
loginRouter.post('/', postLoginController)

module.exports = loginRouter;