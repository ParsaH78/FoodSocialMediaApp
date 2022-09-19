const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const userRoute = require("./routes/usersRoutes");
const authRoute = require("./routes/authRoutes");
const postRoute = require("./routes/postsRoutes");
const conversationRoute = require("./routes/conversationsRoutes");
const messageRoute = require("./routes/messagesRoutes");

const app = express();
dotenv.config();


//middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));

app.use("/images", express.static(path.join(__dirname, "public/images")));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    return res.status(500).json({message: "Error in uploading file in server"});
  }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);


mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(8800, () => console.log(`Server Running on Port: http://localhost:8800`)))
  .catch((error) => console.log(`${error} did not connect`));