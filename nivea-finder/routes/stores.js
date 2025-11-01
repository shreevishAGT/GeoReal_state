const express = require('express');
const router = express.Router();
const Store = require('../models/Store');

// Add a new store
router.post('/', async (req, res) => {
  try {
    const store = new Store(req.body);
    await store.save();
    res.status(201).json(store);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get nearby stores selling Nivea
router.get('/nearby', async (req, res) => {
  try {
    const { lng, lat, distance } = req.query;

    const stores = await Store.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseFloat(distance) // in meters
        }
      },
      products: "Nivea"
    });

    res.json(stores);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
