const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Stocks = new Schema({
  //key - _id
  stockCode: {type: 'String', required: true},
  stockName: {type: 'String'},
  ip: {type: 'String'},
})
module.exports = mongoose.model('csm-stocks', Stocks)
