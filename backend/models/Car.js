const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  make: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  fuel_type: {
    type: String,
    enum: ['gas', 'diesel', 'hybrid', 'electric', 'flex'],
    default: 'gas'
  },
  transmission: {
    type: String,
    enum: ['manual', 'automatic', 'cvt'],
    default: 'automatic'
  },
  drive: {
    type: String,
    enum: ['fwd', 'rwd', 'awd', '4wd'],
    default: 'fwd'
  },
  city_mpg: {
    type: Number,
    min: 1,
    max: 150
  },
  highway_mpg: {
    type: Number,
    min: 1,
    max: 150
  },
  combination_mpg: {
    type: Number,
    min: 1,
    max: 150
  },
  engine: {
    type: String,
    trim: true
  },
  horsepower: {
    type: Number,
    min: 50,
    max: 2000
  },
  torque: {
    type: Number,
    min: 50,
    max: 2000
  },
  body_type: {
    type: String,
    enum: ['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'truck', 'wagon', 'minivan'],
    default: 'sedan'
  },
  doors: {
    type: Number,
    enum: [2, 4, 5],
    default: 4
  },
  seats: {
    type: Number,
    min: 2,
    max: 8,
    default: 5
  },
  color: {
    type: String,
    default: 'Blanco'
  },
  mileage: {
    type: Number,
    min: 0,
    default: 0
  },
  condition: {
    type: String,
    enum: ['nuevo', 'usado', 'certificado'],
    default: 'nuevo'
  },
  features: [{
    type: String
  }],
  dealer: {
    name: {
      type: String,
      default: 'AutoDealer Pro'
    },
    phone: {
      type: String,
      default: '+1-800-CAR-DEAL'
    },
    address: {
      type: String,
      default: 'Ciudad de México, México'
    }
  },
  availability: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Middleware para actualizar updated_at
carSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Índices para búsquedas eficientes
carSchema.index({ make: 1, model: 1 });
carSchema.index({ year: 1 });
carSchema.index({ price: 1 });
carSchema.index({ fuel_type: 1 });
carSchema.index({ body_type: 1 });

module.exports = mongoose.model('Car', carSchema);