require("dotenv").config();
const cors = require("cors");
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
// const guardRouters = require("./routers/guardRouter");
const studentRouters = require("./routers/studentRouter");
const superAdminRouters = require("./routers/superAdminRouter");
const app = express();

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
app.use("/map", mapRouters);
app.use("/report", reportRouters);

//Initialize Server
const initializeServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(process.env.PORT, () => {
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
