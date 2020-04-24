const express = require('express')

const PollCtrl = require('../controllers/poll-ctrl')

const pollRouter = express.Router()

pollRouter.post('/poll', PollCtrl.createPoll)
pollRouter.put('/poll/:_id', PollCtrl.updatePoll)
pollRouter.delete('/poll/:_id', PollCtrl.deletePoll)
pollRouter.get('/poll/:_id', PollCtrl.getPollById)
pollRouter.get('/polls', PollCtrl.getPolls)

module.exports = pollRouter
