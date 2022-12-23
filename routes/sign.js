const express = require("express");
const router = express.Router();

const { Op } = require("sequelize");
const { User } = require("../models");

const jwt = require("jsonwebtoken");
const Joi = require("../schemas/joi.js");
const reverseAuthMiddleware = require("../middlewares/reverseAuthMiddleware.js");


router.post("/user", reverseAuthMiddleware, async (req, res) => {
    const { email, nickname, password, confirmPassword } = req.body;

    const returnMsg = await validationAndErrorMessage(email, nickname, password, confirmPassword);

    if(returnMsg.length > 0){
        return res.status(412).send({errMsg: returnMsg});
    }


    const existingUserValidation = await User.findAll({
        where:{
            [Op.or]: [{nickname}, {email}]
        }
    });

    if (existingUserValidation.length > 0){
        return res.status(412).send({errMsg: "중복된 이메일 또는 닉네임 입니다."});
    }

    await User.create({email, nickname, password});   
    
    return res.status(201).send({msg: "회원가입 성공"});
});


router.post("/auth", reverseAuthMiddleware, async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        where:{ email, password }
    });

    if(!user){
        return res.status(401).send({errMsg: "이메일 혹은 비밀번호가 올바르지 않습니다."});
    }

    const token = jwt.sign({
        userId: user.userId
    }, "mySecretKey");

    return res.status(200).send({token, msg: "로그인 성공"});
});



async function validationAndErrorMessage(email, nickname, password, confirmPassword){

    let returnMsg = '';

    try{
        await signUpValidation(email, nickname, password, confirmPassword);
    } catch (err) {

        console.log(err);

        const msg = err.message;        

        if(msg.includes("confirm")){
            returnMsg = "비밀번호 확인란의 비밀번호가 올바르지 않습니다."
        }else if(msg.includes("password")){
            returnMsg = "비밀번호가 올바르지 않습니다."
        }else if(msg.includes("nickname")){
            returnMsg = "닉네임이 올바르지 않습니다."
        }else{
            if(password.includes(nickname)){
                returnMsg = "비밀번호에 닉네임이 포함되었습니다."
            }else{
                returnMsg = "이메일이 올바르지 않습니다."
            }            
        }               
    }

    return returnMsg;
}

async function signUpValidation(email, nickname, password, confirmPassword){

    try{
        await Joi.validateAsync({
            email,
            nickname,
            password,
            confirmPassword
        });

    } catch (err) {        
        throw err;        
    }

    return true;
}




module.exports = router;