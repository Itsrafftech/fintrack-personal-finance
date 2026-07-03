const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const params = [];
    let query = 'SELECT * FROM categories';
    if (type) {
      params.push(type);
      query += ' WHERE type = $1';
    }
    query += ' ORDER BY name ASC';
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST /api/categories
router.post('/', async (req, res) => {
  try {
    const { name, type, color } = req.body;
    if (!name || !type) {
      return res.status(400).json({ error: 'name and type are required' });
    }
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'type must be income or expense' });
    }
    const { rows } = await pool.query(
      'INSERT INTO categories (name, type, color) VALUES ($1, $2, COALESCE($3, \'#6366f1\')) RETURNING *',
      [name, type, color]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Category already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM categories WHERE id = $1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'Category not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
