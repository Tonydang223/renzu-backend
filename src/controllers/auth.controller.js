
const Userm = require('../model/user.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../../utils/sendEmail');
const constants  = require('../../configs/constants');
class authControler {
    async signUp(req, res, next) {
        try {
            const {email, password, username} = req.body
            if( !String(password).match(constants.passwordRegex) || !String(email).match(constants.emailRegex)) {
               return res.status(400).json({message: 'email or password is not right format'})
            }
            if(!email || !password || !username) return res.status(400).json({message: 'The fields must not be empty!'})
            const emailExisted = await Userm.findOne({email: email});
            if(emailExisted) return res.status(409).json({mgs:'Email is existed!!!'})
            const user = new Userm({
                email, password, firstName: username
            })
            const usersaved = await user.save();
            const token = await jwt.sign({_id: usersaved._id}, process.env.EMAIL_TOKEN_SECRET, {expiresIn: '2h'})
            const url = `${process.env.URL_CLIENT}/auth/verify/${usersaved._id}/${token}`
            const contentMail = "Firstly, you completed registering a new account. Please click the text here to vertify your new account, so you can log in the system."
            const titleMail = "Thanks you for being a new member"
            sendEmail.emailActive(email, url, 'Verify your email here', contentMail, titleMail);
            return res.status(200).json({mess : 'register oke!', data: usersaved})
        } catch (error) {
            res.status(500).send({mgs: error.message})
        }
        
    }
    async login (req, res, next) {
        try {
            const {email, password} = req.body
            if(!email ||
            !password || !String(password).match(constants.passwordRegex)) {
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
            if(!user) return res.status(400).json({message: 'Email is not existed!!!', status:'fail'});
            if(!email) return res.status(400).json({message: `Email's format is not correct!`})
            const token = await jwt.sign({_id: user._doc._id}, process.env.TOKEN_SECRET, {expiresIn: '1h'})
            const url = `${process.env.URL_CLIENT}/auth/resetPass/${user._doc._id}/${token}`
            const contentMail = "You click the below button to complete changing your new password."
            const titleMail = "Changing a new password"
            sendEmail.emailActive(email, url, 'Reset Password Here', contentMail, titleMail);
            res.status(200).json({message: 'Send the link to your email successfully!'});
        } catch (error) {
            res.status(500).send({message: error.message})
        }
    }
    async resetPass(req, res, next) {
       try {
        const {uid, token} = req.params
        const usr = await Userm.findById({_id: uid})
        if(usr) {
            jwt.verify(
              token,
              process.env.TOKEN_SECRET,
              async function(err, data) {
                const message = 'The link was expired. Please send the link again!'
                if(err) {
                    // return res.redirect(`/errs?error=true&mess=${message}`)
                    return res.status(404).render('error', {message})
                }
                return res.status(200).render('ForgotPassword', {email: usr.email, uid, token, oldPass:usr.password});
              }
            )
        } else {
            const message = "The email was not found. You try to send again!"
            return res.status(404).render('error', {message});
        }

       } catch (error) {
        res.status(500).send({mgs: error.message})
       }
    }
    async changePassword (req, res, next) {
        try {
            const {password} = req.body;
            const {uid, token} = req.params;
            const usr = await Userm.findById({_id: uid})
         if(!token) return res.status(404).json({message: 'Invalid auth!!!'});
         if(!password || !String(password).match(constants.passwordRegex)) return res.status(400).json({message: `Password's format is not correct!!!`})

         const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
         if(!decoded) return res.status(404).json({message: 'Invalid auth!!!'});

         const salt = await bcrypt.genSalt(10);
         const hashPassword = await bcrypt.hash(password, salt);

         const oldPass = await bcrypt.compareSync(password,usr.password);

         if(oldPass) return res.status(400).json({message: 'The password is old!'})


         await Userm.findByIdAndUpdate(
            {_id: decoded._id},
            { $set: { password:hashPassword } },
            { new: true }
         )
         return res.status(200).json({message: 'Your password was changed successfully!', isOk: true});
        } catch (error) {
            return res.status(500).send({mgs: error.message})
        }
    }
    async verifyEmail(req, res, next) {
        try {
            const {token, uid} = req.params;
            let message;
            const usr = await Userm.findById({_id: uid})
            message = 'The account was verified before'
            if(usr.isVerified)  return res.status(404).render('error', {message})
            jwt.verify(
            token,
            process.env.EMAIL_TOKEN_SECRET,
            async function (err, data) {
                message = 'The link was expired. Please sign up again!'
                if(err) {
                    await Userm.deleteOne({uid})
                    // return res.redirect(`/errs?error=true&mess=${message}`)
                    return res.status(404).render('error', {message})
                } 
                await Userm.findByIdAndUpdate(
                    {_id: data._id},
                    {$set :{isVerified: true}},
                    {new: true}
                )
                // res.sendFile('src/views/emailConfirm.html', {root: process.cwd()})
                res.status(200).render('Confirm', {message: 'Your email of you verified ! You can log in now'});
            }
            )
        } catch (error) {
            res.status(500).send({mgs: error.message})
        }
    }

}

module.exports = new authControler()