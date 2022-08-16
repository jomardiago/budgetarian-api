require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const productsRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/liveness', (_, res) => {
  res.send('budgetarian-api is healthy...');
});

app.use('/api/v1/products', productsRoutes);

app.listen(PORT, () => {
  console.log('express server listening on port', PORT);

  mongoose.connect(process.env.MONGODB_URL, () => {
    console.log('database connection established...');
  });
});
