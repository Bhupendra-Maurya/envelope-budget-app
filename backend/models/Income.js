import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Income', incomeSchema);
