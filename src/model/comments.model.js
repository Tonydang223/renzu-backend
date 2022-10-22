const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {STATUS_POSTING} = require('../helper/constant')

const commentSchame = new Schema({
    message: { type: String, required: true},
    commentedAt: { type: Date, default: new Date()},
    by_user: { type: mongoose.Types.ObjectId, ref: 'users'},
    post_id: { type: mongoose.Types.ObjectId, ref: 'post'},
    editedAt: { type: Date, default: null},
    likes:[{type: mongoose.Types.ObjectId, ref: 'users'}],
    reply: mongoose.Types.ObjectId,
    tag: {type: mongoose.Types.ObjectId, ref: 'users'}
})

const comment = mongoose.model('comment', commentSchame);

module.exports = comment;