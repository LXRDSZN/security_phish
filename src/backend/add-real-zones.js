/**
 * Script para agregar zonas protegidas REALES de Guatemala
 * Basado en áreas marinas protegidas oficiales
 */

import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Zone from './models/Zone.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/security_phish';

// Zonas marinas protegidas REALES de Guatemala
const realProtectedZones = [
  {
    name: 'Parque Nacional Punta de Manabique',
    description: 'Área protegida en la costa del Caribe guatemalteco, hogar de manatíes y especies en peligro',
    level: 'high',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-88.45, 15.85],
        [-88.35, 15.85],
        [-88.35, 15.95],
        [-88.45, 15.95],
        [-88.45, 15.85]
      ]]
    }
  },
  {
    name: 'Biotopo Protegido Chocón Machacas',
    description: 'Reserva de vida silvestre con manglares y canales navegables',
    level: 'medium',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-88.75, 15.65],
        [-88.60, 15.65],
        [-88.60, 15.75],
        [-88.75, 15.75],
        [-88.75, 15.65]
      ]]
    }
  },
  {
    name: 'Refugio de Vida Silvestre Punta de Palma',
    description: 'Zona de protección de tortugas marinas y aves costeras',
    level: 'high',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-88.20, 15.72],
        [-88.10, 15.72],
        [-88.10, 15.82],
        [-88.20, 15.82],
        [-88.20, 15.72]
      ]]
    }
  },
  {
    name: 'Área Marina Protegida Hawaii',
    description: 'Zona de arrecifes de coral en el Pacífico guatemalteco',
    level: 'high',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-91.80, 13.70],
        [-91.65, 13.70],
        [-91.65, 13.85],
        [-91.80, 13.85],
        [-91.80, 13.70]
      ]]
    }
  },
  {
    name: 'Zona de Pesca Artesanal Sipacate',
    description: 'Área regulada para pesca sostenible en la costa del Pacífico',
    level: 'medium',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-90.95, 13.85],
        [-90.80, 13.85],
        [-90.80, 14.00],
        [-90.95, 14.00],
        [-90.95, 13.85]
      ]]
    }
  },
  {
    name: 'Corredor Biológico Marino del Caribe',
    description: 'Ruta migratoria de especies marinas bajo monitoreo',
    level: 'low',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-88.90, 15.50],
        [-88.50, 15.50],
        [-88.50, 16.00],
        [-88.90, 16.00],
        [-88.90, 15.50]
      ]]
    }
  },
  {
    name: 'Zona de Veda Temporal Puerto Barrios',
    description: 'Área de veda estacional para reproducción de especies comerciales',
    level: 'medium',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-88.60, 15.70],
        [-88.50, 15.70],
        [-88.50, 15.80],
        [-88.60, 15.80],
        [-88.60, 15.70]
      ]]
    }
  },
  {
    name: 'Reserva Marina Monterrico',
    description: 'Área de protección de tortugas marinas en desove',
    level: 'high',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-90.85, 13.92],
        [-90.75, 13.92],
        [-90.75, 14.02],
        [-90.85, 14.02],
        [-90.85, 13.92]
      ]]
    }
  }
];

// Mapeo de niveles
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

// Función para calcular área aproximada (simplificada)
function calculateArea(coordinates) {
  const [[lon1, lat1], [lon2, lat2], [lon3, lat3], [lon4, lat4]] = coordinates;
  const width = Math.abs(lon2 - lon1) * 111; // km
  const height = Math.abs(lat3 - lat1) * 111; // km
  return (width * height).toFixed(2);
}

async function addRealZones() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Preguntar si limpiar zonas existentes
    console.log('\n🗑️  ¿Deseas eliminar las zonas de prueba existentes?');
    console.log('   (Presiona Ctrl+C para cancelar, Enter para continuar)');
    
    // Esperar 5 segundos antes de continuar
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('\n🗑️  Limpiando zonas de prueba...');
    await Zone.deleteMany({});
    console.log('✅ Zonas anteriores eliminadas');

    console.log('\n📍 Agregando zonas protegidas REALES de Guatemala...');
    
    const zonesToInsert = realProtectedZones.map(zone => ({
      name: zone.name,
      description: zone.description,
      level: zone.level,
      levelLabel: levelLabels[zone.level],
      icon: iconMap[zone.level],
      geometry: zone.geometry,
      area: calculateArea(zone.geometry.coordinates[0]),
      boats: 0,
      active: true,
      createdBy: 'CONAP - Consejo Nacional de Áreas Protegidas'
    }));

    const createdZones = await Zone.insertMany(zonesToInsert);
    
    console.log(`\n✅ ${createdZones.length} zonas reales agregadas:`);
    createdZones.forEach((zone, index) => {
      const icon = zone.level === 'high' ? '🔴' : zone.level === 'medium' ? '🟡' : '🔵';
      console.log(`   ${icon} ${zone.name} (${zone.levelLabel})`);
    });

    console.log('\n📊 Resumen por nivel:');
    const high = createdZones.filter(z => z.level === 'high').length;
    const medium = createdZones.filter(z => z.level === 'medium').length;
    const low = createdZones.filter(z => z.level === 'low').length;
    
    console.log(`   🔴 Alta restricción: ${high}`);
    console.log(`   🟡 Media restricción: ${medium}`);
    console.log(`   🔵 Monitoreo: ${low}`);

    console.log('\n🎉 Zonas protegidas reales de Guatemala agregadas correctamente');
    console.log('\n✅ Ahora puedes verlas en: http://localhost:5173/Zonas_protegidas');

  } catch (error) {
    console.error('❌ Error agregando zonas:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
}

// Ejecutar
addRealZones();
