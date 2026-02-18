// Script para inicializar datos de prueba en MongoDB
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Zone from './models/Zone.js';
import Alert from './models/Alert.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/security_phish';

async function initializeTestData() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar datos anteriores (opcional)
    console.log('🗑️  Limpiando datos anteriores...');
    await Zone.deleteMany({});
    await Alert.deleteMany({});

    // Crear zonas de prueba
    console.log('📍 Creando zonas de prueba...');
    const zones = [
      {
        name: 'Zona Protegida Norte',
        description: 'Zona de reproducción de especies protegidas',
        level: 'high',
        levelLabel: 'Restricción Alta',
        icon: 'dangerous',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-90.5, 15.2],
            [-90.3, 15.2],
            [-90.3, 15.4],
            [-90.5, 15.4],
            [-90.5, 15.2]
          ]]
        },
        area: 125.34,
        boats: 0,
        active: true,
        createdBy: 'Sistema'
      },
      {
        name: 'Reserva Marina Este',
        description: 'Zona de pesca regulada',
        level: 'medium',
        levelLabel: 'Restricción Media',
        icon: 'warning',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-89.5, 14.5],
            [-89.2, 14.5],
            [-89.2, 14.8],
            [-89.5, 14.8],
            [-89.5, 14.5]
          ]]
        },
        area: 88.50,
        boats: 2,
        active: true,
        createdBy: 'Sistema'
      },
      {
        name: 'Área de Conservación Sur',
        description: 'Zona bajo monitoreo constante',
        level: 'low',
        levelLabel: 'Monitoreo',
        icon: 'visibility',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-91.0, 13.5],
            [-90.5, 13.5],
            [-90.5, 14.0],
            [-91.0, 14.0],
            [-91.0, 13.5]
          ]]
        },
        area: 200.00,
        boats: 8,
        active: true,
        createdBy: 'Sistema'
      }
    ];

    const createdZones = await Zone.insertMany(zones);
    console.log(`✅ ${createdZones.length} zonas creadas`);

    // Crear alertas de prueba
    console.log('🚨 Creando alertas de prueba...');
    const alerts = [
      {
        priority: 'high',
        type: 'zone_violation',
        title: 'Embarcación en Zona Prohibida',
        description: 'Embarcación detectada en zona protegida norte sin autorización',
        vesselId: 'TEST-001',
        vesselName: 'Embarcación de Prueba 1',
        location: 'Zona Protegida Norte',
        coordinates: { lat: 15.3, lon: -90.4 },
        zoneId: createdZones[0]._id,
        zoneName: createdZones[0].name,
        status: 'active',
        metadata: { timestamp: new Date() }
      },
      {
        priority: 'medium',
        type: 'prolonged_stay',
        title: 'Permanencia Prolongada Detectada',
        description: 'Embarcación ha permanecido por tiempo prolongado en zona regulada',
        vesselId: 'TEST-002',
        vesselName: 'Embarcación de Prueba 2',
        location: 'Reserva Marina Este',
        coordinates: { lat: 14.6, lon: -89.3 },
        zoneId: createdZones[1]._id,
        zoneName: createdZones[1].name,
        status: 'active'
      },
      {
        priority: 'low',
        type: 'no_report',
        title: 'Embarcación Sin Reporte',
        description: 'No se ha recibido reporte en las últimas 24 horas',
        vesselId: 'TEST-003',
        vesselName: 'Embarcación de Prueba 3',
        location: 'Área de Conservación Sur',
        status: 'active'
      }
    ];

    const createdAlerts = await Alert.insertMany(alerts);
    console.log(`✅ ${createdAlerts.length} alertas creadas`);

    console.log('\n🎉 Datos de prueba inicializados correctamente');
    console.log('\n📊 Resumen:');
    console.log(`   - Zonas: ${createdZones.length}`);
    console.log(`   - Alertas: ${createdAlerts.length}`);
    console.log('\n✅ Ahora puedes probar los endpoints del Dashboard');

  } catch (error) {
    console.error('❌ Error inicializando datos:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar
initializeTestData();
