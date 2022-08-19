const express = require('express');
const productRouter = require('./routes/productRoutes');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/products', productRouter);

module.exports = app;
