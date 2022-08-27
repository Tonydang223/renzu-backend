const express = require('express')
const router = express.Router()
const userControler = require('../controllers/user.controller');


router.get('/getAll', userControler.getAllUsers);

module.exports = router;
