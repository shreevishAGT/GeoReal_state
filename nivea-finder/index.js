const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const storeRoutes = require('./routes/stores');
const sampleStores = require('./data/sampleStores');
const Store = require('./models/Store');

const app = express();
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://Nivea_finder:Nivea_finder@cluster0.6ac8o2n.mongodb.net/?appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Load sample stores if collection is empty
const loadSampleData = async () => {
  const count = await Store.countDocuments();
  if(count === 0) {
    await Store.insertMany(sampleStores);
    console.log('Sample stores inserted');
  }
};
loadSampleData();

// Routes
app.use('/stores', storeRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//http://localhost:5000/stores/nearby?lng=72.8367&lat=19.2183&distance=5000   get method 

// http://localhost:5000/stores    post method

//for post the stores 
// { 
//   "name": "wadala medicals",
//   "location": { "type": "Point", "coordinates": [72.8366, 19.2260] },
//   "products": ["Nivea", "Paracetamol", "Bandages"]
// }
