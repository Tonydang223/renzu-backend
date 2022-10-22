
const Post = require('../model/post.model');
const Comment = require('../model/comments.model');

class CommentController {
  async createComment(req, res, next) {
    try {
       const {message, post_id, tag, reply} = req.body
       const post = await Post.findOne({_id: post_id})
       if(!post) return res.status(404).json({message: 'The post is not found!'});

    //    if(reply) {
    //      const comment = await Comment.findOne({reply: reply});
    //      if(!comment) return res.status(404).json({message: 'The comment is not found!'});
    //    }

       const newCm =  await Comment({
         message, post_id, tag, reply, by_user: req.usr._id
       });

       await Post.findOneAndUpdate(
        {_id: post_id},
        {$push: {comment: newCm._id}},
        {new: true}
       )

       let cm = await newCm.save();

       if(tag) {
         cm = await Comment.findOne({_id: cm._id}).populate('tag');
       }

       res.status(200).json({mgs: 'The comment created successfully!', data: cm});
    } catch (error) {
        res.status(500).send({mgs: error.message})
    }
  }
  async likeComment(req, res, next) {
    try {
        const cm = await Comment.find({_id: req.body.id, likes: req.usr._id});
        if(cm.length > 0) return res.status(400).json({mgs: 'Liked this comment'})

        await Comment.findOneAndUpdate(
            {_id: req.body.id},
            {$push: {likes: req.usr._id}},
            {new: true}
        )
        res.status(200).json({mgs: 'Liked comment'})
    } catch (error) {
        res.status(500).send({mgs: error.message})
    }
  }
  async unlikeComment(req, res, next) {
    try {
        await Comment.findOneAndUpdate(
            {_id: req.body.id},
            {$pull: {likes: req.usr._id}},
            {new: true}
        )
        res.status(200).json({mgs: 'UnLiked comment'})
    } catch (error) {
        res.status(500).send({mgs: error.message})
    }
  }
  async editComment(req, res, next) {
    try {
        const {id, message} = req.body
        await Comment.findOneAndUpdate(
            {_id: id, by_user: req.usr._id},
            {$set: {message}},
            {new: true}
        )
        res.status(200).json({mgs: 'Updated ok!'})
    } catch (error) {
        res.status(500).send({mgs: error.message})
    }
  }
  async deleteComment(req, res, next) {
    try {
        const cm = await Comment.findOneAndDelete(
            {_id: req.body.id,
             $or: [{by_user: req.usr._id}]
            }
        );

        await Post.findOneAndUpdate(
            {_id: cm.post_id},
            {$pull: {comment: cm._id}},
            {new: true}
        );

        res.status(200).json({mgs: 'The comment delete successfully!', data:cm})
    } catch (error) {
        res.status(500).send({mgs: error.message})
    }
  }
}

module.exports = new CommentController();