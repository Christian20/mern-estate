const express = require('express');

const app = express();

const userRouter = require('./routes/user.route');
const authRouter = require('./routes/auth.route');

app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

module.exports = app;