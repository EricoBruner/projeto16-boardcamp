import { db } from "../database/database.connection.js";
import customerValidator from "../validators/customer.validator.js";

export async function createCustomer(req, res) {
  try {
    const c = {
      name: req.body.name,
      phone: req.body.phone,
      cpf: req.body.cpf,
      birthday: req.body.birthday,
    };

    const error = customerValidator(c);
    if (error) return res.status(400).send(error);

    const {
      rows: [userExist],
    } = await db.query("SELECT * FROM customers WHERE cpf = $1;", [c.cpf]);

    if (userExist) return res.sendStatus(409);

    await db.query(
      "INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1,$2,$3,$4);",
      [c.name, c.phone, c.cpf, c.birthday]
    );

    return res.sendStatus(201);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function getCustomer(req, res) {
  try {
    const { id } = req.params;

    if (!id || id < 0 || isNaN(id)) return res.sendStatus(404);

    const response = await db.query(
      "SELECT *,TO_CHAR(birthday, 'YYYY-MM-DD') AS birthday FROM customers WHERE id=$1;",
      [id]
    );

    const customer = response.rows[0];
    if (!customer) return res.sendStatus(404);

    return res.status(200).send(customer);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function editCustomer(req, res) {
  try {
    const c = {
      name: req.body.name,
      phone: req.body.phone,
      cpf: req.body.cpf,
      birthday: req.body.birthday,
    };

    const error = customerValidator(c);
    if (error) return res.status(400).send(error);

    const { id } = req.params;
    if (!id || id < 0 || isNaN(id)) return res.sendStatus(404);

    const response = await db.query("SELECT * FROM customers WHERE id=$1;", [
      id,
    ]);

    const customer = response.rows[0];

    if (customer.cpf != c.cpf) return res.sendStatus(409);

    await db.query(
      "UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5;",
      [c.name, c.phone, c.cpf, c.birthday, id]
    );

    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function getAllCustomers(req, res) {
  try {
    const response = await db.query(
      "SELECT *,TO_CHAR(birthday, 'YYYY-MM-DD') AS birthday FROM customers;"
    );
    const customers = response.rows;

    return res.status(200).send(customers);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}
