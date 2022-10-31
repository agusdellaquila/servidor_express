const { Router } = require('express')
const router = Router()
const user = require('../controllers/user.controller')

//user page
router.get('/profile', user.getUserProfilePage)
//login
router.get('/', user.getUserLogin)
router.post('/', user.postUserLogin)
//logout
router.get('/logout', user.getUserLogout)
//register
router.get('/register', user.getRegister)
router.post('/register', user.postRegister)

module.exports = router