

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const placesRouter = require("./routes/Place");   // rename variable for clarity
const app = express();

app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Mount the router – this makes the routes inside Place.js live under /places
app.use('/places', placesRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//http://localhost:3000/places/nearby?longitude=72.83&latitude=19.04&maxDistance=5000 get  
//  http://localhost:3000/places  post method
//  http://localhost:3000/places/within 

/**polygon: { type: "Polygon", coordinates: [...] }, status?, type? } for places/within */

// [
//   {
//     "name": "Beachfront Villa",
//     "type": "property",
//     "longitude": 72.8120,
//     "latitude": 19.0785,
//     "price": 250000,
//     "status": "available"
//   },
//   {
//     "name": "Downtown Apartment",
//     "type": "property",
//     "longitude": 72.8360,
//     "latitude": 19.0200,
//     "price": 120000,
//     "status": "available"
//   },
//   {
//     "name": "Suburban House",
//     "type": "property",
//     "longitude": 72.9000,
//     "latitude": 19.1500,
//     "price": 190000,
//     "status": "sold"
//   },
//   {
//     "name": "City Center Shop",
//     "type": "commercial",
//     "longitude": 72.8300,
//     "latitude": 19.0450,
//     "price": 300000,
//     "status": "available"
//   }
// ]


// {
//   "name": "...",
//   "type": "...",
//   "longitude": 72.8120,
//   "latitude": 19.0785,
//   "price": 250000,
//   "status": "available"
// }