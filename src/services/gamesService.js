import gamesRepository from '../repositories/gamesRepository.js';
import gamesSchema from '../schemas/gamesSchema.js';

async function getGames() {
  return await gamesRepository.getGames();
}

async function createGame(name, image, stockTotal, pricePerDay) {
  const validation = gamesSchema.validate({ name, image, stockTotal, pricePerDay });
  if (validation.error) {
    throw { type: 'BAD_REQUEST', message: validation.error.details[0].message };
  }

  const gameExists = await gamesRepository.findGameByName(name);
  if (gameExists) {
    throw { type: 'CONFLICT', message: 'Este jogo já está cadastrado!' };
  }

  await gamesRepository.createGame(name, image, stockTotal, pricePerDay);
}

async function getGameById(id) {
  const game = await gamesRepository.getGameById(id);
  if (!game) {
    throw { type: 'NOT_FOUND', message: 'Jogo não encontrado!' };
  }
  return game;
}

export default { getGames, createGame, getGameById };