const express = require("express");
const router = express.Router();

const { Comment } = require("../models");

const authMiddleware = require("../middlewares/authMiddleware.js");

router.post("/comment/:postingId", authMiddleware, async (req, res) => {
    const userId = res.locals.user.userId;
    const { postingId } = req.params;
    const { commentText } = req.body;

    try{
        if(commentText.length < 1){
            return res.status(412).send({errMsg: "댓글 내용을 입력해 주세요"});
        }
    } catch (err) {
        return res.status(400).send({errMsg: "아무 내용도 입력되지 않았습니다."});
    }
    

    await Comment.create({commentText, postingId, userId});
    
    res.status(201).send({msg:"댓글 작성 완료"});

});


router.get("/comments/:postingId", async (req, res) => {
    const { postingId } = req.params;

    const comments = await Comment.findAll({
        where: {postingId}, order: [["commentId", "desc"]]
    });

    res.status(200).send({comments});

});


router.patch("/comment/:commentId", authMiddleware, async (req, res) => {
    const currentUserId = res.locals.user.userId;
    const { commentId } = req.params;
    const { commentText } = req.body;

    const comment = await Comment.findOne({
        where:{commentId}
    });
    
    if(!comment){
        return res.status(400).send({errMsg: "존재하지 않는 댓글입니다"});
    }

    if(comment.userId !== currentUserId){
        return res.status(401).send({errMsg: "댓글 작성자가 아닙니다."});
    }else if(commentText.length < 1){
        return res.status(412).send({errMsg: "댓글 내용을 입력해 주세요."});
    }
    
    comment.update({commentText});
    return res.status(200).send({msg: "댓글 수정 성공"});    

});


router.delete("/comment/:commentId", authMiddleware, async (req, res) => {
    const currentUserId = res.locals.user.userId;
    const { commentId } = req.params;

    const comment = await Comment.findOne({
        where:{commentId}
    });

    if(!comment){
        return res.status(400).send({errMsg: "존재하지 않는 댓글입니다"});
    }

    if(comment.userId !== currentUserId){
        return res.status(401).send({errMsg: "댓글 작성자가 아닙니다."});
    }

    await comment.destroy({});

    return res.status(200).send({msg: "댓글 삭제 성공"});
});


module.exports = router;
