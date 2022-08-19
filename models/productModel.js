const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  image: {
    type: String,
    required: [true, 'Image is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  quantity: {
    type: Number,
    required: [true, 'Inventory is required'],
  },
  manufacturer: {
    type: String,
  },
});

module.exports = mongoose.model('Product', productSchema);
