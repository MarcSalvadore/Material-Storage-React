require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');

const app = express();
const port = process.env.PORT || 3000;
const localhost = '10.97.109.199';

// Middleware
app.use(bodyParser.json());
app.use(cors());

// PostgreSQL client setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const container = process.env.AZURE_CONTAINER;
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_CONNECTION_STRING;
// Create the BlobServiceClient object with connection string
const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
// try {

//   if (!AZURE_STORAGE_CONNECTION_STRING) {
//     throw Error('Azure Storage Connection string not found');
//   }

//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
// }

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

// Material Attachment for images
app.get('/api/material-attachment', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pms.c0_04_04_epc_material_storage_attachments_db');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
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

const upload = multer({ storage: multer.memoryStorage() });
// Route to upload a file
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    console.log(req)
    const { material_storage_id, originalname, file } = req.body;
    const blobName = originalname;
    const containerClient = blobServiceClient.getContainerClient(container)
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    // const blockBlobClient = blobServiceClient.getBlockBlobClient(blobName);

    // Upload file to Azure Blob Storage
    await blockBlobClient.upload(file, file.length);

    // Get file URL
    const fileUrl = blockBlobClient.url;

    // Save file URL to PostgreSQL
    const query = 'INSERT INTO pms.c0_04_04_epc_material_storage_attachments_db (material_storage_id, attachment_name, attachment_url) VALUES ($1, $2, $3) RETURNING *';
    const values = [material_storage_id, originalname, fileUrl];

    const result = await pool.query(query, values);
    res.json(result.rows[0]); // Return the inserted row
  } catch (err) {
    console.error('Error uploading file:', err.message,);
    console.log('Error uploading file:', err.message)
    res.status(500).send('Server error');
  }
});

// app.listen(port, () => {
//   console.log(`Server is running on http://${localhost}:${port}`);
// });

app.listen(port, () => {
  console.log(`Server is running on https://tp-phr.azurewebsites.net`);
});

