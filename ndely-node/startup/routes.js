const express = require("express");
const bodyParser = require("body-parser");
const products = require("../routes/products");
const appointments = require("../routes/appointments");
const orders = require("../routes/orders");
const categories = require("../routes/categories");
const users = require("../routes/users");
const blogs = require("../routes/blogs");
const auth = require("../routes/auth");
const error = require("../middleware/error");

module.exports = function(app) {
  app.use("/uploads", express.static("uploads"));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use("/api/products", products);
  app.use("/api/appointments", appointments);
  app.use("/api/orders", orders);
  app.use("/api/categories", categories);
  app.use("/api/users", users);
  app.use("/api/blogs", blogs);
  app.use("/api/auth", auth);
  app.use(error);
};
