const express = require('express');
const morgan = require('morgan');
const errorController = require('./controllers/errorController');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(morgan('tiny'));
app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use(errorController);

module.exports = app;
