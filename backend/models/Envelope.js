import mongoose from 'mongoose';

const envelopeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('Envelope', envelopeSchema);
