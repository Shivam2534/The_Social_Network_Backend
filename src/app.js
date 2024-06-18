import Express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import axios from "axios";

// import multer from "multer";
// const upload = multer();

const app = Express();

// app.use(upload.array());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(
  Express.json({
    // this is for , when data is coming from "form"
    limit: "16kb",
  })
);

app.use(
  Express.urlencoded({
    // this is for , when data is coming from "url"
    extended: true,
    limit: "16kb",
  })
);

app.use(Express.static("Public")); // when we need to store files/imgs/pdfs in locall machine we can put them inside public folder

app.use(cookieParser()); // so that we can do CRUD operations over cookies

app.get("/", (req, res) => {
  res.send("welcome to the New Project");
});

import userRouter from "./routes/User.routes.js";
import postRouter from "./routes/Post.route.js";
import likeRouter from "./routes/Like.route.js";
import commentRouter from "./routes/Comment.route.js";
import followerRoute from "./routes/Follower.route.js";

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/like", likeRouter);
app.use("/comment", commentRouter);
app.use("/follower", followerRoute);

app.post("/authenticate", async (req, res) => {
  const { username } = req.body;

  try {
    const r = await axios.put(
      "https://api.chatengine.io/users/",
      { username: username, secret: username, first_name: username },
      {
        headers: { "private-key": "5500c0d6-e315-4df3-b426-9ba119f69f44" },
      }
    );

    return res.status(r.status).json(r.data);
  } catch (e) {
    return res.status(e.response.status).json(e.response.data);
    // console.log("Something went wrong")
  }
});

export { app };
