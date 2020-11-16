const mongoose = require("mongoose");
const moment = require("moment");
const Joi = require("joi");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  images: {
    type: String,
    required: true,
  },
});

const Blog = mongoose.model("Blog", blogSchema);

function validateBlog(blog) {
  const schema = {
    title: Joi.string().required(),
    content: Joi.string().required(),
  };

  return Joi.validate(blog, schema);
}

exports.validate = validateBlog;
exports.Blog = Blog;
