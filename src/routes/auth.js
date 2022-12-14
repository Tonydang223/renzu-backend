const express = require('express')
const router = express.Router()
const authControler = require('../controllers/auth.controller');


router.post('/register', authControler.signUp);
router.post('/login', authControler.login);
router.post('/forgotPass', authControler.forgotPass);
router
 .route('/resetPass/:uid/:token')
 .get(authControler.resetPass)
 .post(authControler.changePassword)
router.get('/verify/:uid/:token', authControler.verifyEmail);

module.exports = router;
