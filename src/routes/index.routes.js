import { Router } from "express";
import gameRouter from "./game.routes.js";
import customerRouter from "./customer.routes.js";

const router = Router();

router.use(customerRouter);
router.use(gameRouter);

export default router;
