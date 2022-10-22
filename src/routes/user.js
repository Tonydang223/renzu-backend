const express = require('express')
const router = express.Router()
const userControler = require('../controllers/user.controller');
const authMid = require('../middlewares/auth')
const uploadImg = require('../../utils/multerStorage');

router.get('/getAll', userControler.getAllUsers);
router.get('/getInfo', authMid.userGuard ,userControler.getInfoUsr);
router.post('/editProfile', authMid.userGuard ,userControler.editInfo);
router.post('/request-f', authMid.userGuard ,userControler.requestNewUsr);
router.post('/uploadImgProfile', authMid.userGuard, uploadImg.single('avatar'), userControler.uploadImgProfile);
router.post('/unfollow', authMid.userGuard, userControler.unFollow);
router.post('/follow', authMid.userGuard, userControler.follow);
router.post('/delete', authMid.userGuard, userControler.deleteUser);
router.post('/block', authMid.userGuard, userControler.block);
router.post('/unblock', authMid.userGuard, userControler.unBlock);


module.exports = router;
