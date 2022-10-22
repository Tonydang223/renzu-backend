const mongoose = require('mongoose')
const Schema = mongoose.Schema

const requestSchame = new Schema({
    confirmedAt: { type: Date},
    deniedAt: { type: Date},
    requestedAt: { type: Date, default: new Date()},
    canceledAt: { type: Date},
    canceller: {type: mongoose.Types.ObjectId, ref: 'users'},
    requester: { type: mongoose.Types.ObjectId, ref: 'users', required: true},
    confirmer: { type: mongoose.Types.ObjectId, ref: 'users', required: true},
});

const post = mongoose.model('request', requestSchame);

module.exports = post;