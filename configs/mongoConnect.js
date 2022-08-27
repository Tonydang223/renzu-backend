

const mongoose = require('mongoose')
async function connect() {
    try {
        await mongoose.connect(process.env.DB_CONNECTION,{
            dbName:process.env.DB_NAME,
            useNewUrlParser: true
        });
        console.log('connect ok!')
    } catch (error) {
        console.log('connect fail',error.message)
    }
}
module.exports = {connect}