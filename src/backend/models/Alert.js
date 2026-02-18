import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema(
  {
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      required: true,
      default: 'medium',
    },
    type: {
      type: String,
      enum: [
        'zone_violation',      // Entrada a zona prohibida
        'prolonged_stay',      // Permanencia sospechosa
        'quota_exceeded',      // Cuota excedida (simulado)
        'speed_violation',     // Velocidad excesiva
        'no_report',           // Sin reporte en 24h
        'system',              // Alerta del sistema
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    vesselId: {
      type: String, // MMSI o vessel ID de GFW
    },
    vesselName: {
      type: String,
    },
    location: {
      type: String, // Descripción de la ubicación
    },
    coordinates: {
      lat: Number,
      lon: Number,
    },
    zoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Zone',
    },
    zoneName: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'dismissed'],
      default: 'active',
    },
    resolvedAt: {
      type: Date,
    },
    resolvedBy: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed, // Datos adicionales
    },
  },
  {
    timestamps: true,
  }
);

// Índices para consultas eficientes
AlertSchema.index({ priority: 1, status: 1 });
AlertSchema.index({ vesselId: 1 });
AlertSchema.index({ createdAt: -1 });

const Alert = mongoose.model('Alert', AlertSchema);

export default Alert;
