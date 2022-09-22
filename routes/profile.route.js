const { Router } = require('express')
const {getProfileController} = require('../controllers/profile.controller')

const profileRouter = Router()

profileRouter.get('/', getProfileController)

module.exports = profileRouter;