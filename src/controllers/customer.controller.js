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
    if (error) return res.status(422).send(error);

    const userExist = await db.query(
      "SELECT * FROM customers WHERE cpf = $1;",
      [c.cpf]
    );

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
    const id = req.params;
    if (!id) return res.sendStatus(404);

    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function editCustomer(req, res) {
  try {
    const customer = {
      name: "João Alfredo",
      phone: "21998899222",
      cpf: "01234567890",
      birthday: "1992-10-25",
    };

    const error = customerValidator(customer);
    if (error) return res.status(422).send(error);

    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

export async function getAllCustomers(req, res) {
  try {
    const response = await db.query("SELECT * FROM customers;");
    const customers = response.rows;

    return res.status(200).send(customers);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}
