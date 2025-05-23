import connection from '../database.js';

// Cria um novo aluguel
async function createRental(customerId, gameId, rentDate, daysRented, originalPrice) {
  await connection.query(
    `INSERT INTO rentals 
     ("customerId", "gameId", "rentDate", "daysRented", "originalPrice") 
     VALUES ($1, $2, $3, $4, $5);`,
    [customerId, gameId, rentDate, daysRented, originalPrice]
  );
}

// Busca um jogo por ID (para pegar o preço e estoque)
async function findGameById(gameId) {
  const result = await connection.query('SELECT * FROM games WHERE id = $1;', [gameId]);
  return result.rows[0];
}

// Busca um cliente por ID (para validar existência)
async function findCustomerById(customerId) {
  const result = await connection.query('SELECT * FROM customers WHERE id = $1;', [customerId]);
  return result.rows[0];
}

// Verifica se há jogos disponíveis para alugar
async function countRentalsByGameId(gameId) {
  const result = await connection.query(
    `SELECT COUNT(*) FROM rentals 
     WHERE "gameId" = $1 AND "returnDate" IS NULL;`,
    [gameId]
  );
  return parseInt(result.rows[0].count);
}
async function getRentals() {
  const result = await connection.query(`
    SELECT 
      rentals.*,
      customers.name AS "customerName",
      games.name AS "gameName"
    FROM rentals
    JOIN customers ON rentals."customerId" = customers.id
    JOIN games ON rentals."gameId" = games.id;
  `);
  return result.rows;
}

// Busca um aluguel por ID
async function findRentalById(id) {
  const result = await connection.query('SELECT * FROM rentals WHERE id = $1;', [id]);
  return result.rows[0];
}

// Busca o preço por dia do jogo associado ao aluguel
async function getGamePricePerDay(gameId) {
  const result = await connection.query('SELECT "pricePerDay" FROM games WHERE id = $1;', [gameId]);
  return result.rows[0].pricePerDay;
}

// Finaliza o aluguel (atualiza returnDate e delayFee)
async function finishRental(id, returnDate, delayFee) {
  await connection.query(
    `UPDATE rentals 
     SET "returnDate" = $1::date, "delayFee" = $2 
     WHERE id = $3;`,
    [returnDate, delayFee, id]
  );
}

async function deleteRental(id) {
  const result = await connection.query(
    'DELETE FROM rentals WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0]; // Retorna o aluguel deletado (ou undefined)
}

async function findRentalWithReturnStatus(id) {
  const result = await connection.query(
    `SELECT id, "returnDate" FROM rentals WHERE id = $1`,
    [id]
  );
  return result.rows[0]; // Retorna { id: X, returnDate: null/date } ou undefined
}

export default { 
  createRental, 
  findGameById, 
  findCustomerById, 
  countRentalsByGameId,
  getRentals,
  findRentalById,
  getGamePricePerDay,
  finishRental,
  deleteRental,
  findRentalWithReturnStatus 
};