const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = function (req, res, next){

    try{
        
        const { authorization } = req.headers;
        const [tokenType, tokenValue] = authorization.split(' ');

        if(tokenType !== 'Bearer'){
            return res.status(401).send({errMsg: "로그인이 필요합니다."});
        }

        const { userId } = jwt.verify(tokenValue, "mySecretKey");

        User.findByPk(userId).then((user) => {
            res.locals.user = user;
            // console.log(res.locals.user);
            next();
        })

    } catch (err) {
        return res.status(401).send({errMsg: "로그인이 필요합니다."});
    }

};