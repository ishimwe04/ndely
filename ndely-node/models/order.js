const Joi = require("joi");
const mongoose = require("mongoose");
const { productSchema } = require("./product");

const orderSchema = new mongoose.Schema({
  email: {
    type: String,
     required: true
      },
  phone: {
    type: String,
        required: true,
      },
  product: {
    type: productSchema,
    required: true,
  },
  address: {
    type: String,
    required: true
  },
  message:{
    type: String,
    required: true
  },
  date:{
    type:Date,
    default:Date.now(),
    required:true
  }
});

const Order = mongoose.model("Order", orderSchema);

function validateOrder(order) {
  const schema = {
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    productId: Joi.string().required(),
    address: Joi.string().required(),
    message: Joi.string().required(),
  };

  return Joi.validate(order, schema);
}

exports.Order = Order;
exports.validate = validateOrder;
