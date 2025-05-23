import gamesService from '../services/gamesService.js';

async function getGames(req, res) {
  const games = await gamesService.getGames();
  res.status(200).send(games);
}

async function createGame(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;
  await gamesService.createGame(name, image, stockTotal, pricePerDay);
  res.sendStatus(201);
}

async function getGameById(req, res) {
  const { id } = req.params;
  const game = await gamesService.getGameById(id);
  res.status(200).send(game);
}

export default { getGames, createGame, getGameById };