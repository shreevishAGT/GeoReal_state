const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  products: [String]
});

// 2dsphere index for geospatial queries
storeSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Store', storeSchema);
