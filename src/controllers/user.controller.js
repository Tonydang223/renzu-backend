const Usrm = require('../model/user.model')
const uploadImg = require('../../configs/cloudinary');
const Request = require('../model/request.model');
const Post = require('../model/post.model');
class UserController {
    async getAllUsers(req, res, next) {
       try {
          const allusers = await Usrm.find();
          return res.status(200).send({message: 'take all users ok', data: allusers});
       } catch (error) {
         return res.status(500).json({message: error.message});
       }
    }
    async getInfoUsr(req, res, next) {
      try {
         const user = await Usrm.findOne({_id: req.usr._id}).select('-password');
         res.status(200).json({message:'take info successfully', data: user});
      } catch (error) {
         return res.status(500).json({message: error.message});
      }
    }
    async editInfo(req, res, next) {
      try {
         const user = {...req.body}
         const newUsr = await Usrm.findOneAndUpdate(
            {_id: req.usr._id},
            { $set : user},
            {new: true}
         );
         res.status(200).json({message: 'Update successfully!', data: newUsr});
      } catch (error) {
         return res.status(500).json({message: error.message});
      }
    }
    async uploadImgProfile(req, res, next) {
      try {
         if(!req.file) return res.status(400).json({mgs: 'The file is not found!'})

         const link = await uploadImg(req.file.path, 'avatar', {w: 180, h: 180}, `${req.usr._id}_profile`);

         const usr = await Usrm.findOneAndUpdate(
            {_id: req.usr._id},
            { $set : {
               img: link.url
            }},
            {new: true}
         );
         res.status(200).json({message: 'Update successfully!', data: usr});


      } catch (error) {
         return res.status(500).json({message: error.message});
      }
    }
    async requestNewUsr(req, res, next) {
      try {
         const requestExisted = await Request.findOne({
            requester: req.usr._id,
            confirmer: req.body.id
         })
         if(requestExisted) return res.status(400).json({mgs: 'The request is existed!'});
         const usr = await Usrm.findOne({_id: req.usr._id});
         if(usr._doc.status_profile !== 'private') return res.status(400).json({message: 'Request fail! The profile is at public status!'});
         
         const request = await Request({
            requester: req.usr._id,
            confirmer: req.body.id
         })

         const newRequest = await request.save();

         if(newRequest) {
            const data = await Request.populate(newRequest, {
               path: 'requester confirmer',
               select: '-password'
            })
            res.status(200).json({mgs: 'Request ok!', data});
         } else {
            res.status(400).json({message: 'Request fail!'})
         }
      } catch (error) {
         return res.status(500).json({message: error.message});
      }
    }
    async follow(req, res, next) {
      try {
         const urs = await Usrm.find({_id: req.body.id, follower: req.usr._id });
         if(urs.length > 0) return res.status(400).json({mgs: 'The user followed!'});

         const newUsrFollow = await Usrm.findOneAndUpdate(
            {_id: req.body.id},
            {$push: {follower: req.usr._id}},
            {new: true}
         );

         await Usrm.findByIdAndUpdate(
            {_id: req.usr._id},
            {$push: {following: req.body.id}},
            {new: true}
         )
         res.status(200).json({mgs: 'Follow ok!', data: newUsrFollow})
      } catch (error) {
         return res.status(500).json({message: error.message});
      }
    }
    async unFollow(req, res, next) {
      try {

         const newUsrFollow = await Usrm.findOneAndUpdate(
            {_id: req.body.id},
            {$pull: {follower: req.usr._id}},
            {new: true}
         );

         await Usrm.findByIdAndUpdate(
            {_id: req.usr._id},
            {$pull: {following: req.body.id}},
            {new: true}
         )
         res.status(200).json({mgs: 'Follow ok!', data: newUsrFollow})
      } catch (error) {
         return res.status(500).json({message: error.message});
      }
    }
    async deleteUser(req, res, next) {
      try {
         const usr = await Usrm.findOne({_id: req.body.id});
         if(!usr) return res.status(400).json({mgs:'The user is not found!'});

         const deletedUsr = await Usrm.findOneAndDelete({_id: req.body.id});

         await Post.deleteMany({author: req.body.id});

         res.status(200).json({mgs: 'Delete successfully!', data: deletedUsr})
      } catch (error) {
         return res.status(500).json({message: error.message});
      }
    }
    async block(req, res, next) {
      try {
         const usr = await Usrm.findOne({_id: req.body.id});
         if(!usr) return res.status(400).json({mgs:'The user is not found!'});

         const blockedUsr = await Usrm.findOneAndUpdate(
            {_id: req.body.id},
            {$set: {isBlocked: true}},
            {new: true}
         );

         res.status(200).json({mgs: 'Block successfully!', data: blockedUsr})

      } catch (error) {
         return res.status(500).json({message: error.message});
      }
    }

    async unBlock(req, res, next) {
      try {
         const usr = await Usrm.findOne({_id: req.body.id});
         if(!usr) return res.status(400).json({mgs:'The user is not found!'});

         const blockedUsr = await Usrm.findOneAndUpdate(
            {_id: req.body.id},
            {$set: {isBlocked: false}},
            {new: true}
         );

         res.status(200).json({mgs: 'UnBlock successfully!', data: blockedUsr})

      } catch (error) {
         return res.status(500).json({message: error.message});
      }
    }
}

module.exports = new UserController();