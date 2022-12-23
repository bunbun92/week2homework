const express = require("express");
const router = express.Router();

const { Op } = require("sequelize");
const { Posting } = require("../models");

const authMiddleware = require("../middlewares/authMiddleware.js");


router.post("/posting", authMiddleware, async (req, res) => {
    const { postingTitle, postingText} = req.body;
    const userId = res.locals.user.userId;
    
    if(postingTitle.length < 1){
        return res.status(412).send({msg: "게시글 제목을 입력해 주세요."});
    }

    await Posting.create({postingTitle, postingText, userId});
    
    return res.status(200).send({msg: "게시글 작성 성공"});
});


router.get("/postings", async (req, res) => {
    const postings = await Posting.findAll({
        order: [["postingId", "desc"]]
    });

    return res.status(200).send({ postings });
});


router.get("/posting/:postingId", async (req, res) => {
    const {postingId} = req.params;
    const posting = await Posting.findOne({
        where:{postingId}
    })

    if(!posting){
        return res.status(400).send({errMsg:"존재하지 않는 게시글입니다."});
    }

    return res.status(200).send({posting});
});


router.patch("/posting/:postingId", authMiddleware, async (req, res) => {
    const { postingId } = req.params;
    const { postingTitle, postingText } = req.body;
    const currentUserId = res.locals.user.userId;

    const posting = await Posting.findOne({where: {postingId}});      

    try{
        if(posting.userId !== currentUserId){
            return res.status(401).send({errMsg: "게시글 작성자가 아닙니다."});
        }
    } catch (err) {
        return res.status(400).send({errMsg:"존재하지 않는 게시글입니다."});
    }    

    // await Posting.update({postingTitle, postingText}, {where: {postingId}});
    await posting.update({postingTitle, postingText});

    return res.status(200).send({msg: "게시글 수정 성공"});
    
});


router.delete("/posting/:postingId", authMiddleware, async (req, res) => {
    const { postingId } = req.params;
    const currentUserId = res.locals.user.userId;
    
    const posting = await Posting.findOne({where:{postingId}});   
    
    try{
        if(posting.userId !== currentUserId){
            return res.status(401).send({errMsg: "게시글 작성자가 아닙니다."});
        }
    } catch (err) {
        return res.status(400).send({errMsg: "존재하지 않는 게시글입니다)"});
    }    

    await posting.destroy({});
    return res.status(200).send({msg: "게시글 삭제 성공"});
});



module.exports = router;