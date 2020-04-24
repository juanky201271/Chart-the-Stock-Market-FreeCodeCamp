const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UsersIp = new Schema({
  //key - ip
  ip: { type: 'String', unique: true },
  votes: [{
    poll_id: {type: 'String' },
    answer: {type: 'String' },
  }],
})
module.exports = mongoose.model('BVA-users-ip', UsersIp)
