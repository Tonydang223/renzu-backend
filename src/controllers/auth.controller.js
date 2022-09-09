
const Userm = require('../model/user.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class authControler {
    async signUp(req, res, next) {
        try {
            const {email, password} = req.body
            if(!email ||
            !password || String(password).length > 8) {
               return res.status(400).json({message: 'email or password is not right format'})
            }
            const emailExisted = await Userm.findOne({email: email});
            if(emailExisted) return res.status(409).json({mgs:'Email is existed!!!'})
            const user = new Userm({
                email, password
            })
            const usersaved = await user.save();

            return res.status(200).json({mess : 'register oke!', data: usersaved})
        } catch (error) {
            res.status(500).send({mgs: error.message})
        }
        
    }
    async login (req, res, next) {
        try {
            const {email, password} = req.body
            if(!email ||
            !password || String(password).length > 8) {
               return res.status(400).json({message: 'email or password is not right format'})
            }
            const user = await Userm.findOne({email: email});
            if(!user) return res.status(409).json({mgs:'Email is not existed!!!'})
            
            const userInfo = {...user._doc}
            const isValPass = await bcrypt.compare(password, userInfo.password);
            if(!isValPass) return res.status(400).json({mgs: 'Password not correct!!!'});

            const token = await jwt.sign({_id: userInfo._id}, process.env.TOKEN_SECRET, {expiresIn: '180d'})
            delete userInfo.password

            res.status(200).json({mgs: '', data: {userInfo, token}})

        } catch (error) {
            res.status(500).send({mgs: error.message})
        }
    }
    async forgotPass(req, res, next) {
        try {
            const {email} = req.body
            const user = await Userm.findOne({email: email});
            if(!user) return res.status(400).json({mgs: 'Email is not existed!!!', status:'fail'});
            if(!email) return res.status(400).json({msg: `Email's format is not correct!`})
            const token = await jwt.sign({_id: user._doc._id}, process.env.TOKEN_SECRET, {expiresIn: '10m'})
            res.status(200).json({mgs: 'Ok!', status: 'pass', token, data: user._doc.email});
        } catch (error) {
            res.status(500).send({mgs: error.message})
        }
    }
    async resetPass(req, res, next) {
       try {
         const {password, token} = req.body;
         if(!token) return res.status(400).json({mgs: 'Invalid auth!!!'})
         if(!password || String(password).length > 8) return res.status(400).json({mgs: `Password's format is not correct!!!`})

         const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
         console.log("🚀 ~ file: auth.controller.js ~ line 70 ~ authControler ~ resetPass ~ decoded", decoded)
         if(!decoded) return res.status(400).json({mgs: 'Can not find user!!!'})

         const salt = await bcrypt.genSalt(10);
         const hashPassword = await bcrypt.hash(password, salt);

         await Userm.findByIdAndUpdate(
            {_id: decoded._id},
            { $set: { password:hashPassword } },
            { new: true }
         )
         res
        .status(200)
        .json({ message: "You updated your password successfully!" });
       } catch (error) {
        res.status(500).send({mgs: error.message})
       }
    }
    async verifyEmail(req, res, next) {
        try {
           res.sendFile('src/views/emailConfirm.html', {root: process.cwd()})
        } catch (error) {
            res.status(500).send({mgs: error.message})
        }
    }
}

module.exports = new authControler()