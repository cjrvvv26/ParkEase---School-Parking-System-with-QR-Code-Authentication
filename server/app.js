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

    console.log('[TEST EMAIL] Setting up Gmail SMTP...');

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL instead of STARTTLS
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      connectionTimeout: 30000,
      socketTimeout: 30000,
      debug: true,
      logger: true,
    });

    console.log('[TEST EMAIL] Verifying connection...');

    // Verify connection
    await transporter.verify();
    console.log('[TEST EMAIL] ✅ SMTP connection verified');

    const testEmail = req.query.email || 'cjrv026.work@gmail.com';
    console.log(`[TEST EMAIL] Sending test email to ${testEmail}...`);

    // Send test email
    const result = await transporter.sendMail({
      from: `"School Parking System" <${process.env.GMAIL_EMAIL}>`,
      to: testEmail,
      subject: 'School Parking System - Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8b5cf6;">School Parking System</h1>
          <p>This is a test email to verify Gmail SMTP is working on Render.</p>
          <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
          <p><strong>From:</strong> ${process.env.GMAIL_EMAIL}</p>
          <p><strong>To:</strong> ${testEmail}</p>
          <p>If you received this, Gmail SMTP is working correctly! ✅</p>
        </div>
      `,
    });

    console.log(
      `[TEST EMAIL] ✅ Email sent successfully. Message ID: ${result.messageId}`,
    );

    res.json({
      success: true,
      message: 'Test email sent successfully via Gmail SMTP',
      messageId: result.messageId,
      to: testEmail,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[TEST EMAIL ERROR] ❌ Failed:', error.message);
    console.error('[TEST EMAIL ERROR] Full details:', error);

    let hint = 'Check Render logs for detailed error information.';

    if (error.message.includes('Authentication failed')) {
      hint =
        'Gmail app password is incorrect or expired. Generate a new one at myaccount.google.com/apppasswords';
    } else if (error.message.includes('connect ETIMEDOUT')) {
      hint =
        'Connection timeout - Render may be blocking SMTP. Try using port 465 with secure: true';
    } else if (error.message.includes('Invalid login')) {
      hint =
        'Invalid Gmail credentials. Check GMAIL_EMAIL and GMAIL_APP_PASSWORD in Render environment variables';
    }

    res.status(500).json({
      success: false,
      error: error.message,
      hint,
      timestamp: new Date().toISOString(),
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
