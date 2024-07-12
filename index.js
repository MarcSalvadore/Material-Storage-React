const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;
const localhost = '10.97.109.186';

// Middleware
app.use(bodyParser.json());
app.use(cors());

// PostgreSQL client setup
const pool = new Pool({
  user: process.env.DB_USER || 'tapdatalakeprod@tapdatalake-prod',
  host: process.env.DB_HOST || 'tapdatalake-prod.postgres.database.azure.com',
  database: process.env.DB_NAME || 'tapdatalake',
  password: process.env.DB_PASSWORD || 'JendSudirm@n2024',
  port: process.env.DB_PORT || 5432,
});

// Material Storage
app.get('/api/material-storage', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pms.c0_04_03_epc_material_storage_db');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Route to handle POST request for inserting into material_storage table
app.post('/api/material-storage', async (req, res) => {
  const {
    projectName,
    mrrNo,
    materialId,
    locationArea,
    newOrExcess,
    locationId,
    outdoorIndoor,
    createdBy,
    createdOn,
    updatedBy,
    updatedOn,
    status,
  } = req.body;

  try {
    const query = `
      INSERT INTO pms.c0_04_03_epc_material_storage_db (project_name, mrr_no, material_id, location_area, new_or_excess, location_id, outdoor_indoor, created_by, created_on, updated_by, updated_on, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
    const values = [
      projectName,
      mrrNo,
      materialId,
      locationArea,
      newOrExcess,
      locationId,
      outdoorIndoor,
      createdBy,
      createdOn,
      updatedBy,
      updatedOn,
      status,
    ];

    const result = await pool.query(query, values);
    res.json(result.rows[0]); // Return the inserted row
  } catch (err) {
    console.error('Error inserting data:', err.message);
    res.status(500).send('Server error');
  }
});

// Material Storage
app.get('/api/material-attachment', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pms.c0_04_04_epc_material_storage_attachments_db');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://${localhost}:${port}`);
});

