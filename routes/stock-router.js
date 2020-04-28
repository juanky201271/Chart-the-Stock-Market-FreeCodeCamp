const express = require('express')
const stockRouter = express.Router()

module.exports = function(io) {
  const StockCtrl = require('../controllers/stock-ctrl')(io)

  stockRouter.post('/stock/table/:table', StockCtrl.createStock)
  stockRouter.put('/stock/:_id', StockCtrl.updateStock)
  stockRouter.delete('/stock/:_id', StockCtrl.deleteStock)
  stockRouter.get('/stock/:_id', StockCtrl.getStockById)
  stockRouter.get('/stocks', StockCtrl.getStocks)
  stockRouter.get('/stocks/data', StockCtrl.getStocksData)

  return stockRouter
}
