import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import Income from '../models/Income.js';
import Envelope from '../models/Envelope.js';

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/budget-app';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ---------------- Routes ----------------

// Get all envelopes
app.get('/envelopes', async (req, res) => {
  const envelopes = await Envelope.find();
  res.json(envelopes);
});

// Add income
app.post('/income', async (req, res) => {
  const { amount } = req.body;
  const income = await Income.create({ amount });
  res.json(income);
});

// Create a new envelope
app.post('/envelopes', async (req, res) => {
    const { name, balance } = req.body;
    const envelope = await Envelope.create({
      name,
      balance: balance || 0
    });
    res.json(envelope);
  });
  

// Get total income
app.get('/income', async (req, res) => {
  const incomes = await Income.find();
  const total = incomes.reduce((sum, item) => sum + item.amount, 0);
  res.json({ total });
});

// Move income to envelope
app.post('/envelopes/:id/add', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const envelope = await Envelope.findById(id);
  if (!envelope) return res.status(404).json({ error: 'Envelope not found' });

  envelope.balance += amount;
  await envelope.save();

  await Income.create({ amount: -amount });

  res.json({ success: true });
});

// Spend from envelope
app.post('/envelopes/:id/spend', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const envelope = await Envelope.findById(id);
  if (!envelope) return res.status(404).json({ error: 'Envelope not found' });

  envelope.balance -= amount;
  await envelope.save();

  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));