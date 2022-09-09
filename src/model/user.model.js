const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt');
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
        require: true,
        trim: true,
        unique:true,
    },
    password : {
        type: String,
        require: true,
        maxLength: 8
    },
    phoneNumber: {
        type: Number,
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
        type: Boolean
    },
    isVerified: {
        type: Boolean
    },
    createdAt:{
        type: Date,
        default: new Date()
    },
    editedAt:{
        type: Date,
        default: null
    }

})

user.pre('save', async function(next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(this.password, salt);
        this.password = hashPassword;
        return next();
    } catch (error) {
        next(error)
    }
})

const userm = mongoose.model('users', user);

module.exports = userm;