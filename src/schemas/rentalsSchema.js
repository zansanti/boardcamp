import Joi from 'joi';

// Schema para CRIAÇÃO de aluguéis
const rentalSchema = Joi.object({
  customerId: Joi.number().integer().min(1).required(),
  gameId: Joi.number().integer().min(1).required(),
  daysRented: Joi.number().integer().min(1).required()
});

const finishRentalSchema = Joi.object({
  returnDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$|^\d{8}$/) // Aceita "YYYY-MM-DD" ou "YYYYMMDD"
    .required()
    .custom((value, helpers) => {
      // Converte "YYYYMMDD" para "YYYY-MM-DD" se necessário
      const formattedDate = value.includes('-') ? value : 
        `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
      
      const date = new Date(formattedDate);
      return isNaN(date.getTime()) ? helpers.error('date.invalid') : formattedDate;
    }, 'Date validation')
});

// Exportação organizada
export {
  rentalSchema as default,
  finishRentalSchema
};