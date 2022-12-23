const express = require("express");


const Joi = require("./schemas/joi.js");
const authMiddleware = require("./middlewares/authMiddleware.js");
const signRouter = require("./routes/sign.js");
const postingRouter = require("./routes/posting.js");
const commentRouter = require("./routes/comment.js");
const likeRouter = require("./routes/like.js");


const app = express();
app.use(express.json());
app.use("/api", express.urlencoded({ extended: false }), [signRouter, postingRouter, commentRouter, likeRouter]);

app.get("/", (req, res) => {

    return res.status(200).send({});
});

app.get("/test", authMiddleware, async(req, res) => {
    // console.log(res.locals.user);
    const user = res.locals.user;

    console.log(user);

    return res.status(200).send({
        user:{
            email: user.email,
            nickname: user.nickname
        }
    })
});


// app.use("/api", signRouter);
// app.use(express.static("assets"));

app.listen(8080, () => {
    console.log("서버가 요청을 받을 준비가 됐어요");
  });