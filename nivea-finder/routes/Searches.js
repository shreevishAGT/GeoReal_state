const express = require('express');

const router = express.Router();
const Professional = require('../models/Professional');
const axios = require('axios');

// Convert km or miles to meters
function convertToMeters(distance, unit) {
  if (unit === 'miles') return distance * 1609.34;
  return distance * 1000; // km default
}

router.post('/search', async (req, res) => {
  try {
    const { location, distance, unit, hourlyRate, services, badges } = req.body;

    if (!location || !distance) {
      return res.status(400).json({ error: "Location and distance are required" });
    }

    // 1. Convert location string to lat/lng
    const geoRes = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: { address: location, key: process.env.GOOGLE_MAPS_API_KEY }
    });

    if (!geoRes.data.results.length) {
      return res.status(400).json({ error: "Invalid location" });
    }

    const { lat, lng } = geoRes.data.results[0].geometry.location;
    const maxDistance = convertToMeters(Number(distance), unit || 'km');

    // 2. Build MongoDB query
    const query = {
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: maxDistance
        }
      }
    };

    // Filter by hourly rate if provided
    if (hourlyRate) {
      query.hourlyRate = { $lte: hourlyRate }; // professionals <= user max rate
    }

    // Filter by services if provided
    if (services && services.length) {
      query.services = { $in: services };
    }

    // Filter by badges if provided
    if (badges && badges.length) {
      query.badges = { $in: badges };
    }

    // 3. Execute query
    const professionals = await Professional.find(query);

    res.json({
      professionals,
      filters: {
        location,
        lat,
        lng,
        distance,
        unit,
        hourlyRate: hourlyRate || null,
        services: services || [],
        badges: badges || []
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
