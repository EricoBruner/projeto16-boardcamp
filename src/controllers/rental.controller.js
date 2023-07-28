import dayjs from "dayjs";
import rentalValidator from "../validators/rentals.validator.js";
import { db } from "../database/database.connection.js";

export async function createRental(req, res) {
  try {
    if (req.body.daysRented < 1) return res.sendStatus(400);

    const currentDate = dayjs().format("YYYY-MM-DD");

    const r = {
      customerId: req.body.customerId,
      gameId: req.body.gameId,
      rentDate: currentDate,
      daysRented: req.body.daysRented,
      returnDate: null,
      originalPrice: null,
      delayFee: null,
    };

    const error = rentalValidator(r);
    if (error) return res.status(400).send(error);

    const {
      rows: [customer],
    } = await db.query("SELECT * FROM customers WHERE id = $1;", [
      req.body.customerId,
    ]);
    if (!customer) return res.sendStatus(400);

    const {
      rows: [game],
    } = await db.query("SELECT * FROM games WHERE id = $1;", [req.body.gameId]);
    if (!game) return res.sendStatus(400);

    r.originalPrice = r.daysRented * game.pricePerDay;

    await db.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1,$2,$3,$4,$5,$6,$7);`,
      [
        r.customerId,
        r.gameId,
        r.rentDate,
        r.daysRented,
        r.returnDate,
        r.originalPrice,
        r.delayFee,
      ]
    );

    return res.sendStatus(201);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

/*
  const returnDate = currentDate.add(req.body.daysRented, "day");
  const lateDays = returnDate.diff(currentDate, "day");
  delayFee: lateDays > 0 ? lateDays * game.pricePerDay : 0,
*/
