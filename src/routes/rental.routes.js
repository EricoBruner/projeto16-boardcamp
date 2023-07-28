import { Router } from "express";
import { rentalController } from "../controllers/index.controller.js";

const rentalRouter = Router();

rentalRouter.post("/rentals", rentalController.createRental);
rentalRouter.post("/rentals/:id/return", rentalController.finalizeRental);

rentalRouter.get("/rentals", rentalController.getAllRentals);

export default rentalRouter;
