

const authRoutes = require('./auth');
const ursRoutes = require('./user')

function routes(app) {
    app.use('/auth',authRoutes)
    app.use('/users',ursRoutes)
}

module.exports = routes;