const mongoose = require('mongoose');
const Car = require('../models/Car');
require('dotenv').config();

// Datos de vehículos para poblar la base de datos
const carsData = [
  {
    make: 'Toyota',
    model: 'Camry',
    year: 2024,
    price: 28500,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=400&fit=crop',
    fuel_type: 'gas',
    transmission: 'automatic',
    drive: 'fwd',
    city_mpg: 28,
    highway_mpg: 39,
    combination_mpg: 32,
    engine: '2.5L 4-Cylinder',
    horsepower: 203,
    torque: 184,
    body_type: 'sedan',
    doors: 4,
    seats: 5,
    color: 'Blanco Perla',
    condition: 'nuevo',
    features: ['Apple CarPlay', 'Android Auto', 'Cámara de reversa', 'Bluetooth', 'Control de crucero']
  },
  {
    make: 'Honda',
    model: 'Civic',
    year: 2024,
    price: 25200,
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=400&fit=crop',
    fuel_type: 'gas',
    transmission: 'automatic',
    drive: 'fwd',
    city_mpg: 32,
    highway_mpg: 42,
    combination_mpg: 36,
    engine: '2.0L 4-Cylinder',
    horsepower: 158,
    torque: 138,
    body_type: 'sedan',
    doors: 4,
    seats: 5,
    color: 'Azul Metálico',
    condition: 'nuevo',
    features: ['Honda Sensing', 'Pantalla táctil 7"', 'Cámara de reversa', 'Bluetooth']
  },
  {
    make: 'Ford',
    model: 'Mustang',
    year: 2024,
    price: 38500,
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=800&h=400&fit=crop',
    fuel_type: 'gas',
    transmission: 'manual',
    drive: 'rwd',
    city_mpg: 15,
    highway_mpg: 24,
    combination_mpg: 18,
    engine: '5.0L V8',
    horsepower: 450,
    torque: 410,
    body_type: 'coupe',
    doors: 2,
    seats: 4,
    color: 'Rojo Racing',
    condition: 'nuevo',
    features: ['SYNC 3', 'Asientos deportivos', 'Escape deportivo', 'Modo Track']
  },
  {
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2024,
    price: 48900,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=400&fit=crop',
    fuel_type: 'gas',
    transmission: 'automatic',
    drive: 'rwd',
    city_mpg: 23,
    highway_mpg: 34,
    combination_mpg: 27,
    engine: '2.0L Turbo 4-Cylinder',
    horsepower: 255,
    torque: 273,
    body_type: 'sedan',
    doors: 4,
    seats: 5,
    color: 'Negro Obsidiana',
    condition: 'nuevo',
    features: ['MBUX', 'Asientos de cuero', 'Techo solar', 'Navegación GPS', 'Cargador inalámbrico']
  },
  {
    make: 'BMW',
    model: '3 Series',
    year: 2024,
    price: 45500,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=400&fit=crop',
    fuel_type: 'gas',
    transmission: 'automatic',
    drive: 'rwd',
    city_mpg: 26,
    highway_mpg: 36,
    combination_mpg: 30,
    engine: '2.0L TwinPower Turbo',
    horsepower: 255,
    torque: 294,
    body_type: 'sedan',
    doors: 4,
    seats: 5,
    color: 'Gris Mineral',
    condition: 'nuevo',
    features: ['iDrive 7.0', 'Asientos deportivos', 'Faros LED', 'Wireless CarPlay']
  },
  {
    make: 'Tesla',
    model: 'Model 3',
    year: 2024,
    price: 42990,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=400&fit=crop',
    fuel_type: 'electric',
    transmission: 'automatic',
    drive: 'rwd',
    city_mpg: 132, // MPGe
    highway_mpg: 126,
    combination_mpg: 129,
    engine: 'Motor Eléctrico',
    horsepower: 283,
    torque: 307,
    body_type: 'sedan',
    doors: 4,
    seats: 5,
    color: 'Blanco Perla',
    condition: 'nuevo',
    features: ['Autopilot', 'Pantalla 15"', 'Supercargador', 'Actualizaciones OTA', 'Modo Centinela']
  },
  {
    make: 'Audi',
    model: 'A4',
    year: 2024,
    price: 42800,
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=400&fit=crop',
    fuel_type: 'gas',
    transmission: 'automatic',
    drive: 'awd',
    city_mpg: 24,
    highway_mpg: 34,
    combination_mpg: 28,
    engine: '2.0L TFSI',
    horsepower: 201,
    torque: 236,
    body_type: 'sedan',
    doors: 4,
    seats: 5,
    color: 'Blanco Glaciar',
    condition: 'nuevo',
    features: ['MMI Touch', 'Quattro AWD', 'Virtual Cockpit', 'Audi Pre Sense']
  },
  {
    make: 'Nissan',
    model: 'Altima',
    year: 2023,
    price: 24500,
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=400&fit=crop',
    fuel_type: 'gas',
    transmission: 'automatic',
    drive: 'fwd',
    city_mpg: 28,
    highway_mpg: 39,
    combination_mpg: 32,
    engine: '2.5L 4-Cylinder',
    horsepower: 188,
    torque: 180,
    body_type: 'sedan',
    doors: 4,
    seats: 5,
    color: 'Gris Charcoal',
    mileage: 15000,
    condition: 'usado',
    features: ['NissanConnect', 'Cámara 360°', 'ProPILOT Assist', 'Bluetooth']
  }
];

async function seedDatabase() {
  try {
    console.log('🔌 Conectando a MongoDB Atlas...');
    
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado a MongoDB Atlas');

    // Limpiar colección existente
    const deleteResult = await Car.deleteMany({});
    console.log(`🗑️ ${deleteResult.deletedCount} vehículos anteriores eliminados`);

    // Insertar nuevos datos
    const cars = await Car.insertMany(carsData);
    console.log(`✅ ${cars.length} vehículos insertados exitosamente`);

    // Mostrar resumen
    console.log('\n📊 Resumen de vehículos insertados:');
    const summary = await Car.aggregate([
      {
        $group: {
          _id: '$make',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    summary.forEach(item => {
      console.log(`   ${item._id}: ${item.count} vehículos (Precio promedio: $${Math.round(item.avgPrice).toLocaleString()})`);
    });

    console.log('\n🎉 Base de datos poblada exitosamente!');
    console.log('🚀 Ahora puedes iniciar el servidor con: npm start');
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Error poblando base de datos:', error);
    process.exit(1);
  }
}

seedDatabase();