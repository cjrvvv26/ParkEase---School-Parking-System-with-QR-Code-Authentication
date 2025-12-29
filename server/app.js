require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRouters = require("./routers/authRouter");
const superAdminRouters = require("./routers/superAdminRouter");
// const guardRouters = require("./routers/guardRouter");
// const studentRouters = require("./routers/studentRouter");
const motorRouters = require("./routers/motorAiRouter");
// const userRouters = require("./routers/userRouter");
// const slotRouters = require("./routers/slotRouter");
const app = express();

//Middlewares
//CORS it allows HTTP requests from its origin
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
//It accepts the json data (for postman)
app.use(express.json());
//API Endpoints base urlse
app.use("/auth", authRouters);
app.use("/super-admin", superAdminRouters);
// app.use("/guard", guardRouters);
// app.use("/student", studentRouters);
app.use("/motor", motorRouters);
// app.use("/user", userRouters);
// app.use("/slot", slotRouters);

//Initialize Server
const initializeServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(process.env.PORT, () => {
      console.log(
        `The server is running on port: http://localhost:${process.env.PORT}`
      );
    });
  } catch (error) {
    console.log(
      "An error occurred while initializing the server: ",
      error.message
    );
  }
};

initializeServer();
