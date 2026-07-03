const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

// GET /api/savings-goals
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM savings_goals ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch savings goals' });
  }
});

// POST /api/savings-goals
router.post('/', async (req, res) => {
  try {
    const { name, target_amount, current_amount, target_date } = req.body;
    if (!name || !target_amount || Number(target_amount) <= 0) {
      return res.status(400).json({ error: 'name and a positive target_amount are required' });
    }
    const { rows } = await pool.query(
      `INSERT INTO savings_goals (name, target_amount, current_amount, target_date)
       VALUES ($1, $2, COALESCE($3, 0), $4) RETURNING *`,
      [name, target_amount, current_amount, target_date || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create savings goal' });
  }
});

// PUT /api/savings-goals/:id  (edit goal or update progress)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, target_amount, current_amount, target_date } = req.body;
    const { rowCount, rows } = await pool.query(
      `UPDATE savings_goals
       SET name = COALESCE($1, name),
           target_amount = COALESCE($2, target_amount),
           current_amount = COALESCE($3, current_amount),
           target_date = COALESCE($4, target_date)
       WHERE id = $5
       RETURNING *`,
      [name, target_amount, current_amount, target_date, id]
    );
    if (!rowCount) return res.status(404).json({ error: 'Savings goal not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update savings goal' });
  }
});

// DELETE /api/savings-goals/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM savings_goals WHERE id = $1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'Savings goal not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete savings goal' });
  }
});

module.exports = router;
