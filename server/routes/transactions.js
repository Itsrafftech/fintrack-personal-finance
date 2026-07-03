const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

const BASE_SELECT = `
  SELECT t.id, t.type, t.amount, t.description, t.transaction_date, t.created_at,
         c.id AS category_id, c.name AS category_name, c.color AS category_color
  FROM transactions t
  LEFT JOIN categories c ON c.id = t.category_id
`;

// GET /api/transactions?month=2026-07&category=3&type=expense
router.get('/', async (req, res) => {
  try {
    const { month, category, type } = req.query;
    const conditions = [];
    const params = [];

    if (month) {
      params.push(month);
      conditions.push(`to_char(t.transaction_date, 'YYYY-MM') = $${params.length}`);
    }
    if (category) {
      params.push(category);
      conditions.push(`t.category_id = $${params.length}`);
    }
    if (type) {
      params.push(type);
      conditions.push(`t.type = $${params.length}`);
    }

    let query = BASE_SELECT;
    if (conditions.length) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    query += ' ORDER BY t.transaction_date DESC, t.id DESC';

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// POST /api/transactions
router.post('/', async (req, res) => {
  try {
    const { type, amount, category_id, description, transaction_date } = req.body;

    if (!type || !['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'type must be income or expense' });
    }
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'amount must be a positive number' });
    }

    const { rows } = await pool.query(
      `INSERT INTO transactions (type, amount, category_id, description, transaction_date)
       VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE))
       RETURNING id`,
      [type, amount, category_id || null, description || null, transaction_date || null]
    );

    const { rows: full } = await pool.query(`${BASE_SELECT} WHERE t.id = $1`, [rows[0].id]);
    res.status(201).json(full[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// PUT /api/transactions/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, category_id, description, transaction_date } = req.body;

    const { rowCount } = await pool.query(
      `UPDATE transactions
       SET type = COALESCE($1, type),
           amount = COALESCE($2, amount),
           category_id = $3,
           description = COALESCE($4, description),
           transaction_date = COALESCE($5, transaction_date)
       WHERE id = $6`,
      [type, amount, category_id || null, description, transaction_date, id]
    );

    if (!rowCount) return res.status(404).json({ error: 'Transaction not found' });

    const { rows: full } = await pool.query(`${BASE_SELECT} WHERE t.id = $1`, [id]);
    res.json(full[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'Transaction not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

module.exports = router;
