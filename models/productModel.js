const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name can not be more than 100 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    default: 0,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description can not be more than 1000 characters'],
  },
  imageCover: {
    type: String,
    required: [true, 'imageCover is required'],
  },
  images: [String],
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['office', 'kitchen', 'drugs'],
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
    required: [true, 'quantity is required'],
  },
  manufacturer: {
    type: String,
  },
});

module.exports = mongoose.model('Product', productSchema);
