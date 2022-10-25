

const mongoose = require('mongoose')
async function connect() {
    try {
        await mongoose.connect(process.env.DB_CONNECTION,{
            user: process.env.MONGO_USR,
            pass: process.env.MONGO_PASS,
            dbName: process.env.MONGO_DBNAME,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('connect ok!')
    } catch (error) {
        console.log('connect fail',error.message)
    }
}
module.exports = {connect}