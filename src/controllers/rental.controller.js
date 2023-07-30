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

    const { rows: rentals } = await db.query(
      `SELECT * FROM rentals WHERE "gameId"=$1`,
      [game.id]
    );

    let rented = 0;

    rentals.map((rental) => {
      if (rental.returnDate == null) rented += 1;
    });

    if (rented >= game.stockTotal) return res.sendStatus(400);

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

export async function getAllRentals(req, res) {
  try {
    const { rows: rentals } = await db.query(`
      SELECT
        r.*,
        c.id AS customer_id,
        c.name AS customer_name,
        g.id AS game_id,
        g.name AS game_name
      FROM
        rentals AS r
      JOIN customers AS c ON r."customerId" = c.id
      JOIN games AS g ON r."gameId" = g.id;
    `);

    const rentalsFormatted = rentals.map((rental) => {
      const newRental = {
        ...rental,
        customer: {
          id: rental.customer_id,
          name: rental.customer_name,
        },
        game: {
          id: rental.game_id,
          name: rental.game_name,
        },
      };

      delete newRental.customer_id;
      delete newRental.customer_name;
      delete newRental.game_id;
      delete newRental.game_name;

      return newRental;
    });

    return res.status(200).send(rentalsFormatted);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function finalizeRental(req, res) {
  try {
    const { id } = req.params;

    const {
      rows: [rental],
    } = await db.query(
      `
      SELECT 
        r.*, 
        g."pricePerDay" AS "game_pricePerDay"
      FROM rentals AS r
      JOIN games AS g ON r."gameId" = g.id
      WHERE r.id = $1;
    `,
      [id]
    );

    if (!rental) return res.sendStatus(404);
    if (rental.returnDate != null) return res.sendStatus(400);

    const currentDate = dayjs();
    const returnDate = currentDate.add(rental.daysRented, "day");
    const lateDays = currentDate.diff(returnDate, "day");

    const newRental = {
      ...rental,
      returnDate: currentDate.format("YYYY-MM-DD"),
      delayFee: lateDays > 0 ? lateDays * rental.game_pricePerDay : null,
    };

    await db.query(
      `UPDATE rentals SET 
        "returnDate"=$1,
        "delayFee"=$2
      WHERE id = $3;`,
      [newRental.returnDate, newRental.delayFee, id]
    );

    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function deleteRental(req, res) {
  try {
    const { id } = req.params;

    const {
      rows: [rental],
    } = await db.query("SELECT * FROM rentals WHERE id = $1;", [id]);

    if (!rental) return res.sendStatus(404);
    if (rental.returnDate == null) return res.sendStatus(400);

    await db.query("DELETE FROM rentals WHERE id = $1;", [id]);

    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}
