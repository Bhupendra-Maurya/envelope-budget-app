import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = 'http://localhost:4000';

function App() {
  const [income, setIncome] = useState(0);
  const [incomeInput, setIncomeInput] = useState('');
  const [envelopes, setEnvelopes] = useState([]);
  const [newEnvelopeName, setNewEnvelopeName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedEnvelope, setSelectedEnvelope] = useState(null);
  const [spendAmount, setSpendAmount] = useState({});

  const fetchData = async () => {
    const incomeRes = await axios.get(`${API_BASE}/income`);
    const envelopeRes = await axios.get(`${API_BASE}/envelopes`);
    setIncome(incomeRes.data.total);
    setEnvelopes(envelopeRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addIncome = async () => {
    await axios.post(`${API_BASE}/income`, { amount: parseInt(incomeInput) });
    setIncomeInput('');
    fetchData();
  };

  const createEnvelope = async () => {
    await axios.post(`${API_BASE}/envelopes`, { name: newEnvelopeName });
    setNewEnvelopeName('');
    fetchData();
  };

  const moveIncome = async () => {
    if (!selectedEnvelope) return;
    await axios.post(`${API_BASE}/envelopes/${selectedEnvelope}/add`, {
      amount: parseInt(amount),
    });
    setAmount('');
    setSelectedEnvelope(null);
    fetchData();
  };

  const spendFromEnvelope = async (id) => {
    const amount = spendAmount[id];
    if (!amount) return;
  
    await axios.post(`${API_BASE}/envelopes/${id}/spend`, {
      amount: parseInt(amount),
    });
  
    setSpendAmount({ ...spendAmount, [id]: '' }); 
    fetchData();
  };
  

  return (
    <div className="app">
      <h1>💸 Envelope Budgeting App</h1>

      <div className="card">
        <h2>Total Income: ₹{income}</h2>
        <div className="input-group">
          <input
            type="number"
            placeholder="Enter income amount"
            value={incomeInput}
            onChange={(e) => setIncomeInput(e.target.value)}
          />
          <button onClick={addIncome}>Add Income</button>
        </div>
      </div>

      <div className="card">
        <h2>Create Envelope</h2>
        <div className="input-group">
          <input
            placeholder="Envelope name"
            type='text'
            value={newEnvelopeName}
            onChange={(e) => setNewEnvelopeName(e.target.value)}
          />
          <button onClick={createEnvelope}>Create</button>
        </div>
      </div>

      <div className="card">
        <h2>Move Income to Envelope</h2>
        <div className="input-group">
          <select onChange={(e) => setSelectedEnvelope(e.target.value)} defaultValue="">
            <option value="">Select Envelope</option>
            {envelopes.map((env) => (
              <option key={env._id} value={env._id}>
                {env.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={moveIncome}>Move</button>
        </div>
      </div>

      <div className="card">
        <h2>📦 Envelopes</h2>
        <ul className="envelope-list">
          {envelopes.map((env) => (
            <li key={env._id} className="envelope-item">
              <div>
                <strong>{env.name}</strong>: ₹{env.balance}
              </div>
              <div className="input-group">
                <input
                  type="number"
                  placeholder="Spend amount"
                  value={spendAmount[env._id] || ''}
                  onChange={(e) =>
                    setSpendAmount({ ...spendAmount, [env._id]: e.target.value })
                  }
                />
                <button onClick={() => spendFromEnvelope(env._id)}>Spend</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
