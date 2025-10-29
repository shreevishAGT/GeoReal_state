const express = require('express');
const router = express.Router();
const Place = require('../models/Place');

// POST – create a new place
router.post('/', async (req, res) => {
  try {
    const { name, type, longitude, latitude, price, status } = req.body;

    if (longitude === undefined || latitude === undefined) {
      return res.status(400).json({ error: 'longitude & latitude are required' });
    }

    const place = new Place({
      name,
      type,
      location: {
        type: 'Point',
        coordinates: [ parseFloat(longitude), parseFloat(latitude) ]
      },
      price,
      status
    });

    await place.save();
    return res.status(201).json(place);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET – nearby places (within radius)
router.get('/nearby', async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000, status, type } = req.query;

    if (longitude === undefined || latitude === undefined) {
      return res.status(400).json({ error: 'longitude & latitude are required' });
    }

    const coords = [ parseFloat(longitude), parseFloat(latitude) ];
    const filter = {
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: coords
          },
          $maxDistance: parseInt(maxDistance, 10)
        }
      }
    };

    if (status) filter.status = status;
    if (type) filter.type = type;

    const places = await Place.find(filter);
    return res.json(places);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// POST – within polygon
router.post('/within', async (req, res) => {
  try {
    const { polygon, status, type } = req.body;

    if (!polygon || polygon.type !== 'Polygon' || !Array.isArray(polygon.coordinates)) {
      return res.status(400).json({ error: 'Invalid polygon data' });
    }

    const filter = {
      location: {
        $geoWithin: {
          $geometry: polygon
        }
      }
    };
    if (status) filter.status = status;
    if (type) filter.type = type;

    const places = await Place.find(filter);
    return res.json(places);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
