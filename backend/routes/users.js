const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users - listar usuarios (sin contraseña)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ created_at: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    console.error('Error listando usuarios:', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// GET /api/users/:id - obtener usuario por id (sin contraseña)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { password: 0 });
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    res.json({ success: true, data: user });
  } catch (err) {
    console.error('Error obteniendo usuario:', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
});

// PUT /api/users/:id - actualizar nombre, email o rol
router.put('/:id', async (req, res) => {
  try {
    const allowed = ['name', 'email', 'role'];
    const update = {};
    for (const k of allowed) {
      if (req.body[k] != null) update[k] = req.body[k];
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  
    const { name, email, role } = req.body;
  
    if (user.role === 'admin' && typeof role !== 'undefined' && role !== 'admin') {
      return res.status(403).json({ error: 'No se puede cambiar el rol del usuario administrador' });
    }
  
    if (typeof name !== 'undefined') user.name = name;
    if (typeof email !== 'undefined') user.email = email;
    if (typeof role !== 'undefined') user.role = role;
  
    await user.save();
    res.json({ data: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Error actualizando usuario:', err);
    res.status(400).json({ success: false, message: err.message || 'Error actualizando usuario' });
  }
});

module.exports = router;