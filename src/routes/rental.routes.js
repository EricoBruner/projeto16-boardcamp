import { Router } from "express";
import { rentalController } from "../controllers/index.controller.js";

const rentalRouter = Router();

rentalRouter.post("/rentals", rentalController.createRental);

export default rentalRouter;
