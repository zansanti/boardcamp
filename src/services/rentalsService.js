import rentalsRepository from '../repositories/rentalsRepository.js';
import { default as rentalSchema, finishRentalSchema } from '../schemas/rentalsSchema.js';

// Função para formatar datas (YYYY-MM-DD)
function formatDate(date) {
  if (!date) return null;
  if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) return date;
  return new Date(date).toISOString().split('T')[0];
}

// Função para calcular dias de atraso
function calculateDaysLate(rentDate, daysRented, returnDate) {
  // Garante que as datas são objetos Date (ignora horário/localidade)
  const rent = new Date(rentDate.split('T')[0]);
  const expectedReturn = new Date(rent);
  expectedReturn.setDate(rent.getDate() + daysRented);
  
  const actualReturn = new Date(returnDate.split('T')[0]);

  // Diferença em milissegundos → dias
  const diffMs = actualReturn - expectedReturn;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // Arredonda para baixo

  return diffDays > 0 ? diffDays : 0; // Retorna 0 se não houver atraso
}

// Cria um novo aluguel
async function createRental(customerId, gameId, daysRented) {
  // Validação dos dados de entrada
  const { error } = rentalSchema.validate({ customerId, gameId, daysRented });
  if (error) throw { type: 'BAD_REQUEST', message: error.details[0].message };

  // Verifica se cliente e jogo existem
  const [customer, game] = await Promise.all([
    rentalsRepository.findCustomerById(customerId),
    rentalsRepository.findGameById(gameId)
  ]);
  if (!customer) throw { type: 'NOT_FOUND', message: 'Cliente não encontrado!' };
  if (!game) throw { type: 'NOT_FOUND', message: 'Jogo não encontrado!' };

  // Verifica estoque disponível
  const activeRentals = await rentalsRepository.countRentalsByGameId(gameId);
  if (activeRentals >= game.stockTotal) {
    throw { type: 'UNPROCESSABLE_ENTITY', message: 'Jogo sem estoque disponível!' };
  }

  // Calcula preço original e data de início
  const originalPrice = daysRented * game.pricePerDay;
  const rentDate = new Date().toISOString().split('T')[0];

  // Cria o aluguel no banco
  await rentalsRepository.createRental(customerId, gameId, rentDate, daysRented, originalPrice);
}

// Lista todos os aluguéis
async function getRentals() {
  const rentals = await rentalsRepository.getRentals();
  return rentals.map(rental => ({
    id: rental.id,
    customerId: rental.customerId,
    gameId: rental.gameId,
    rentDate: formatDate(rental.rentDate),
    daysRented: rental.daysRented,
    returnDate: formatDate(rental.returnDate),
    originalPrice: rental.originalPrice,
    delayFee: rental.delayFee,
    customer: { id: rental.customerId, name: rental.customerName },
    game: { id: rental.gameId, name: rental.gameName }
  }));
}

async function finishRental(id, returnDate) {
  try {
    // 1. Busca o aluguel
    const rental = await rentalsRepository.findRentalById(id);
    if (!rental) throw { type: 'NOT_FOUND', message: 'Aluguel não existe!' };
    if (rental.returnDate) throw { type: 'CONFLICT', message: 'Aluguel já finalizado!' };

    // 2. Garante que returnDate é válida (ou usa a atual)
    const effectiveReturnDate = returnDate || new Date().toISOString().split('T')[0];

    // 3. Cálculo CORRETO do atraso (em milissegundos)
    const rentDateObj = new Date(rental.rentDate);
    const expectedReturnObj = new Date(rental.rentDate);
    expectedReturnObj.setDate(rentDateObj.getDate() + rental.daysRented);
    
    const actualReturnObj = new Date(effectiveReturnDate);
    const diffMs = actualReturnObj - expectedReturnObj;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // Arredonda para baixo

    // 4. Calcula a multa se houver atraso
    const game = await rentalsRepository.findGameById(rental.gameId);
    const delayFee = diffDays > 0 ? diffDays * game.pricePerDay : null;

    // 5. Atualiza no banco
    await rentalsRepository.finishRental(id, effectiveReturnDate, delayFee);

  } catch (err) {
    console.error('Erro em finishRental:', { 
      error: err.message,
      stack: err.stack,
      rentalId: id,
      returnDate
    });
    throw err;
  }
}

async function deleteRental(id) {
  // 1. Busca o aluguel COM returnDate (usando LEFT JOIN para garantir)
  const rental = await rentalsRepository.findRentalWithReturnStatus(id);
  
  if (!rental) {
    throw { type: 'NOT_FOUND', message: 'Aluguel não encontrado!' };
  }

  // 2. Validação EXTRA (proteção dupla)
  if (rental.returnDate === null || rental.returnDate === undefined) {
    throw {
      type: 'BAD_REQUEST',
      message: 'Não é possível deletar aluguéis ativos! Finalize o aluguel primeiro.'
    };
  }

  // 3. Delete (só executa se passou nas validações)
  await rentalsRepository.deleteRental(id);
}

export default { createRental, getRentals, finishRental, deleteRental };