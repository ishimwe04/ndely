const Joi = require("joi");
const mongoose = require("mongoose");
const { categorySchema } = require("./category");

const appointmentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address:{
    type: String,
    required: true,
  },
  category: {
    type: categorySchema,
    required: true,
  },
  sampleImage: {
    type: String,
  },
  timeframe: {
    type: Date,
    required: true
  },
  message: {
    type: String,
    required: true,
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

function validateAppointment(appointment) {
  const schema = {
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    categoryId: Joi.objectId().required(),
    timeframe: Joi.date().required(),
    message: Joi.string(),
  };

  return Joi.validate(appointment, schema);
}

exports.Appointment = Appointment;
exports.validate = validateAppointment;
