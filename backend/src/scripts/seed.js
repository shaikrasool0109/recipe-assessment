const fs = require('fs');
const path = require('path');
const { pool } = require('../db');
require('dotenv').config();

function toNullIfNaNNumber(v) {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  if (Number.isNaN(n)) return null;
  return n;
}

async function seed() {
  try {
    const dataPath = path.join(__dirname, '..', '..', '..', 'data', 'US_recipes.json');
    if (!fs.existsSync(dataPath)) {
      console.error('Data file not found at', dataPath);
      process.exit(1);
    }
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const json = JSON.parse(raw);

    const recipes = Array.isArray(json) ? json : Object.values(json);

    for (const r of recipes) {
      const cuisine = r.cuisine || null;
      const title = r.title || null;
      const rating = toNullIfNaNNumber(r.rating);
      const prep_time = toNullIfNaNNumber(r.prep_time);
      const cook_time = toNullIfNaNNumber(r.cook_time);
      const total_time = toNullIfNaNNumber(r.total_time);
      const description = r.description || null;
      const nutrients = r.nutrients || null;
      const serves = r.serves || null;

      const insertQuery = `INSERT INTO recipes (cuisine, title, rating, prep_time, cook_time, total_time, description, nutrients, serves)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
      await pool.query(insertQuery, [cuisine, title, rating, prep_time, cook_time, total_time, description, nutrients, serves]);
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error', err);
    process.exit(1);
  }
}

seed();
