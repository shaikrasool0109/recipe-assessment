const express = require('express');
const router = express.Router();
const { pool } = require('../db');

function parseComparatorParam(param) {
  if (!param) return null;
  param = param.trim();
  const m = param.match(/^([<>]=?|=)?\s*(\d+(?:\.\d+)?)$/);
  if (!m) return null;
  return { op: m[1] || '=', value: Number(m[2]) };
}

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;

    const totalRes = await pool.query('SELECT count(*) FROM recipes');
    const total = Number(totalRes.rows[0].count);

    const q = `SELECT id, cuisine, title, rating, prep_time, cook_time, total_time, description, nutrients, serves
             FROM recipes
             ORDER BY rating DESC NULLS LAST
             LIMIT $1 OFFSET $2`;
    const dataRes = await pool.query(q, [limit, offset]);

    res.json({ page, limit, total, data: dataRes.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { calories, title, cuisine, total_time, rating } = req.query;
    const where = [];
    const params = [];

    if (title) {
      params.push(`%${title}%`);
      where.push(`title ILIKE $${params.length}`);
    }

    if (cuisine) {
      params.push(cuisine);
      where.push(`cuisine = $${params.length}`);
    }

    if (rating) {
      const p = parseComparatorParam(rating);
      if (!p) return res.status(400).json({ error: 'Invalid rating filter' });
      params.push(p.value);
      where.push(`rating ${p.op} $${params.length}`);
    }

    if (total_time) {
      const p = parseComparatorParam(total_time);
      if (!p) return res.status(400).json({ error: 'Invalid total_time filter' });
      params.push(p.value);
      where.push(`total_time ${p.op} $${params.length}`);
    }

    if (calories) {
      const p = parseComparatorParam(calories);
      if (!p) return res.status(400).json({ error: 'Invalid calories filter' });
      params.push(p.value);
      where.push(`NULLIF(regexp_replace(nutrients->>'calories','[^0-9]','','g'),'')::int ${p.op} $${params.length}`);
    }

    let sql = `SELECT id, cuisine, title, rating, prep_time, cook_time, total_time, description, nutrients, serves FROM recipes`;
    if (where.length) sql += ' WHERE ' + where.join(' AND ');

    sql += ' ORDER BY rating DESC NULLS LAST LIMIT 500';

    const results = await pool.query(sql, params);
    return res.json({ data: results.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
