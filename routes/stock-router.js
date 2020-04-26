const express = require('express')

const StockCtrl = require('../controllers/stock-ctrl')

const stockRouter = express.Router()

stockRouter.post('/stock', StockCtrl.createStock)
stockRouter.put('/stock/:_id', StockCtrl.updateStock)
stockRouter.delete('/stock/:_id', StockCtrl.deleteStock)
stockRouter.get('/stock/:_id', StockCtrl.getStockById)
stockRouter.get('/stocks', StockCtrl.getStocks)

module.exports = stockRouter
