import rentalsService from '../services/rentalsService.js';
import rentalsSchema from '../schemas/rentalsSchema.js';
const { finishRentalSchema } = rentalsSchema;

async function createRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  await rentalsService.createRental(customerId, gameId, daysRented);
  res.sendStatus(201);
}

async function getRentals(req, res) {
  const rentals = await rentalsService.getRentals();
  res.status(200).send(rentals);
}

async function finishRental(req, res) {
  const { id } = req.params;
  const { returnDate } = req.body; 
  
  await rentalsService.finishRental(id, returnDate);
  res.sendStatus(200);
}

async function deleteRental(req, res) {
  const { id } = req.params;
  await rentalsService.deleteRental(id);
  res.sendStatus(200); // Sucesso!
}

export default { createRental, getRentals, finishRental, deleteRental };