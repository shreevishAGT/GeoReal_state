// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const storeRoutes = require('./routes/stores');
// const sampleStores = require('./data/sampleStores');
// const Store = require('./models/Store');

// const app = express();
// app.use(bodyParser.json());

// // MongoDB connection
// mongoose.connect('mongodb+srv://Nivea_finder:Nivea_finder@cluster0.6ac8o2n.mongodb.net/?appName=Cluster0', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// // Load sample stores if collection is empty
// const loadSampleData = async () => {
//   const count = await Store.countDocuments();
//   if(count === 0) {
//     await Store.insertMany(sampleStores);
//     console.log('Sample stores inserted');
//   }
// };
// loadSampleData();

// // Routes
// app.use('/stores', storeRoutes);

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// //http://localhost:5000/stores/nearby?lng=72.8367&lat=19.2183&distance=5000   get method 

// // http://localhost:5000/stores    post method

// //for post the stores 
// // { 
// //   "name": "wadala medicals",
// //   "location": { "type": "Point", "coordinates": [72.8366, 19.2260] },
// //   "products": ["Nivea", "Paracetamol", "Bandages"]
// // }


const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const storeRoutes = require('./routes/stores');
const sampleStores = require('./data/sampleStores');
const dummyStores = require('./data/medical_stores_mixed_nivea.json');
const indiaStores = require('./data/medical_stores_india_900.json');
const Store = require('./models/Store');

const app = express();
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://Nivea_finder:Nivea_finder@cluster0.6ac8o2n.mongodb.net/?appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// ✅ Load sample + dummy data safely (no duplicates)
const loadSampleData = async () => {
  try {
    const count = await Store.countDocuments();

    // 1️⃣ If database empty → insert both sets
    if (count === 0) {
      await Store.insertMany([...sampleStores, ...dummyStores]);
      console.log('Inserted sample stores + 100 dummy stores');
    } else {
      // 2️⃣ If DB already has data → check for duplicates first
      const existingNames = (await Store.find({}, 'name')).map(s => s.name);
      const newStores = dummyStores.filter(s => !existingNames.includes(s.name));

      if (newStores.length > 0) {
        await Store.insertMany(newStores);
        console.log(`${newStores.length} new stores inserted`);
      } else {
        console.log('No new stores to insert (all already exist)');
      }
    }
  } catch (err) {
    console.error('Error loading sample data:', err);
  }
};



// ✅ Function to safely add new stores
const appendNewStores = async () => {
  try {
    console.log('Checking for new India-level stores...');
    const existingNames = (await Store.find({}, 'name')).map(s => s.name);
    const newStores = indiaStores.filter(s => !existingNames.includes(s.name));

    if (newStores.length > 0) {
      await Store.insertMany(newStores);
      console.log(`${newStores.length} new India-level stores inserted`);
    } else {
      console.log('No new India-level stores to insert (all already exist)');
    }
  } catch (err) {
    console.error('Error appending India-level stores:', err);
  }
};

//loadSampleData();
loadSampleData().then(() => appendNewStores());

// Routes
app.use('/stores', storeRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





