const sharp = require('sharp');
const multer = require('multer');
const Product = require('../models/productModel');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};
const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadProductImages = uploadPhoto.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);
exports.resizeProductImages = async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  //Cover Image
  req.body.imageCover = `${req.body.name}-${
    req.body.code
  }-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/products/${req.body.imageCover}`);

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `${req.body.name}-${req.body.code}-${Date.now()}-${
        i + 1
      }.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${filename}`);
      req.body.images.push(filename);
    })
  );
  next();
};

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
  console.log(req.body);
  const {
    name,
    price,
    quantity,
    manufacturer,
    description,
    category,
    code,
    imageCover,
    images,
  } = req.body;
  const product = await Product.create({
    code,
    name,
    price,
    quantity,
    manufacturer,
    description,
    category,
    images,
    imageCover,
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
