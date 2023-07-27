import { db } from "../database/database.connection.js";
import gameValidator from "../validators/game.validator.js";

export async function createGame(req, res) {
  try {
    const g = {
      name: req.body.name,
      image: req.body.image,
      stockTotal: req.body.stockTotal,
      pricePerDay: req.body.pricePerDay,
    };

    const error = gameValidator(g);
    if (error) return res.status(400).send(error);

    const response = await db.query("SELECT * FROM games WHERE name=$1;", [
      g.name,
    ]);

    if (response.rows[0]) return res.sendStatus(409);

    await db.query(
      `INSERT INTO games (name,image,"stockTotal","pricePerDay") VALUES ($1,$2,$3,$4);`,
      [g.name, g.image, g.stockTotal, g.pricePerDay]
    );

    return res.sendStatus(201);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function getAllGames(req, res) {
  try {
    const response = await db.query("SELECT * FROM games;");
    const games = response.rows;

    return res.status(200).send(games);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}
