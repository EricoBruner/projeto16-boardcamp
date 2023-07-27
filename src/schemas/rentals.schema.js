import joi from "joi";

export const gameSchema = joi.object({
  customerId: joi.number().required(),
  gameId: joi.number().required(),
  rentDate: joi.date().required(), // data em que o aluguel foi feito
  daysRented: joi.date().required(), // por quantos dias o cliente agendou o aluguel
  returnDate: joi.date().default(null), // data que o cliente devolveu o jogo (null enquanto não devolvido)
  originalPrice: joi.number().required(), // preço total do aluguel em centavos (dias alugados vezes o preço por dia do jogo)
  delayFee: joi.date().default(null), // multa total paga por atraso (dias que passaram do prazo vezes o preço por dia do jogo)
});
