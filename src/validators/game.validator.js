import { gameSchema } from "../schemas/game.schema.js";

export default function gameValidator(game) {
  const validation = gameSchema.validate(game, {
    abortEarly: false,
  });

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return errors;
  } else {
    return null;
  }
}
