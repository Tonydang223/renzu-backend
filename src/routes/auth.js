const express = require('express')
const router = express.Router()
const authControler = require('../controllers/auth.controller');


router.post('/register', authControler.signUp);

module.exports = router;
