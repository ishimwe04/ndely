const { Product, validate } = require("../models/product");
const { Category } = require("../models/category");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

function createSlug(s) {
  const timeStamp = Date.now().toString();
  return `${timeStamp}-${s}`;
}

const upload = multer({ storage: storage }).single("images");

router.get("/", async (req, res) => {
  const products = await Product.find()
    .select("-__v")
    .sort("name");
  res.send(products);
});

router.post("/", [auth, admin, upload], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(400).send("Invalid product category.");

  const product = new Product({
    name: req.body.name,
    slug: createSlug(req.body.name.split(" ").join("-")),
    category: {
      _id: category._id,
      name: category.name,
    },
    price: req.body.price,
    featured: req.body.featured,
    description: req.body.description,
    extras: req.body.extras,
    images: req.file.filename,
  });
  await product.save();

  res.send(product);
});

router.put("/:id", [auth, admin, upload], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(400).send("Invalid product category.");

  const product = await Product.findByIdAndUpdate(
    req.params.id,

    {
      name: req.body.name,
      slug: createSlug(req.body.name.split(" ").join("-")),
      category: {
        _id: category._id,
        name: category.name,
      },
      price: req.body.price,
      featured: req.body.featured,
      description: req.body.description,
      extras: req.body.extras,
      images: req.file.filename,
    },
    { new: true }
  );

  if (!product)
    return res.status(404).send("The Product with the given ID was not found.");

  res.send(product);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const product = await Product.findByIdAndRemove(req.params.id);

  if (!product)
    return res.status(404).send("The Product with the given ID was not found.");

  res.send(product);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const product = await Product.findById(req.params.id).select("-__v");

  if (!product)
    return res.status(404).send("The Product with the given ID was not found.");

  res.send(product);
});

module.exports = router;
