const roleController = require('../controllers/role.controller')
const { authJwt } = require('../middleware')

const router = require('express').Router()

router.get('/roles', roleController.index)
router.get('/role/:id', [authJwt.verifyToken], roleController.show)
router.get('/o7zi8Q4xeg1JjbD3f5v6/:id', roleController.show)
router.post('/role', [authJwt.verifyToken], roleController.store)
router.put('/role/:id', [authJwt.verifyToken], roleController.update)
router.post(
    '/roleaddpermission/:id',
    [authJwt.verifyToken],
    roleController.roleAddPermission
)
router.post(
    '/roleupdateuser/:id',
    [authJwt.verifyToken],
    roleController.roleUpdateUser
)
router.delete('/role/:id', [authJwt.verifyToken], roleController.remove)
router.post('/setuprole/:id', [authJwt.verificarAutorizacao], roleController.roleAddPermission)

module.exports = router

