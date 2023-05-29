const multer = require('multer')
const express = require('express')
const path = require('path')

const { authJwt } = require('../middleware')
const uploadConfig = require('../config/upload')
const userController = require('../controllers/user.controller')

const { body, check, validationResult } = require('express-validator')

const router = require('express').Router()
const upload = multer(uploadConfig.uploads)

router.post('/user/id', [authJwt.verifyToken], userController.show)
router.get('/user', [authJwt.verifyToken], userController.index)
router.post(
    '/user',
    [authJwt.verifyToken],
    upload.single('image'),
    userController.store
)
router.put(
    '/user/:id',
    [authJwt.verifyToken],
    upload.single('image'),
    userController.update
)
router.put(
    '/user/updatepwd/:id',
    [authJwt.verifyToken],
    userController.updatePassword
)
router.delete('/user/:id', [authJwt.verifyToken], userController.remove)

module.exports = router
