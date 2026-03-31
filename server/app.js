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
app.options(
  '/{*path}',
  cors({
    origin: (origin, callback) => callback(null, origin || true),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Email test endpoint for debugging
app.get('/test-email', async (req, res) => {
  try {
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      connectionTimeout: 10000,
      socketTimeout: 10000,
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log('[TEST EMAIL] SMTP connection verified');

    // Send test email
    const result = await transporter.sendMail({
      from: `"School Parking System" <${process.env.GMAIL_EMAIL}>`,
      to: req.query.email || process.env.GMAIL_EMAIL,
      subject: 'ParkEase Test Email',
      html: '<h1>Test Email</h1><p>If you see this, Gmail SMTP is working!</p>',
    });

    res.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: result.messageId,
      to: req.query.email || process.env.GMAIL_EMAIL,
    });
  } catch (error) {
    console.error('[TEST EMAIL ERROR]', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      hint: 'Check Render logs for more details. Common issues: Invalid app password, Gmail security settings, or network issues',
    });
  }
});

//API Endpoints base urlse
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
