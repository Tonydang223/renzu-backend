

const authRoutes = require('./auth');
const ursRoutes = require('./user')
const errRoute = require('./errs')
const postRoute = require('./post')
function routes(app) {
    app.use('/auth',authRoutes);
    app.use('/user',ursRoutes);
    app.use('/post',postRoute);
    app.use(errRoute)
}

module.exports = routes;