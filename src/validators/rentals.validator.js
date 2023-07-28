import { rentalSchema } from "../schemas/rentals.schema.js";

export default function rentalValidator(rental) {
  const validation = rentalSchema.validate(rental, {
    abortEarly: false,
  });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return errors;
  } else {
    return null;
  }
}
