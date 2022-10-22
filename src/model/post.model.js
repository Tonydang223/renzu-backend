const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {STATUS_POSTING} = require('../helper/constant')

const postSchame = new Schema({
    title: { type: String, required: true},
    content: { type: String, maxLength: 700, required: true },
    img: {type: Array},
    status: {type: String, default: 'unactive', enum: STATUS_POSTING},
    createdAt: { type: Date, default: new Date()},
    author: { type: mongoose.Types.ObjectId, ref: 'users', required: true},
    changeStatus_at: { type: Date, default: null},
    editedAt: { type: Date, default: null},
    likes:[{type: mongoose.Types.ObjectId, ref: 'users'}],
    comment: [{type: mongoose.Types.ObjectId, ref: 'comments'}],
})

const post = mongoose.model('post', postSchame);

module.exports = post;