const Joi = require('joi');

const createMeasurementSchema = Joi.object({
  deviceId: Joi.string().required(),
  temperature: Joi.number().min(-50).max(100).required(),
  humidityAir: Joi.number().min(0).max(100).required(),
  soilMoisture: Joi.number().min(0).max(100).required(),
  illuminance: Joi.number().min(0).required(),
});

module.exports = { createMeasurementSchema };