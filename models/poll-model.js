const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Polls = new Schema({
  //key - _id
  question: {type: 'String', required: true},
  answers: [{
    answer: {type: 'String', required: true},
    votes: {type: 'Number', required: true},
  }],
  ip: {type: 'String'},
  twitterId: {type: 'String'},
})
module.exports = mongoose.model('BVA-polls', Polls)
