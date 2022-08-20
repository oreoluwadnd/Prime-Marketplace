const express = require('express');
const morgan = require('morgan');
const productRouter = require('./routes/productRoutes');

const app = express();
app.use(morgan('tiny'));
app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/products', productRouter);

module.exports = app;
