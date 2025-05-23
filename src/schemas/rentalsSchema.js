import Joi from 'joi';

// Schema para CRIAÇÃO de aluguéis
const rentalSchema = Joi.object({
  customerId: Joi.number().integer().min(1).required(),
  gameId: Joi.number().integer().min(1).required(),
  daysRented: Joi.number().integer().min(1).required()
});

// Schema para FINALIZAÇÃO de aluguéis
const finishRentalSchema = Joi.object({
  returnDate: Joi.date().iso().required()  // Adicionei .iso() para garantir o formato
});

// Exportação organizada
export {
  rentalSchema as default,
  finishRentalSchema
};