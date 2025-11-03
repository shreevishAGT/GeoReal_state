const mongoose = require('mongoose');

const professionalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  
  // GeoJSON location for geospatial queries
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

  // Hourly rate for service
  hourlyRate: { type: Number, required: true },

  // Services this professional provides
  services: { type: [String], required: true },

  // Badges or certifications
  badges: { type: [String], default: [] },

  // Optional: contact info, description, etc.
  email: { type: String },
  phone: { type: String },
  description: { type: String }
});

// 2dsphere index for geospatial queries
professionalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Professional', professionalSchema);
