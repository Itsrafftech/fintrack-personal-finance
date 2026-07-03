require('dotenv').config();
const express = require('express');
const cors = require('cors');

const transactionsRouter = require('./routes/transactions');
const categoriesRouter = require('./routes/categories');
const savingsGoalsRouter = require('./routes/savingsGoals');
const summaryRouter = require('./routes/summary');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*'
}));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/transactions', transactionsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/savings-goals', savingsGoalsRouter);
app.use('/api/summary', summaryRouter);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, () => {
  console.log(`FinTrack API running on http://localhost:${PORT}`);
});
