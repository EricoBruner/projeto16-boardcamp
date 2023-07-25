import { createGame, getAllGames } from "./game.controller.js";
import { getAllCustomers, getCustomer } from "./customer.controller.js";

export const gameController = { createGame, getAllGames };

export const customerController = { getCustomer, getAllCustomers };
