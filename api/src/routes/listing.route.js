const express = require('express');
const { 
  createListing, 
  deleteListing, 
  updateListing,
  getListing,
  getListings,
} = require('../controllers/listing.controller');
const { verifyToken } = require('../utils/verifyUser');

const listingRouter = express.Router();

listingRouter.post('/create', verifyToken, createListing);
listingRouter.delete('/delete/:id', verifyToken, deleteListing);
listingRouter.post('/update/:id', verifyToken, updateListing);
listingRouter.get('/get/:id', getListing);
listingRouter.get('/get', getListings);

module.exports = listingRouter;

