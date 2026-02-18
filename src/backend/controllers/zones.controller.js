import Zone from '../models/Zone.js';
import { calculatePolygonArea } from '../services/geofencing.service.js';

/**
 * 📍 GET /api/zones
 * Obtener todas las zonas protegidas
 */
export const getAll = async (req, res) => {
  try {
    const { active } = req.query;
    
    const filter = {};
    if (active !== undefined) {
      filter.active = active === 'true';
    }

    const zones = await Zone.find(filter).sort({ createdAt: -1 });

    // Normalizar al formato esperado por tu UI
    const zonesNormalized = zones.map((zone) => ({
      id: zone._id,
      name: zone.name,
      level: zone.level,
      levelLabel: zone.levelLabel,
      icon: zone.icon,
      area: zone.area,
      boats: zone.boats,
      created: zone.createdAt.toLocaleDateString('es-ES'),
      description: zone.description,
      geometry: zone.geometry,
      active: zone.active,
    }));

    res.json(zonesNormalized);
  } catch (error) {
    console.error('Error en zones/getAll:', error);
    res.status(500).json({ error: 'Error obteniendo zonas' });
  }
};

/**
 * 🗺️ GET /api/zones/:id
 * Obtener una zona específica
 */
export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const zone = await Zone.findById(id);

    if (!zone) {
      return res.status(404).json({ error: 'Zona no encontrada' });
    }

    res.json({
      id: zone._id,
      name: zone.name,
      level: zone.level,
      levelLabel: zone.levelLabel,
      icon: zone.icon,
      area: zone.area,
      boats: zone.boats,
      created: zone.createdAt.toLocaleDateString('es-ES'),
      description: zone.description,
      geometry: zone.geometry,
      active: zone.active,
    });
  } catch (error) {
    console.error('Error en zones/:id:', error);
    res.status(500).json({ error: 'Error obteniendo zona' });
  }
};

/**
 * ➕ POST /api/zones
 * Crear nueva zona protegida (GeoJSON)
 */
export const create = async (req, res) => {
  try {
    const { name, description, level, geometry } = req.body;

    // Validaciones
    if (!name || !geometry) {
      return res.status(400).json({ error: 'name y geometry son requeridos' });
    }

    if (geometry.type !== 'Polygon') {
      return res.status(400).json({ error: 'geometry debe ser tipo Polygon' });
    }

    // Calcular área del polígono
    const area = calculatePolygonArea(geometry.coordinates[0]);

    // Mapeo de labels
    const levelLabels = {
      high: 'Restricción Alta',
      medium: 'Restricción Media',
      low: 'Monitoreo',
    };

    const iconMap = {
      high: 'dangerous',
      medium: 'warning',
      low: 'visibility',
    };

    const newZone = new Zone({
      name,
      description: description || '',
      level: level || 'medium',
      levelLabel: levelLabels[level] || 'Restricción Media',
      icon: iconMap[level] || 'warning',
      geometry,
      area: area.toFixed(2),
      boats: 0,
      active: true,
      createdBy: req.user?.username || 'Sistema',
    });

    const savedZone = await newZone.save();

    res.status(201).json({
      id: savedZone._id,
      name: savedZone.name,
      level: savedZone.level,
      levelLabel: savedZone.levelLabel,
      icon: savedZone.icon,
      area: savedZone.area,
      boats: savedZone.boats,
      created: savedZone.createdAt.toLocaleDateString('es-ES'),
      description: savedZone.description,
      geometry: savedZone.geometry,
      active: savedZone.active,
    });
  } catch (error) {
    console.error('Error en zones/create:', error);
    res.status(500).json({ error: 'Error creando zona' });
  }
};

/**
 * ✏️ PUT /api/zones/:id
 * Actualizar zona existente
 */
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, level, geometry, active } = req.body;

    const zone = await Zone.findById(id);
    if (!zone) {
      return res.status(404).json({ error: 'Zona no encontrada' });
    }

    // Actualizar campos
    if (name) zone.name = name;
    if (description !== undefined) zone.description = description;
    if (level) {
      zone.level = level;
      const levelLabels = {
        high: 'Restricción Alta',
        medium: 'Restricción Media',
        low: 'Monitoreo',
      };
      const iconMap = {
        high: 'dangerous',
        medium: 'warning',
        low: 'visibility',
      };
      zone.levelLabel = levelLabels[level];
      zone.icon = iconMap[level];
    }
    if (geometry) {
      zone.geometry = geometry;
      zone.area = calculatePolygonArea(geometry.coordinates[0]).toFixed(2);
    }
    if (active !== undefined) zone.active = active;

    const updatedZone = await zone.save();

    res.json({
      id: updatedZone._id,
      name: updatedZone.name,
      level: updatedZone.level,
      levelLabel: updatedZone.levelLabel,
      icon: updatedZone.icon,
      area: updatedZone.area,
      boats: updatedZone.boats,
      created: updatedZone.createdAt.toLocaleDateString('es-ES'),
      description: updatedZone.description,
      geometry: updatedZone.geometry,
      active: updatedZone.active,
    });
  } catch (error) {
    console.error('Error en zones/update:', error);
    res.status(500).json({ error: 'Error actualizando zona' });
  }
};

/**
 * 🗑️ DELETE /api/zones/:id
 * Eliminar zona
 */
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const zone = await Zone.findByIdAndDelete(id);

    if (!zone) {
      return res.status(404).json({ error: 'Zona no encontrada' });
    }

    res.json({ message: 'Zona eliminada exitosamente', id });
  } catch (error) {
    console.error('Error en zones/delete:', error);
    res.status(500).json({ error: 'Error eliminando zona' });
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
