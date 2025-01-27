const express = require('express');

const app = express();

const userRouter = require('./routes/user.route');

app.use('/api/user', userRouter);

module.exports = app;