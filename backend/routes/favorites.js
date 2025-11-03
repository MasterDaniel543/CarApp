const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Car = require('../models/Car');

// GET /api/favorites?userId=...
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId es requerido' });

    const user = await User.findById(userId).populate('favorites');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    return res.json({ favorites: user.favorites || [] });
  } catch (err) {
    console.error('Error listando favoritos:', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
});

// POST /api/favorites/:carId  { userId }
router.post('/:carId', async (req, res) => {
  try {
    const { carId } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId es requerido' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: 'Vehículo no encontrado' });

    user.favorites = user.favorites || [];
    const exists = user.favorites.some(f => f.toString() === carId);
    if (!exists) {
      user.favorites.push(car._id);
      await user.save();
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error agregando favorito:', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
});

// DELETE /api/favorites/:carId  ?userId=...
router.delete('/:carId', async (req, res) => {
  try {
    const { carId } = req.params;
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId es requerido' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    user.favorites = (user.favorites || []).filter(f => f.toString() !== carId);
    await user.save();

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error eliminando favorito:', err);
    return res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;