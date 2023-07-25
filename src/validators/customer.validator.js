import { customerSchema } from "../schemas/customer.schema.js";

export default function customerValidator(customer) {
  const validation = customerSchema.validate(customer, {
    abortEarly: false,
  });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return errors;
  } else {
    return null;
  }
}
