const Usrm = require('../model/user.model')
class UserController {
    async getAllUsers(req, res, next) {
       try {
          const allusers = await Usrm.find();
          return res.status(200).send({message: 'take all users ok', data: allusers});
       } catch (error) {
         return res.status(500).json({message: error.message});
       }
    }
}

module.exports = new UserController();