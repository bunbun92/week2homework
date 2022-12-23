const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const { Op } = require("sequelize");

const { User, Posting, Like } = require("../models");


router.post("/like/:postingId", authMiddleware, async (req, res) => {
    const userId = res.locals.user.userId;
    const { postingId } = req.params;

    const like = await Like.findOne({
        where:{postingId, userId}
    })

    try{
        if(!like){
            await Like.create({postingId, userId});
            const posting = await Posting.findOne({where: {postingId}});
            await posting.update({likes: posting.likes + 1 });
    
            return res.status(201).send({msg: "좋아요 성공"});
        }else{
            await like.destroy({});
            const posting = await Posting.findOne({where: {postingId}});
            await posting.update({likes: posting.likes - 1 });
    
            return res.status(200).send({msg: "좋아요 취소 성공"});
        }   
    } catch (err) {
        return res.status(400).send({errMsg: "존재하지 않는 게시글입니다."});
    }

 
    
});


router.get("/likes", authMiddleware, async (req, res) => {
    const userId = res.locals.user.userId;
    
    const likes = await Like.findAll({
        attributes: ["postingId"],
        where: {userId}
    }) 

    const postingIds = new Array(likes.length);    

    for (let i = 0; i < postingIds.length; i++){
        postingIds[i] = likes[i].postingId;
    }

    const postings = await Posting.findAll({
        where: { postingId: { [Op.in]: postingIds }},
        order: [["likes", "desc"]]
    });
    
    console.log(postings);    

    // console.log(postingIds);

    // console.log(like);

    // const postingIds = likes.postingId;

    // console.log(postingIds);

    return res.send({postings});
});


module.exports = router;