require('dotenv').config();
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRouters = require('./routers/authRouter');
const slotRouters = require('./routers/slotRouter');
const shapeRouters = require('./routers/shapeRouter');
const motorRouters = require('./routers/motorAiRouter');
const reportRouters = require('./routers/reportRouter');
const userRouters = require('./routers/userRouter');
const mapRouters = require('./routers/mapRouter');
const semesterRouters = require('./routers/semesterRouter');
// const guardRouters = require("./routers/guardRouter");
const studentRouters = require('./routers/studentRouter');
const activityRouters = require('./routers/activityRouter');
const superAdminRouters = require('./routers/superAdminRouter');
const socketHandler = require('./socket/socketHandler');
const courseRouter = require('./routers/courseRouter');
const notificationRouters = require('./routers/notificationRouter');
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, origin || true),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
});

socketHandler(io);

//Middlewares
//CORS it allows HTTP requests from its origin
app.use(
  cors({
    origin: (origin, callback) => callback(null, origin || true),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.options('/{*path}', cors({
  origin: (origin, callback) => callback(null, origin || true),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//API Endpoints base urlse
app.get('/test-email', async (req, res) => {
  const nodemailer = require('nodemailer');
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    await transporter.verify();
    await transporter.sendMail({
      from: process.env.GMAIL_EMAIL,
      to: process.env.GMAIL_EMAIL,
      subject: 'Test Email from Render',
      html: '<p>Port 587 works!</p>',
    });
    res.json({ success: true, message: 'Email sent via port 587!' });
  } catch (error) {
    res.json({ success: false, error: error.message, code: error.code });
  }
});

app.use('/auth', authRouters);
app.use('/super-admin', superAdminRouters);
// app.use("/guard", guardRouters);
app.use('/student', studentRouters);
app.use('/motor', motorRouters);
app.use('/slot', slotRouters);
app.use('/shape', shapeRouters);
app.use('/user', userRouters);
app.use('/semester', semesterRouters);
app.use('/map', mapRouters);
app.use('/activity', activityRouters);
app.use('/report', reportRouters);
app.use('/course', courseRouter);
app.use('/notifications', notificationRouters);

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
      'An error occurred while initializing the server: ',
      error.message,
    );
  }
};

initializeServer();
