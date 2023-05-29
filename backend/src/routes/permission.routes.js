const permissionController = require('../controllers/permission.controller')
const { authJwt } = require('../middleware')

const router = require('express').Router()

router.get('/permissions', [authJwt.verifyToken], permissionController.index)
router.post('/permission', [authJwt.verifyToken], permissionController.store)
router.put(
    '/permission/:id',
    [authJwt.verifyToken],
    permissionController.update
)
router.delete(
    '/permission/:id',
    [authJwt.verifyToken],
    permissionController.remove
)

module.exports = router
