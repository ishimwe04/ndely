const { Appointment, validate } = require("../models/appointment");
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

const upload = multer({ storage: storage }).single("sampleImage");

router.get("/", async (req, res) => {
  const appointments = await Appointment.find()
    .select("-__v")
    .sort("timeframe");
  res.send(appointments);
});

router.post("/", [auth, upload], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(400).send("Invalid product category.");

  const appointment = new Appointment({
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    category: {
      _id: category._id,
      name: category.name,
    },
    sampleImage: req.file.filename,
    timeframe: req.body.timeframe,
    message: req.body.message,
  });
  await appointment.save();

  res.send(appointment);
});

router.put("/:id", [auth, upload], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(400).send("Invalid product category.");

  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,

    {
    email: req.body.email,
    phone: req.body.phone,
    address: req.body.address,
    category: {
      _id: category._id,
      name: category.name,
    },
    sampleImage: req.file.filename,
    timeframe: req.body.timeframe,
    message: req.body.message,
    },
    { new: true }
  );

  if (!appointment)
    return res.status(404).send("The appointment with the given ID was not found.");

  res.send(appointment);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const appointment = await Appointment.findByIdAndRemove(req.params.id);

  if (!appointment)
    return res.status(404).send("The appointment with the given ID was not found.");

  res.send(appointment);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).select("-__v");

  if (!appointment)
    return res.status(404).send("The appointment with the given ID was not found.");

  res.send(appointment);
});

module.exports = router;

