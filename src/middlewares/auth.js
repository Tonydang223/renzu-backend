const jwt = require('jsonwebtoken');
const Userm = require('../model/user.model');

async function userGuard(req, res, next) {
   try {
      const token = req.headers.authorization.split(' ')[1];
      console.log('token', token);

      if(!token) return res.status(401).json({mgs: 'Unauthorized'})

      jwt.verify(token,process.env.TOKEN_SECRET, async function(err, data) {
         if(err) return res.status(400).json({mgs: 'The token was exired! You need to log in again.'});

         req.usr = data
         next()
      })
   } catch (err) {
     res.status(500).json({msg: err.message});
   }
}
module.exports = {userGuard}