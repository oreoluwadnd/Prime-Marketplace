const Product = require('../models/productModel');

exports.getProducts = async (req, res, next) => {
  const product = await Product.find();
  res.status(200).json({
    result: 'success',
    data: {
      product,
    },
  });
};

exports.createProduct = async (req, res, next) => {
  const {
    name,
    price,
    image,
    quantity,
    manufacturer,
    description,
    category,
    code,
  } = req.body;
  const product = await Product.create({
    code,
    name,
    price,
    image,
    quantity,
    manufacturer,
    description,
    category,
  });
  res.status(201).json({
    result: 'success',
    data: {
      product,
    },
  });
};

exports.getProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404).json({
      result: 'fail',
      message: 'No product with that ID',
    });
  }
  res.status(200).json({
    result: 'success',
    data: {
      product,
    },
  });
};

exports.updateProduct = async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    res.status(404).json({
      result: 'fail',
      message: 'No product with that Id',
    });
  }
  res.status(200).json({
    result: 'success',
    data: {
      product,
    },
  });
};
exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404).json({
      result: 'fail',
      message: 'No product with that Id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: null,
  });
};
