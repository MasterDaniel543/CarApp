const mongoose = require('mongoose');
require('dotenv').config();

// Importar el modelo
const Car = require('../models/Car');

// Nuevos carros con información más completa
const newCars = [
  {
    make: 'BMW',
    model: 'X5',
    year: 2023,
    price: 65000,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=400&fit=crop',
    fuel_type: 'gas',
    transmission: 'automatic',
    drive: 'awd',
    city_mpg: 21,
    highway_mpg: 26,
    combination_mpg: 23,
    engine: '3.0L Twin Turbo I6',
    horsepower: 335,
    torque: 330,
    body_type: 'suv',
    doors: 4,
    seats: 5,
    color: 'Negro',
    mileage: 0,
    condition: 'nuevo',
    features: ['Navegación GPS', 'Asientos de cuero', 'Techo panorámico', 'Sistema de sonido premium', 'Cámara 360°'],
    dealer: {
      name: 'BMW Premium Motors',
      phone: '+1-800-BMW-LUXURY',
      address: 'Av. Reforma 1234, Ciudad de México'
    }
  },
  {
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2023,
    price: 45000,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=400&fit=crop',
    fuel_type: 'gas',
    transmission: 'automatic',
    drive: 'rwd',
    city_mpg: 23,
    highway_mpg: 32,
    combination_mpg: 27,
    engine: '2.0L Turbo I4',
    horsepower: 255,
    torque: 273,
    body_type: 'sedan',
    doors: 4,
    seats: 5,
    color: 'Plata',
    mileage: 0,
    condition: 'nuevo',
    features: ['MBUX Infotainment', 'Asientos deportivos', 'LED Headlights', 'Wireless Charging', 'Apple CarPlay'],
    dealer: {
      name: 'Mercedes-Benz Elite',
      phone: '+1-800-MB-ELITE',
      address: 'Polanco 567, Ciudad de México'
    }
  },
  {
    make: 'Audi',
    model: 'A4',
    year: 2023,
    price: 42000,
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=400&fit=crop',
    fuel_type: 'gas',
    transmission: 'automatic',
    drive: 'awd',
    city_mpg: 24,
    highway_mpg: 31,
    combination_mpg: 27,
    engine: '2.0L TFSI I4',
    horsepower: 261,
    torque: 273,
    body_type: 'sedan',
    doors: 4,
    seats: 5,
    color: 'Azul',
    mileage: 0,
    condition: 'nuevo',
    features: ['Quattro AWD', 'Virtual Cockpit', 'Bang & Olufsen Sound', 'Adaptive Cruise Control', 'Matrix LED'],
    dealer: {
      name: 'Audi Premium Center',
      phone: '+1-800-AUDI-PRO',
      address: 'Santa Fe 890, Ciudad de México'
    }
  },
  {
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    price: 48000,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=400&fit=crop',
    fuel_type: 'electric',
    transmission: 'automatic',
    drive: 'rwd',
    city_mpg: 142, // MPGe para eléctricos
    highway_mpg: 132,
    combination_mpg: 137,
    engine: 'Electric Motor',
    horsepower: 283,
    torque: 307,
    body_type: 'sedan',
    doors: 4,
    seats: 5,
    color: 'Blanco',
    mileage: 0,
    condition: 'nuevo',
    features: ['Autopilot', 'Supercharging', '15" Touchscreen', 'Over-the-air Updates', 'Premium Audio'],
    dealer: {
      name: 'Tesla Store México',
      phone: '+1-800-TESLA-MX',
      address: 'Insurgentes Sur 1234, Ciudad de México'
    }
  },
  {
    make: 'Porsche',
    model: '911',
    year: 2023,
    price: 115000,
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=400&fit=crop',
    fuel_type: 'gas',
    transmission: 'automatic',
    drive: 'rwd',
    city_mpg: 18,
    highway_mpg: 24,
    combination_mpg: 20,
    engine: '3.0L Twin Turbo H6',
    horsepower: 379,
    torque: 331,
    body_type: 'coupe',
    doors: 2,
    seats: 4,
    color: 'Rojo',
    mileage: 0,
    condition: 'nuevo',
    features: ['Sport Chrono Package', 'PASM Suspension', 'Porsche Communication Management', 'Sport Exhaust', 'Ceramic Brakes'],
    dealer: {
      name: 'Porsche Center México',
      phone: '+1-800-PORSCHE',
      address: 'Bosques de las Lomas 456, Ciudad de México'
    }
  },
  {
    make: 'Lexus',
    model: 'RX 350',
    year: 2023,
    price: 52000,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=400&fit=crop',
    fuel_type: 'gas',
    transmission: 'automatic',
    drive: 'awd',
    city_mpg: 20,
    highway_mpg: 27,
    combination_mpg: 23,
    engine: '3.5L V6',
    horsepower: 295,
    torque: 267,
    body_type: 'suv',
    doors: 4,
    seats: 5,
    color: 'Gris',
    mileage: 0,
    condition: 'nuevo',
    features: ['Lexus Safety System+', 'Mark Levinson Audio', 'Panoramic Roof', 'Wireless Charging', 'Head-Up Display'],
    dealer: {
      name: 'Lexus Premium',
      phone: '+1-800-LEXUS-MX',
      address: 'Zona Rosa 789, Ciudad de México'
    }
  }
];

async function addMoreCars() {
  try {
    // Conectar a MongoDB usando la URL pública de Railway
    await mongoose.connect('mongodb://mongo:ATLyUXagXXQqBVTVpVdaSsSmroIITGTI@shuttle.proxy.rlwy.net:40968');

    console.log('Conectado a MongoDB Railway');

    // Insertar los nuevos carros
    const insertedCars = await Car.insertMany(newCars);
    
    console.log(` ${insertedCars.length} nuevos vehículos agregados exitosamente:`);
    insertedCars.forEach(car => {
      console.log(`   - ${car.make} ${car.model} ${car.year} - $${car.price.toLocaleString()}`);
    });

    // Mostrar total de vehículos en la base de datos
    const totalCars = await Car.countDocuments();
    console.log(` Total de vehículos en la base de datos: ${totalCars}`);

  } catch (error) {
    console.error('Error agregando vehículos:', error);
  } finally {
    await mongoose.connection.close();
    console.log(' Conexión cerrada');
  }
}

// Ejecutar el script
addMoreCars();