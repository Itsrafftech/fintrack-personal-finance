const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

// GET /api/summary?month=2026-07  -> totals for dashboard cards
router.get('/', async (req, res) => {
  try {
    const { month } = req.query;
    const params = [];
    let where = '';
    if (month) {
      params.push(month);
      where = `WHERE to_char(transaction_date, 'YYYY-MM') = $1`;
    }

    const { rows } = await pool.query(
      `SELECT
         COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0) AS total_income,
         COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0) AS total_expense
       FROM transactions
       ${where}`,
      params
    );

    const totalIncome = Number(rows[0].total_income);
    const totalExpense = Number(rows[0].total_expense);

    res.json({
      total_income: totalIncome,
      total_expense: totalExpense,
      balance: totalIncome - totalExpense,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// GET /api/summary/by-category?month=2026-07&type=expense -> pie chart data
router.get('/by-category', async (req, res) => {
  try {
    const { month, type } = req.query;
    const params = [];
    const conditions = [];

    if (month) {
      params.push(month);
      conditions.push(`to_char(t.transaction_date, 'YYYY-MM') = $${params.length}`);
    }
    params.push(type || 'expense');
    conditions.push(`t.type = $${params.length}`);

    const { rows } = await pool.query(
      `SELECT c.id AS category_id, c.name AS category_name, c.color AS category_color,
              SUM(t.amount) AS total
       FROM transactions t
       LEFT JOIN categories c ON c.id = t.category_id
       WHERE ${conditions.join(' AND ')}
       GROUP BY c.id, c.name, c.color
       ORDER BY total DESC`,
      params
    );

    res.json(rows.map((r) => ({ ...r, total: Number(r.total) })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch category summary' });
  }
});

// GET /api/summary/monthly?year=2026 -> line chart data (income vs expense per month)
router.get('/monthly', async (req, res) => {
  try {
    const { year } = req.query;
    const targetYear = year || new Date().getFullYear();

    const { rows } = await pool.query(
      `SELECT to_char(transaction_date, 'YYYY-MM') AS month,
              COALESCE(SUM(amount) FILTER (WHERE type = 'income'), 0) AS income,
              COALESCE(SUM(amount) FILTER (WHERE type = 'expense'), 0) AS expense
       FROM transactions
       WHERE extract(year FROM transaction_date) = $1
       GROUP BY month
       ORDER BY month ASC`,
      [targetYear]
    );

    res.json(
      rows.map((r) => ({
        month: r.month,
        income: Number(r.income),
        expense: Number(r.expense),
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch monthly summary' });
  }
});

module.exports = router;
