import joi from "joi";

export const rentalSchema = joi.object({
  customerId: joi.number().required(),
  gameId: joi.number().required(),
  rentDate: joi.date().required(),
  daysRented: joi.number().positive().required(),
  returnDate: joi.date().allow(null).required(),
  originalPrice: joi.number().allow(null).required(),
  delayFee: joi.date().allow(null).required(),
});
