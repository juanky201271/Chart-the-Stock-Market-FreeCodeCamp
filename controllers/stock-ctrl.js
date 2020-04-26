const Stock = require('../models/stock-model')
const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

createStock = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a stock', })
  }
  const stock = new Stock(body)
  if (!stock) {
    return res.status(400).json({ success: false, error: 'You must provide a correct json stock', })
  }
  var ipAddr = req.headers["x-forwarded-for"]
  if (ipAddr){
    var list = ipAddr.split(",")
    ipAddr = list[list.length-1]
  } else {
    ipAddr = req.connection.remoteAddress
  }
  stock.ip = ipAddr
  await stock
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        _id: stock._id,
        ip: stock.ip,
        message: 'Stock created!',
      })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

updateStock = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a stock', })
  }
  await Stock
    .findOne({ _id: ObjectId(req.params._id) }, (err, stock) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!stock) {
        return res.status(404).json({ success: false, error: 'Stock not found', })
      }
      //await
      stock
        .save()
        .then(() => {
          return res.status(201).json({
            success: true,
            _id: stock._id,
            ip: stock.ip,
            message: 'Stock updated!',
          })
        })
        .catch(err => {
          return res.status(400).json({ success: false, error: err, })
        })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

deleteStock = async (req, res) => {
  await Stock
    .findOneAndDelete({ _id: ObjectId(req.params._id) }, (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      //if (!stock) {
      //  return res.status(404).json({ success: false, error: 'Stock not found', })
      //}
      return res.status(200).json({ success: true, }) // data: stock})
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

getStockById = async (req, res) => {
  await Stock
    .findOne({ _id: ObjectId(req.params._id) }, (err, stock) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!stock) {
        return res.status(404).json({ success: false, error: 'Stock not found', })
      }
      return res.status(200).json({ success: true, data: stock})
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

getStocks = async (req, res) => {
  await Stock
    .find({}, (err, stocks) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!stocks.length) {
        return res.status(404).json({ success: false, error: 'Stocks not found', })
      }
      var ipAddr = req.headers["x-forwarded-for"]
      if (ipAddr){
        var list = ipAddr.split(",")
        ipAddr = list[list.length-1]
      } else {
        ipAddr = req.connection.remoteAddress
      }
      stocksTemp = []
      stocks.map((item, index) => {
        if (item.ip === ipAddr) {
          return stocksTemp.push({
            stockCode: item.stockCode,
            ip: item.ip,
            removable: true,
          })
        } else {
          return stocksTemp.push({
            stockCode: item.stockCode,
            ip: item.ip,
            removable: false,
          })
        }
      })
      return res.status(200).json({ success: true, data: stocksTemp})
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

module.exports = {
  createStock,
  updateStock,
  deleteStock,
  getStockById,
  getStocks,
}
