import gameValidator from "../validators/game.validator.js";

export async function createGame(req, res) {
  try {
    const game = {
      name: req.body.name,
      image: req.body.image,
      stockTotal: req.body.stockTotal,
      pricePerDay: req.body.pricePerDay,
    };

    const error = gameValidator(game);
    if (error) return res.status(422).send(error);

    return res.sendStatus(201);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function getAllGames(req, res) {
  try {
    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}
