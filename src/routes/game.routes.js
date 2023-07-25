import { Router } from "express";

import { gameController } from "../controllers/index.controller.js";

const gameRouter = Router();

gameRouter.get("/games", gameController.getAllGames);

gameRouter.post("/games", gameController.createGame);

export default gameRouter;
