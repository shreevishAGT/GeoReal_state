const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      required: true
    }
  },
  price: { type: Number },
  status: { type: String, default: 'available' }
});

// Create the 2dsphere index on location
placeSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Place', placeSchema);
