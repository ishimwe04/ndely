const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

function validateCategory(category) {
  const schema = {
    name: Joi.string().required(),
  };

  return Joi.validate(category, schema);
}

exports.categorySchema = categorySchema;
exports.validate = validateCategory;
exports.Category = Category;
