const mongoose = require("mongoose")
const Schema = mongoose.Schema
const UsersTwitterId = new Schema({
  //key - twitterId
  twitterId: { type: 'String', unique: true },
  name: 'String',
  screenName: 'String',
  profileImageUrl: 'String',
  token: 'String',
  tokenSecret: 'String',
  votes: [{
    poll_id: {type: 'String' },
    answer: {type: 'String' },
  }],
})
module.exports = mongoose.model("BVA-users-twitterId", UsersTwitterId)
