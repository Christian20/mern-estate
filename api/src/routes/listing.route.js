const express = require('express');
const { createListing, deleteListing } = require('../controllers/listing.controller');
const { verifyToken } = require('../utils/verifyUser');

const listingRouter = express.Router();

listingRouter.post('/create', verifyToken, createListing);
listingRouter.delete('/delete/:id', verifyToken, deleteListing);

module.exports = listingRouter;

