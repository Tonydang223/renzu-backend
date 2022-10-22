const express = require('express')
const router = express.Router()
const postController = require('../controllers/post.controller');
const uploadImg = require('../../utils/multerStorage');
const authMid = require('../middlewares/auth');
const commentController = require('../controllers/comment.controller')

router.post('/create-post',authMid.userGuard, uploadImg.array('imgs'), postController.createPost);
router.post('/like',authMid.userGuard, postController.like);
router.post('/unlike',authMid.userGuard, postController.unlike);
router.post('/saved',authMid.userGuard, postController.savedPost);
router.post('/unsaved',authMid.userGuard, postController.unSavedPost);
router.get('/getSavedPosts',authMid.userGuard, postController.getSavedPosts);
router.get('/getAll',authMid.userGuard, postController.getAllPosts);
//Comment
router.post('/comment/create',authMid.userGuard, commentController.createComment);
router.post('/comment/delete',authMid.userGuard, commentController.deleteComment);
router.post('/comment/update',authMid.userGuard, commentController.editComment);
router.post('/comment/like',authMid.userGuard, commentController.likeComment);
router.post('/comment/unlike',authMid.userGuard, commentController.unlikeComment);





module.exports = router;
