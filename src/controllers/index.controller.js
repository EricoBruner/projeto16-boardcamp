import { createGame, getAllGames } from "./game.controller.js";
import {
  getAllCustomers,
  getCustomer,
  createCustomer,
  editCustomer,
} from "./customer.controller.js";

export const gameController = { createGame, getAllGames };

export const customerController = {
  createCustomer,
  editCustomer,
  getCustomer,
  getAllCustomers,
};
