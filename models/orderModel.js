const moongose = require('mongoose');

const SingleItemSchema = new moongose.Schema({
  product: {
    type: moongose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  imageCover: {
    type: String,
    required: true,
  },
});

const OrderSchema = new moongose.Schema(
  {
    user: {
      type: moongose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    oderItems: [SingleItemSchema],
    total: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    shippingMethod: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
    paymentToken: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = moongose.model('Order', OrderSchema);
