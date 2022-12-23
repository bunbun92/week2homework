const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = function (req, res, next){
    
try{

    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(' ');

    if(tokenType === 'Bearer'){

        const { userId } = jwt.verify(tokenValue, "mySecretKey");
    
            User.findByPk(userId).then(() => {

                return res.status(412).send({errMsg: "이미 로그인이 되어있습니다."});                
                
            })
    }else{
        next();
    }

} catch (err) {
    next();
}    

};