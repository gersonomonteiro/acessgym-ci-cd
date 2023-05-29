const receiptController = require('../controllers/receipt.controller')
const { authJwt } = require('../middleware')

const router = require('express').Router()

router.post('/receipts', [authJwt.verifyToken], receiptController.index)
router.post('/receipt', [authJwt.verifyToken], receiptController.store)
router.delete('/receipt/:id', [authJwt.verifyToken], receiptController.remove) 
router.post('/sendreceiptemail', [authJwt.verifyToken], receiptController.sendReceiptByEmail)

module.exports = router
