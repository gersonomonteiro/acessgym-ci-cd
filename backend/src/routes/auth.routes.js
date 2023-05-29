//const { verifySignUp } = require("../middleware");
const authController = require('../controllers/auth.controller')
const { authJwt } = require('../middleware')
const multer = require('multer')

const uploadConfig = require('../config/upload')
const upload = multer(uploadConfig.uploads)

const router = require('express').Router()

const { body } = require('express-validator')

router.post('/auth/signup', upload.single('image'), authController.signup)

// [
//     body('firstname').notEmpty().withMessage('the firstname field is required'),
//     body('lastname').notEmpty().withMessage('the lastname field is required'),
//     body('email').isEmail().withMessage('the email field is required'),
//     body('password').notEmpty().withMessage('the password field is required')
// ]

router.post('/auth/signin', authController.signin)


module.exports = router
