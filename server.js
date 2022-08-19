const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    dbName: 'prime-marketplace',
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;

app.listen(port, () => {});
