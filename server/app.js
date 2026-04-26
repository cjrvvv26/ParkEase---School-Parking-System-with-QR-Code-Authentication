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

// Store io instance in app.locals for access in controllers
app.locals.io = io;

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
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'RESEND_API_KEY not configured',
      });
    }

    console.log('[TEST EMAIL] Sending via Resend API');

    const testEmail = req.query.email || 'cjrv026.work@gmail.com';
    console.log(`[TEST EMAIL] To: ${testEmail}`);

    const result = await resend.emails.send({
      from: 'School Parking System <onboarding@resend.dev>',
      to: [testEmail],
      subject: 'School Parking System - Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #8b5cf6;">School Parking System</h1>
          <p>This is a test email via Resend API.</p>
          <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
          <p><strong>To:</strong> ${testEmail}</p>
          <p>If you received this, Resend API is working! ✅</p>
          <p><em>Note: Resend default domain works best for same-domain emails.</em></p>
        </div>
      `,
    });

    console.log(
      `[TEST EMAIL] ✅ Sent successfully. Message ID: ${result.data?.id}`,
    );

    res.json({
      success: true,
      message: 'Test email sent successfully via Resend API',
      messageId: result.data?.id,
      to: testEmail,
      note: 'Resend default domain works best for same-domain emails',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[TEST EMAIL ERROR] ❌ Failed:', error.message);

    let hint = 'Check Render logs for details.';

    if (error.message.includes('rate limit')) {
      hint = 'Rate limit exceeded. Try again later.';
    } else if (error.message.includes('unauthorized')) {
      hint =
        'Invalid RESEND_API_KEY. Check your API key in Render environment variables';
    } else if (
      error.message.includes('blocked') ||
      error.message.includes('spam')
    ) {
      hint =
        'Email blocked by recipient provider. This is normal with Resend default domain.';
    }

    res.status(500).json({
      success: false,
      error: error.message,
      hint,
      note: 'For testing, try sending to your own Gmail address first',
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
