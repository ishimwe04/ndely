const Joi = require("joi");
const mongoose = require("mongoose");
const { categorySchema } = require("./category");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  category: {
    type: categorySchema,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
  extras: {
    type: String,
  },
  images: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

function validateProduct(product) {
  const schema = {
    name: Joi.string().required(),
    categoryId: Joi.objectId().required(),
    price: Joi.number().required(),
    featured: Joi.boolean(),
    description: Joi.string().required(),
    extras: Joi.string(),
  };

  return Joi.validate(product, schema);
}

exports.Product = Product;
exports.validate = validateProduct;
exports.productSchema = productSchema;
