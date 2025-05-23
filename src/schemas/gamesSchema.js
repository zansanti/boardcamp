import Joi from 'joi';

const gameSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().uri().required(),
  stockTotal: Joi.number().integer().min(1).required(),
  pricePerDay: Joi.number().integer().min(1).required(),
});

export default gameSchema;