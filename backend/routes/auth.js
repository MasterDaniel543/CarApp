const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, correo y contraseña son obligatorios.' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'El correo ya está registrado.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashed, role });
    const safeUser = user.toJSON ? user.toJSON() : user;
    delete safeUser.password;

    return res.status(201).json({ user: safeUser });
  } catch (err) {
    console.error('Error en /register:', err);
    return res.status(500).json({ message: 'Error del servidor.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son obligatorios.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Credenciales inválidas.' });

    const safeUser = user.toJSON ? user.toJSON() : user;
    delete safeUser.password;

    return res.status(200).json({ user: safeUser });
  } catch (err) {
    console.error('Error en /login:', err);
    return res.status(500).json({ message: 'Error del servidor.' });
  }
});

// No usamos /me ni JWT en este flujo.
module.exports = router;