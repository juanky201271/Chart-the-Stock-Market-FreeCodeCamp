const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Stocks = new Schema({
  //key - _id
  stockCode: {type: 'String', required: true},
  dataset: {type: 'String'},
  pulledDate: {type: 'Date', required: true},
  ip: {type: 'String'},
})
module.exports = mongoose.model('csm-stocks', Stocks)
