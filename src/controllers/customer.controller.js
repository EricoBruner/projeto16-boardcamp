import customerValidator from "../validators/customer.validator.js";

export async function createCustomer(req, res) {
  try {
    const customer = {
      name: "João Alfredo",
      phone: "21998899222",
      cpf: "01234567890",
      birthday: "1992-10-25",
    };

    const error = customerValidator(customer);
    if (error) return res.status(422).send(error);

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
    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}
