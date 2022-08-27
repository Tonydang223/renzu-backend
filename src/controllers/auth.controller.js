
const Userm = require('../model/user.model')
class authControler {
    async signUp(req, res, next) {
        try {
                const {email, password} = req.body
            console.log(String(req.body.password).length);
            if(!email ||
            !password || String(password).length > 8) {
               return res.status(400).json({message: 'email or password is not right format'})
            }
            const user = new Userm({
                email, password
            })
            const usersaved = await user.save();

            return res.status(200).json({mess : 'register oke!', data: usersaved})
        } catch (error) {
            res.status(500).send({mgs: error.message})
        }
        
    }
}

module.exports = new authControler()