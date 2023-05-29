const accessController = require('../controllers/access.controller')
const { authJwt } = require('../middleware')

const router = require('express').Router()

router.get('/access', [authJwt.verifyToken], accessController.index)
router.post('/access', [authJwt.verifyToken], accessController.store)

module.exports = router
