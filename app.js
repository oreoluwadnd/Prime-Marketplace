const express = require('express');
const morgan = require('morgan');
const errorController = require('./controllers/errorController');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const orderRouter = require('./routes/orderRoutes');

const app = express();
app.use(morgan('tiny'));
app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/orders', orderRouter);
app.use(errorController);

module.exports = app;
