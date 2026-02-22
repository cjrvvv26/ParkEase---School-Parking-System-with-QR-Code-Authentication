require("dotenv").config();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRouters = require("./routers/authRouter");
const slotRouters = require("./routers/slotRouter");
const shapeRouters = require("./routers/shapeRouter");
const motorRouters = require("./routers/motorAiRouter");
const reportRouters = require("./routers/reportRouter");
const userRouters = require("./routers/userRouter");
const mapRouters = require("./routers/mapRouter");
const semesterRouters = require("./routers/semesterRouter");
// const guardRouters = require("./routers/guardRouter");
const studentRouters = require("./routers/studentRouter");
const superAdminRouters = require("./routers/superAdminRouter");
const socketHandler = require("./socket/socketHandler");
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

socketHandler(io);

//Middlewares
//CORS it allows HTTP requests from its origin
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//API Endpoints base urlse
app.use("/auth", authRouters);
app.use("/super-admin", superAdminRouters);
// app.use("/guard", guardRouters);
app.use("/student", studentRouters);
app.use("/motor", motorRouters);
app.use("/slot", slotRouters);
app.use("/shape", shapeRouters);
app.use("/user", userRouters);
app.use("/semester", semesterRouters);
app.use("/map", mapRouters);
app.use("/report", reportRouters);

//Initialize Server
const initializeServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    server.listen(process.env.PORT, () => {
      console.log(
        `The server is running on port: http://localhost:${process.env.PORT}`,
      );
    });
  } catch (error) {
    console.log(
      "An error occurred while initializing the server: ",
      error.message,
    );
  }
};

initializeServer();
