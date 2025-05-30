import Joi from 'joi';

// Schema para CRIAÇÃO de aluguéis
const rentalSchema = Joi.object({
  customerId: Joi.number().integer().min(1).required(),
  gameId: Joi.number().integer().min(1).required(),
  daysRented: Joi.number().integer().min(1).required()
});

const finishRentalSchema = Joi.object({});

// Exportação organizada
export {
  rentalSchema as default,
  finishRentalSchema
};