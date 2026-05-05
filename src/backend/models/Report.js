import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['alerts', 'vessels', 'zones', 'compliance', 'summary'],
    required: true
  },
  period: {
    type: String,
    enum: ['day', 'week', 'month', 'year', 'custom'],
    required: true
  },
  dateRange: {
    start: Date,
    end: Date
  },
  format: {
    type: String,
    enum: ['pdf', 'excel', 'csv', 'json'],
    default: 'pdf'
  },
  data: {
    type: mongoose.Schema.Types.Mixed
  },
  generatedBy: {
    type: String,
    default: 'Sistema'
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  fileSize: String,
  status: {
    type: String,
    enum: ['generating', 'completed', 'error'],
    default: 'completed'
  }
}, {
  timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
