
const uploadImg = require('../../configs/cloudinary');
const Post = require('../model/post.model');
const Usr = require('../model/user.model');
const {STATUS_POSTING} = require('../helper/constant')
class PostController {
   async createPost (req, res, next) {
    try {
        const {title, content } = req.body;
        if(!title || !content || req.files?.length === 0) return res.status(404).json({mgs: 'The fields must not be empty!'});
        const thePost = await Post.findOne({title: title});
        const usr = await Usr.findOne({_id: req.usr._id});
        const posts = await Post.find({author: req.usr._id}).sort('-createdAt');
        if(posts.length > 0) {
            if(new Date(`${posts[0].createdAt}`).getDate() < new Date().getDate()){
                await Usr.findOneAndUpdate(
                    {_id: req.usr._id},
                    {$set: {limit_post: '0'}},
                    {new: true}
                )
            }
        }
        if(thePost) return res.status(404).json({mgs: 'The post was existed!'});
        if(usr._doc.limit_post === '5') return res.status(400).json({mgs: 'You just create the 5 post for each day!'});

        const post = await Post({
            title,
            content,
            author: req.usr._id,
        });
        await post.save();
        await Usr.findOneAndUpdate(
            {_id: req.usr._id},
            {$set: {limit_post: String(parseFloat(usr._doc.limit_post) + 1)}},
            {new : true}
        );
        const links = [];
        for (const file of req.files) {
            const {path} = file;
            const urls = await uploadImg(path,'posts',{w: 400, h: 400}, post._doc._id)
            links.push({name: urls.original_filename, url: urls.url});   
        }

        const newPost = await Post.findOneAndUpdate(
            {_id: post._doc._id},
            {$set: {img: links}},
            {new : true}
        ).populate({
            path: 'author',
            select: '-password'
        });

        res.status(200).json({mgs: 'The post has been created!', data: newPost})

    } catch (error) {
        res.status(500).json({mgs: error.message});
    }
   }
   async like(req, res, next) {
    try {
        if(!req.body.id) return res.status(404).json({mgs: 'The id of post must be provided'})
        const like = await Post.findOneAndUpdate(
            {_id: req.body.id},
            {$push: {likes: req.usr._id}},
            {new : true}
        )
        if(!like) return res.status(404).json({mgs: 'The post not found!'})

        res.status(200).json({mgs: 'Liked post!'})
    } catch (error) {
        res.status(500).json({mgs: error.message});
    }
   }
   async unlike(req, res, next) {
    try {
        if(!req.body.id) return res.status(404).json({mgs: 'The id of post must be provided'})
        const unlike = await Post.findOneAndUpdate(
            {_id: req.body.id},
            {$pull: {likes: req.usr._id}},
            {new : true}
        )
        if(!unlike) return res.status(404).json({mgs: 'The post not found!'})

        res.status(200).json({mgs: 'Unliked post!'})
    } catch (error) {
        res.status(500).json({mgs: error.message});
    }
   }
   async verifyPost(req, res, next) {
    try {
        const {status} = req.body;
        if(!STATUS_POSTING.includes(status)) return res.status(404).json({mgs: 'The status is not match'})
        const post = await Post.findOne({_id: req.params.postId});

        if(!post) return res.status(404).json({mgs: 'The post is not found'});

        const news = await Post.findOneAndUpdate(
            {_id: post._doc._id},
            {$set: {status: status, changeStatus_at: new Date()}},
            {new: true}
        )
        res.status(200).json({mgs: 'Verify successfully', data: news})
    } catch (error) {
        res.status(500).json({mgs: error.message});
    }
   }
   async savedPost(req, res, next) {
    try {
        const saved = await Usr.findOneAndUpdate(
            {_id: req.usr._id},
            {$push: {saved: req.body.id}},
            {new: true}
        )
        if(!saved) return res.status(404).json({mgs: 'The user is not found!'})

        res.status(200).json({mgs: 'Saved successfully!', data: saved})
    } catch (error) {
       res.status(500).json({mgs: error.message});
    }
   }
   async unSavedPost(req, res, next) {
    try {
        const unSaved = await Usr.findOneAndUpdate(
            {_id: req.usr._id},
            {$pull: {saved: req.body.id}},
            {new: true}
        )
        if(!unSaved) return res.status(404).json({mgs: 'The user is not found!'})

        res.status(200).json({mgs: 'Saved successfully!', data: unSaved})
    } catch (error) {
       res.status(500).json({mgs: error.message});
    }
   }
   async unSavedPost(req, res, next) {
    try {
        const unSaved = await Usr.findOneAndUpdate(
            {_id: req.usr._id},
            {$pull: {saved: req.body.id}},
            {new: true}
        )
        if(!unSaved) return res.status(404).json({mgs: 'The user is not found!'})

        res.status(200).json({mgs: 'Saved successfully!', data: unSaved})
    } catch (error) {
       res.status(500).json({mgs: error.message});
    }
   }
   async getSavedPosts(req, res, next) {
    try {
        const usr = await Usr.findOne({_id: req.usr._id});
        const savedPosts = await Post.find({_id: {$in: usr._doc.saved}}).sort('-createdAt')
        res.status(200).json({mgs: 'get saved posts successfully!', data: savedPosts})
    } catch (error) {
       res.status(500).json({mgs: error.message});
    }
   }
   async getAllPosts (req, res, next) {
    try {
        const savedPosts = await Post.find().sort('-createdAt');
        res.status(200).json({mgs: 'get the posts successfully!', data: savedPosts})
    } catch (error) {
       res.status(500).json({mgs: error.message});
    }
   }
   
}
module.exports = new PostController();