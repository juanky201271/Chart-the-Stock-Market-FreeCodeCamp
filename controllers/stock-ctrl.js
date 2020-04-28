const Stock = require('../models/stock-model')
const mongoose = require('mongoose')
var Quandl = require("quandl")

const ObjectId = mongoose.Types.ObjectId

function formatDate(date) {
    var d = date ? new Date(date) : new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
}

var quandl = new Quandl({
    auth_token: process.env.QUANDL_API_KEY,
})

var params = {
  order: "asc",
  exclude_column_names: true,
  // Notice the YYYY-MM-DD format
  start_date: ((new Date().getFullYear() - 5).toString()) + "-01-01",
  end_date: formatDate(),
  column_index: 4,
  format: 'json'
}

var query =  {
    source: 'WIKI',
    table: ' '
}

module.exports = function(io) {
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

    query.table = req.params.table
    await quandl.dataset(query, params, async function(err, response) {
      if (JSON.parse(response).dataset && !err) {
        stock.stockCode = req.params.table
        stock.ip = ipAddr
        stock.pulledDate = new Date()
        stock.dataset = response
        await stock
          .save()
          .then(() => {
            io.emit("Stock", {message: 'Created new Stock Code: ' + query.table})
            return res.status(201).json({
              success: true,
              data: stock,
              message: 'Stock created!',
            })
          })
          .catch(err => {
            return res.status(400).json({ success: false, error: err, })
          })
      } else {
        return res.status(400).json({ success: false, error: JSON.parse(response).quandl_error.message, })
      }
    })
  }

  updateStock = async (req, res) => {
    const body = req.body
    if (!body) {
      return res.status(400).json({ success: false, error: 'You must provide a stock', })
    }
    await Stock
      .findOne({ _id: ObjectId(req.params._id) }, async (err, stock) => {
        if (err) {
          return res.status(400).json({ success: false, error: err, })
        }
        if (!stock) {
          return res.status(404).json({ success: false, error: 'Stock not found', })
        }
        //await
        query.table = stock.stockCode
        await quandl.dataset(query, params, function(err, response) {
          if (JSON.parse(response).dataset && !err) {
            stock.pulledDate = new Date()
            stock.dataset = response
            stock
              .save()
              .then(() => {
                io.emit("Stock", {message: 'Update Stock Code: ' + query.table})
                return res.status(201).json({
                  success: true,
                  data: stock,
                  message: 'Stock updated!',
                })
              })
              .catch(err => {
                return res.status(400).json({ success: false, error: err, })
              })
          } else {
            console.log(JSON.parse(response).quandl_error.message)
          }
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
        io.emit("Stock", {message: 'Delete Stock Code'})
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
        var ipAddr = req.headers["x-forwarded-for"]
        if (ipAddr){
          var list = ipAddr.split(",")
          ipAddr = list[list.length-1]
        } else {
          ipAddr = req.connection.remoteAddress
        }
        stockTemp = []
        if (stock.ip === ipAddr) {
          stockTemp.push({
            _id: stock._id,
            stockCode: stock.stockCode,
            ip: stock.ip,
            dataset: JSON.parse(stock.dataset),
            pulledDate: stock.pulledDate,
            removable: true,
          })
        } else {
          stockTemp.push({
            _id: stock._id,
            stockCode: stock.stockCode,
            ip: stock.ip,
            dataset: JSON.parse(stock.dataset),
            pulledDate: stock.pulledDate,
            removable: false,
          })
        }
        return res.status(200).json({ success: true, data: stockTemp})
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
              _id: item._id,
              stockCode: item.stockCode,
              ip: item.ip,
              pulledDate: item.pulledDate,
              name: JSON.parse(item.dataset).dataset.name,
              removable: true,
            })
          } else {
            return stocksTemp.push({
              _id: item._id,
              stockCode: item.stockCode,
              ip: item.ip,
              pulledDate: item.pulledDate,
              name: JSON.parse(item.dataset).dataset.name,
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
  getStocksData = async (req, res) => {
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
              _id: item._id,
              stockCode: item.stockCode,
              ip: item.ip,
              dataset: JSON.parse(item.dataset),
              pulledDate: item.pulledDate,
              removable: true,
            })
          } else {
            return stocksTemp.push({
              _id: item._id,
              stockCode: item.stockCode,
              ip: item.ip,
              dataset: JSON.parse(item.dataset),
              pulledDate: item.pulledDate,
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

  return {
    createStock,
    updateStock,
    deleteStock,
    getStockById,
    getStocks,
    getStocksData,
  }

}
