const multer = require('multer')
const express = require('express')
const path = require('path')

const { authJwt } = require('../middleware')
const uploadConfig = require('../config/upload')
const clientController = require('../controllers/client.controller')

const { body, check, validationResult } = require('express-validator')

const router = require('express').Router()
const upload = multer(uploadConfig.uploads)

router.post('/client/id', [authJwt.verifyToken], clientController.show)
//router.get('/client/:id', [authJwt.verifyToken], clientController.showById)
router.get('/YHxmMxpyhuc45GCyB9J3/:id', clientController.showById)
router.get('/client', [authJwt.verifyToken], clientController.index)
router.post(
    '/client',
    [authJwt.verifyToken],
    upload.single('image'),
    clientController.store
)
router.put(
    '/client/:id',
    [authJwt.verifyToken],
    upload.single('image'),
    clientController.update
)
router.delete('/client/:id', [authJwt.verifyToken], clientController.remove)
router.get('/clients/ative', clientController.inspiredMonthlyFee)
router.get('/clients/sendnotificationbyemail', clientController.sendClientNotificationByEmail)
module.exports = router
