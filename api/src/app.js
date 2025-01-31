const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

const userRouter = require('./routes/user.route');
const authRouter = require('./routes/auth.route');

app.use(express.json());

app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';;
  return res.status(statusCode).json({ 
    success: false,
    statusCode,
    message
  });
});

module.exports = app;