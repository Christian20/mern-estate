const mongoose = require('mongoose');
 
require('dotenv').config();
 
const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
  console.log('Connected to MongoDB');
}

async function mongoDisconnect() {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
}