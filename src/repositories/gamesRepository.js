import connection from '../database.js';

async function getGames() {
  const result = await connection.query('SELECT * FROM games;');
  return result.rows;
}

async function createGame(name, image, stockTotal, pricePerDay) {
  await connection.query(
    'INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);',
    [name, image, stockTotal, pricePerDay]
  );
}

async function findGameByName(name) {
  const result = await connection.query('SELECT * FROM games WHERE name = $1;', [name]);
  return result.rows[0];
}

async function getGameById(id) {
  const result = await connection.query('SELECT * FROM games WHERE id = $1;', [id]);
  return result.rows[0];
}

export default { getGames, createGame, findGameByName, getGameById };