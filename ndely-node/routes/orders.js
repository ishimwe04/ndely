const { Order, validate } = require("../models/order");
const { Product } = require("../models/product");
const { User } = require("../models/user");
const auth = require("../middleware/auth");
const admin= require('../middleware/admin');
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", [auth,admin], async (req, res) => {
  const orders = await Order.find().select("-__v");
  res.send(orders);
});
router.get("/mine", auth, async (req, res) => {
    const user = await User.find({ user: req.user._id });
    
  });

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
console.log(req.body)
  const product = await Product.findById(req.body.productId);
  if (!product) return res.status(400).send("Invalid Product.");

  let order = new Order({
   email: req.body.email,
   phone: req.body.phone,
    product: {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      category: product.category,
      price: product.price,
      featured:product.featured,
      description:product.description,
      extras: product.extras,
      images:product.images,
    },
    message: req.body.message,
    address: req.body.address,
  });

  order = await order.save();
  res.send(order);
});

router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const product = await Product.findById(req.body.productId);
  if (!product) return res.status(400).send("Invalid Product.");

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
        email: req.body.email,
        phone: req.body.phone,
         product: {
           _id: product._id,
           name: product.name,
           slug: product.slug,
           category: product.category,
           price: product.price,
           featured:product.featured,
           description:product.description,
           extras: product.extras,
           images:product.images,
         },
         message: req.body.message,
         address: req.body.address,
        },
    { new: true }
  );

  if (!order)
    return res
      .status(404)
      .send("The order with the given ID was not found.");

  res.send(order);
});

router.get("/:id", [auth,admin], async (req, res) => {
  const order = await Order.findById(req.params.id).select("-__v");

  if (!order)
    return res
      .status(404)
      .send("The order with the given ID was not found.");

  res.send(order);
});

router.delete("/:id", [auth,admin], async (req, res) => {
  const order = await Order.findByIdAndRemove(req.params.id);

  if (!order)
    return res
      .status(404)
      .send("The Order with the given ID was not found.");

  res.send(order);
});

module.exports = router;
