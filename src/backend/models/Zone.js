import mongoose from 'mongoose';

const ZoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    level: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
      required: true,
    },
    levelLabel: {
      type: String,
      default: 'Restricción Media',
    },
    icon: {
      type: String,
      default: 'warning',
    },
    // GeoJSON Polygon
    geometry: {
      type: {
        type: String,
        enum: ['Polygon'],
        required: true,
      },
      coordinates: {
        type: [[[Number]]], // Array de arrays de [lon, lat]
        required: true,
      },
    },
    area: {
      type: Number, // Área en km²
      default: 0,
    },
    boats: {
      type: Number, // Contador de embarcaciones detectadas
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      default: 'Sistema',
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt
  }
);

// Índice geoespacial para consultas eficientes
ZoneSchema.index({ geometry: '2dsphere' });

const Zone = mongoose.model('Zone', ZoneSchema);

export default Zone;
