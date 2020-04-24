const User = require('../models/user-model')
const UserTwitter = require('../models/user-twitter-model')
const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

createUser = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a user', })
  }
  const user = new User(body)
  if (!user) {
    return res.status(400).json({ success: false, error: 'You must provide a correct json user', })
  }

  var ipAddr = req.headers["x-forwarded-for"]
  if (ipAddr){
    var list = ipAddr.split(",")
    ipAddr = list[list.length-1]
  } else {
    ipAddr = req.connection.remoteAddress
  }

  user.ip = ipAddr

  await user
    .save()
  //await User.init()
  //  .then(() => User.create(user))
    .then(() => {
      return res.status(201).json({
        success: true,
        _id: user._id,
        ip: user.ip,
        message: 'User created!',
      })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

updateUserById = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a user', })
  }
  await User
    .findOne({ _id: ObjectId(req.params._id) }, (err, user) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found', })
      }
      user.votes = body.votes
      //await
      user
        .save()
        .then(() => {
          return res.status(201).json({
            success: true,
            _id: user._id,
            ip: user.ip,
            message: 'User updated!',
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

updateUserByIp = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a user', })
  }
  await User
    .findOne({ ip: req.params.ip }, (err, user) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found', })
      }
      user.votes = body.votes
      //await
      user
        .save()
        .then(() => {
          return res.status(201).json({
            success: true,
            _id: user._id,
            ip: user.ip,
            message: 'User updated!',
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

deleteUserById = async (req, res) => {
  await User
    .findOneAndDelete({ _id: ObjectId(req.params._id) }, (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      //if (!user) {
      //  return res.status(404).json({ success: false, error: 'User not found', })
      //}
      return res.status(200).json({ success: true, message: 'User deleted!' }) //, data: user})
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

deleteUserByIp = async (req, res) => {
  await User
    .findOneAndDelete({ ip: req.params.ip }, (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      //if (!user) {
      //  return res.status(404).json({ success: false, error: 'User not found', })
      //}
      return res.status(200).json({ success: true, message: 'User deleted!' }) //, data: user})
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

getUserById = async (req, res) => {
  await User
    .findOne({ _id: ObjectId(req.params._id) }, (err, user) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found by id', })
      }
      return res.status(200).json({ success: true, data: user })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

getUserByIp = async (req, res) => {
  await User
    .findOne({ ip: req.params.ip }, (err, user) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found by ip', })
      }
      return res.status(200).json({ success: true, data: user })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

getUsers = async (req, res) => {
  await User
    .find({}, (err, users) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!users.length) {
        return res.status(404).json({ success: false, error: 'Users not found', })
      }
      return res.status(200).json({ success: true, data: users})
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

updateUserByTwitterId = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a user twitter', })
  }
  await UserTwitter
    .findOne({ twitterId: req.params.twitterId }, (err, userTwitter) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!userTwitter) {
        return res.status(404).json({ success: false, error: 'User twitter not found', })
      }
      userTwitter.votes = body.votes
      //await
      userTwitter
        .save()
        .then(() => {
          return res.status(201).json({
            success: true,
            twitterId: userTwitter.twitterId,
            message: 'User updated!',
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

getUserByTwitterId = async (req, res) => {
  await UserTwitter
    .findOne({ twitterId: req.params.twitterId }, (err, userTwitter) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!userTwitter) {
        return res.status(404).json({ success: false, error: 'User twitter not found by id', })
      }
      return res.status(200).json({ success: true, data: userTwitter })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

getUsersTwitter = async (req, res) => {
  await UserTwitter
    .find({}, (err, usersTwitter) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!usersTwitter.length) {
        return res.status(404).json({ success: false, error: 'Users not found', })
      }
      return res.status(200).json({ success: true, data: usersTwitter})
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

module.exports = {
  createUser,
  updateUserById,
  updateUserByIp,
  deleteUserById,
  deleteUserByIp,
  getUserById,
  getUserByIp,
  getUsers,
  updateUserByTwitterId,
  getUserByTwitterId,
  getUsersTwitter,
}
