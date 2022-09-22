const { Router } = require('express')
const {getProfileController, postProfileController} = require('../controllers/register.controller')

const registerRouter = Router()

registerRouter.get('/', getProfileController)
registerRouter.post('/', postProfileController)

module.exports = registerRouter;