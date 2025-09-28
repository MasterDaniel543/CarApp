const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// ⚠️ IMPORTANTE: Las rutas específicas DEBEN ir ANTES que las rutas con parámetros

// GET /api/cars/brands/all - Obtener todas las marcas
router.get('/brands/all', async (req, res) => {
  try {
    const brands = await Car.distinct('make', { availability: true });
    
    res.json({
      success: true,
      data: brands.sort()
    });

  } catch (error) {
    console.error('Error obteniendo marcas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/cars/recommended/list - Obtener vehículos recomendados
router.get('/recommended/list', async (req, res) => {
  try {
    const recommended = await Car.find({ 
      availability: true,
      condition: 'nuevo'
    })
    .sort({ created_at: -1 })
    .limit(6);

    res.json({
      success: true,
      data: recommended
    });

  } catch (error) {
    console.error('Error obteniendo recomendados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/cars - Obtener todos los vehículos con filtros
router.get('/', async (req, res) => {
  try {
    const {
      make,
      model,
      year_min,
      year_max,
      price_min,
      price_max,
      fuel_type,
      transmission,
      body_type,
      condition,
      page = 1,
      limit = 20,
      sort = 'created_at'
    } = req.query;

    // Construir filtros
    const filters = { availability: true };
    
    if (make) filters.make = new RegExp(make, 'i');
    if (model) filters.model = new RegExp(model, 'i');
    if (year_min || year_max) {
      filters.year = {};
      if (year_min) filters.year.$gte = parseInt(year_min);
      if (year_max) filters.year.$lte = parseInt(year_max);
    }
    if (price_min || price_max) {
      filters.price = {};
      if (price_min) filters.price.$gte = parseInt(price_min);
      if (price_max) filters.price.$lte = parseInt(price_max);
    }
    if (fuel_type) filters.fuel_type = fuel_type;
    if (transmission) filters.transmission = transmission;
    if (body_type) filters.body_type = body_type;
    if (condition) filters.condition = condition;

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Obtener vehículos
    const cars = await Car.find(filters)
      .sort({ [sort]: sort === 'price' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Contar total para paginación
    const total = await Car.countDocuments(filters);

    res.json({
      success: true,
      data: cars,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / parseInt(limit)),
        total_items: total,
        items_per_page: parseInt(limit)
      },
      filters_applied: filters
    });

  } catch (error) {
    console.error('Error obteniendo vehículos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/cars/:id - Obtener vehículo por ID (DEBE ir después de las rutas específicas)
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    res.json({
      success: true,
      data: car
    });

  } catch (error) {
    console.error('Error obteniendo vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// POST /api/cars - Crear nuevo vehículo (para admin)
router.post('/', async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();

    res.status(201).json({
      success: true,
      message: 'Vehículo creado exitosamente',
      data: car
    });

  } catch (error) {
    console.error('Error creando vehículo:', error);
    res.status(400).json({
      success: false,
      message: 'Error creando vehículo',
      error: error.message
    });
  }
});

// PUT /api/cars/:id - Actualizar vehículo
router.put('/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Vehículo actualizado exitosamente',
      data: car
    });

  } catch (error) {
    console.error('Error actualizando vehículo:', error);
    res.status(400).json({
      success: false,
      message: 'Error actualizando vehículo',
      error: error.message
    });
  }
});

// DELETE /api/cars/:id - Eliminar vehículo (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { availability: false },
      { new: true }
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Vehículo eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;