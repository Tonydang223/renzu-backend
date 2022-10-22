const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt');
const {STATUS_PROFILE} = require('../helper/constant')

const user = new Schema({
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique:true,
    },
    password : {
        type: String,
        required: true,
        maxLength: 8
    },
    phoneNumber: {
        type: String,
    },
    address:{
        type:String,
    },
    city:{
        type:String
    },
    country:{
       type:String
    },
    role:{
        type:Number,
        default:0
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: new Date()
    },
    editedAt:{
        type: Date,
        default: null
    },
    img: {
        type: String,
    },
    limit_post: { type: String, default: '0'},
    saved: [{type: mongoose.Types.ObjectId, ref:'post'}],
    follower: [{type: mongoose.Types.ObjectId, ref: 'users'}],
    following: [{type: mongoose.Types.ObjectId, ref: 'users'}],
    status_profile: { type: String, default: 'open', enum:STATUS_PROFILE},
    blockers:[{type: mongoose.Types.ObjectId, ref: 'users'}]
});

user.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(this.password, salt);
        this.password = hashPassword;
        return next();
    } catch (error) {
        next(error)
    }
});

user.pre('findOneAndUpdate', async function(next) {
    try {
        this.set({editedAt: new Date()});
    } catch (error) {
        next(error)
    }
})

const userm = mongoose.model('users', user);

module.exports = userm;