const Poll = require('../models/poll-model')
const mongoose = require('mongoose')

const ObjectId = mongoose.Types.ObjectId

createPoll = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a poll', })
  }
  const poll = new Poll(body)
  if (!poll) {
    return res.status(400).json({ success: false, error: 'You must provide a correct json poll', })
  }
  // body with question, answers, ip and twitterId
  await poll
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        _id: poll._id,
        ip: poll.ip,
        message: 'Poll created!',
      })
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

updatePoll = async (req, res) => {
  const body = req.body
  if (!body) {
    return res.status(400).json({ success: false, error: 'You must provide a poll', })
  }
  await Poll
    .findOne({ _id: ObjectId(req.params._id) }, (err, poll) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!poll) {
        return res.status(404).json({ success: false, error: 'Poll not found', })
      }
      poll.question = body.question
      poll.answers = body.answers
      //await
      poll
        .save()
        .then(() => {
          return res.status(201).json({
            success: true,
            _id: poll._id,
            ip: poll.ip,
            message: 'Poll updated!',
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

deletePoll = async (req, res) => {
  await Poll
    .findOneAndDelete({ _id: ObjectId(req.params._id) }, (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      //if (!poll) {
      //  return res.status(404).json({ success: false, error: 'Poll not found', })
      //}
      return res.status(200).json({ success: true, }) // data: poll})
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

getPollById = async (req, res) => {
  await Poll
    .findOne({ _id: ObjectId(req.params._id) }, (err, poll) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!poll) {
        return res.status(404).json({ success: false, error: 'Poll not found', })
      }
      return res.status(200).json({ success: true, data: poll})
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

getPolls = async (req, res) => {
  await Poll
    .find({}, (err, polls) => {
      if (err) {
        return res.status(400).json({ success: false, error: err, })
      }
      if (!polls.length) {
        return res.status(404).json({ success: false, error: 'Polls not found', })
      }
      return res.status(200).json({ success: true, data: polls})
    })
    .catch(err => {
      return res.status(400).json({ success: false, error: err, })
    })
}

module.exports = {
  createPoll,
  updatePoll,
  deletePoll,
  getPollById,
  getPolls,
}
