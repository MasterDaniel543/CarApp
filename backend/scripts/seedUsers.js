const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');

async function seedUsers() {
  try {
    const mongoUri =
      process.env.MONGO_URL ||
      process.env.MONGODB_URI ||
      process.argv[2] ||
      'mongodb://mongo:ATLyUXagXXQqBVTVpVdaSsSmroIITGTI@shuttle.proxy.rlwy.net:40968';

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');

    const users = [
      { name: 'Admin', email: 'admin@carapp.com', password: 'Admin123!', role: 'admin' },
      { name: 'Usuario', email: 'usuario@carapp.com', password: 'Usuario123!', role: 'user' },
    ];

    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`Ya existe: ${u.email}`);
      } else {
        const created = await new User(u).save();
        console.log(`Creado: ${created.email} (${created.role})`);
      }
    }
  } catch (error) {
    console.error('Error sembrando usuarios:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Conexión cerrada');
  }
}

seedUsers();